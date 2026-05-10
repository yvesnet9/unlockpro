import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, 'admin')
  if (auth instanceof NextResponse) return auth

  const url     = req.nextUrl
  const type    = url.searchParams.get('type') ?? 'unlock'
  const status  = url.searchParams.get('status') ?? 'all'
  const search  = url.searchParams.get('search') ?? ''
  const page    = Math.max(1, Number(url.searchParams.get('page') ?? 1))
  const perPage = 25
  const offset  = (page - 1) * perPage

  if (type === 'recharge') {
    const conditions: string[] = []
    const params: unknown[] = []
    let p = 1
    if (status !== 'all') { conditions.push(`status = $${p++}`); params.push(status) }
    if (search) { conditions.push(`(email ILIKE $${p} OR phone ILIKE $${p})`); params.push(`%${search}%`); p++ }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const stats = await queryOne<any>(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status IN ('processing','paid')) as pending,
        COALESCE(SUM(amount_eur) FILTER (WHERE status = 'completed'), 0) as revenue
      FROM recharge_orders
    `)

    const orders = await query<any>(`
      SELECT id, email, phone, operator_name, product_name,
             amount_eur, amount_destination, unit, status,
             dtone_transaction_id, error_msg, created_at
      FROM recharge_orders ${where}
      ORDER BY created_at DESC
      LIMIT ${perPage} OFFSET ${offset}
    `, params)

    const [{ count: total }] = await query<any>(
      `SELECT COUNT(*) FROM recharge_orders ${where}`, params
    )

    return NextResponse.json({ orders, stats, pagination: { page, perPage, total: Number(total) } })
  }

  // Unlock orders (default)
  const conditions: string[] = []
  const params: unknown[] = []
  let p = 1
  if (status !== 'all') { conditions.push(`o.status = $${p++}`); params.push(status) }
  if (search) { conditions.push(`(o.email ILIKE $${p} OR o.imei LIKE $${p})`); params.push(`%${search}%`); p++ }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const stats = await queryOne<any>(`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status IN ('processing','paid')) as pending,
      COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as revenue,
      COALESCE(SUM(amount - COALESCE(cost,0)) FILTER (WHERE status = 'completed'), 0) as profit
    FROM orders
  `)

  const orders = await query<any>(`
    SELECT o.id, o.email, o.imei, o.status, o.amount, o.cost,
           o.unlock_code, o.error_msg, o.created_at, o.updated_at,
           s.name as service_name, p.name as provider_name
    FROM orders o
    JOIN services s ON s.id = o.service_id
    LEFT JOIN providers p ON p.id = o.provider_id
    ${where}
    ORDER BY o.created_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  `, params)

  const [{ count: total }] = await query<any>(
    `SELECT COUNT(*) FROM orders o ${where}`, params
  )

  return NextResponse.json({ orders, stats, pagination: { page, perPage, total: Number(total) } })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, 'admin')
  if (auth instanceof NextResponse) return auth

  const { orderId, action, value, type } = await req.json()
  const table = type === 'recharge' ? 'recharge_orders' : 'orders'

  switch (action) {
    case 'set_status':
      await query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [value, orderId])
      break
    case 'set_code':
      await query(`UPDATE orders SET unlock_code = $1, status = 'completed' WHERE id = $2`, [value, orderId])
      await import('@/lib/email').then(m => m.sendCodeEmail(orderId)).catch(console.error)
      break
    case 'refund':
      await query(`UPDATE ${table} SET status = 'refunded' WHERE id = $1`, [orderId])
      break
    default:
      return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
