import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { adapters } from '@/lib/providers'
import { sendCodeEmail, sendAdminAlert } from '@/lib/email'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const startedAt = Date.now()

  const orders = await query<any>(`
    SELECT o.id, o.provider_order_id, o.attempts, o.created_at,
           p.name as provider_name, p.api_url, p.api_key
    FROM orders o
    JOIN providers p ON p.id = o.provider_id
    WHERE o.status = 'processing'
      AND o.created_at > NOW() - INTERVAL '7 days'
      AND o.provider_order_id IS NOT NULL
    ORDER BY o.created_at ASC
    LIMIT 50
  `)

  const results = { checked: orders.length, completed: 0, failed: 0, errors: 0 }

  for (const order of orders) {
    const adapter = adapters[order.provider_name]
    if (!adapter) { results.errors++; continue }

    try {
      const result = await adapter.poll(order.provider_order_id, order.api_key, order.api_url)

      if (result.success && result.code) {
        await query(
          `UPDATE orders SET status = 'completed', unlock_code = $1, updated_at = NOW() WHERE id = $2`,
          [result.code, order.id]
        )
        await sendCodeEmail(order.id).catch(console.error)
        results.completed++
      } else if (result.error) {
        const newAttempts = (order.attempts ?? 0) + 1
        const isFatal = newAttempts >= 10 || isFatalError(result.error)
        await query(
          `UPDATE orders SET attempts = $1, error_msg = $2, status = $3, updated_at = NOW() WHERE id = $4`,
          [newAttempts, result.error, isFatal ? 'failed' : 'processing', order.id]
        )
        if (isFatal) {
          results.failed++
          await sendAdminAlert(order.id, `Échec définitif (${newAttempts} tentatives) : ${result.error}`).catch(console.error)
        }
      } else {
        await query(`UPDATE orders SET attempts = attempts + 1 WHERE id = $1`, [order.id])
      }

      const ageHours = (Date.now() - new Date(order.created_at).getTime()) / 3_600_000
      if (ageHours > 48 && (order.attempts ?? 0) % 12 === 0) {
        await sendAdminAlert(order.id, `Commande en attente depuis ${Math.round(ageHours)}h.`).catch(console.error)
      }
    } catch (err: any) {
      console.error(`[cron] poll error for ${order.id}:`, err.message)
      results.errors++
    }
  }

  return NextResponse.json({ ok: true, duration: Date.now() - startedAt, ...results })
}

export async function GET() {
  const [{ count }] = await query<any>(
    `SELECT COUNT(*) as count FROM orders WHERE status = 'processing'`
  )
  return NextResponse.json({ processing: Number(count), timestamp: new Date().toISOString() })
}

function isFatalError(msg: string): boolean {
  const fatals = ['invalid imei', 'imei not supported', 'blacklisted', 'already unlocked', 'not found']
  return fatals.some(f => msg.toLowerCase().includes(f))
}
