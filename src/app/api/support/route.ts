import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

const createSchema = z.object({
  email:    z.string().email(),
  name:     z.string().min(1).optional(),
  orderId:  z.string().uuid().optional(),
  subject:  z.string().min(3).max(200),
  message:  z.string().min(10).max(5000),
  category: z.enum(['code_not_received','code_not_working','payment','refund','other']).default('other'),
})

const replySchema = z.object({
  ticketId: z.string().uuid(),
  content:  z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname
  const body = await req.json().catch(() => null)

  if (path === '/api/support') {
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
    }
    const { email, name, orderId, subject, message, category } = parsed.data
    const priority = category === 'refund' || category === 'payment' ? 'high'
      : category === 'code_not_working' ? 'high'
      : category === 'code_not_received' ? 'normal' : 'low'

    let verifiedOrderId = null
    if (orderId) {
      const order = await queryOne(`SELECT id FROM orders WHERE id = $1 AND email = $2`, [orderId, email])
      verifiedOrderId = order ? orderId : null
    }

    const [ticket] = await query<{ id: string }>(
      `INSERT INTO tickets (email, name, order_id, subject, status, priority, category)
       VALUES ($1,$2,$3,$4,'open',$5,$6) RETURNING id`,
      [email, name ?? null, verifiedOrderId, subject, priority, category]
    )

    await query(
      `INSERT INTO ticket_messages (ticket_id, author_role, content) VALUES ($1,'customer',$2)`,
      [ticket.id, message]
    )

    return NextResponse.json({ ticketId: ticket.id, message: 'Ticket créé. Réponse sous 2–4h.' }, { status: 201 })
  }

  if (path === '/api/support/reply') {
    const auth = await requireAuth(req, 'admin')
    if (auth instanceof NextResponse) return auth
    const parsed = replySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
    const { ticketId, content } = parsed.data
    await query(
      `INSERT INTO ticket_messages (ticket_id, author_role, author_id, content) VALUES ($1,'admin',$2,$3)`,
      [ticketId, auth.userId, content]
    )
    await query(`UPDATE tickets SET status = 'pending', updated_at = NOW() WHERE id = $1`, [ticketId])
    return NextResponse.json({ ok: true })
  }

  if (path === '/api/support/status') {
    const auth = await requireAuth(req, 'admin')
    if (auth instanceof NextResponse) return auth
    const { ticketId, status } = body ?? {}
    if (!ticketId || !status) return NextResponse.json({ error: 'Champs requis.' }, { status: 400 })
    await query(
      `UPDATE tickets SET status=$1, resolved_at=CASE WHEN $1='resolved' THEN NOW() ELSE resolved_at END WHERE id=$2`,
      [status, ticketId]
    )
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Route inconnue.' }, { status: 404 })
}

export async function GET(req: NextRequest) {
  const url   = req.nextUrl
  const id    = url.searchParams.get('id')
  const email = url.searchParams.get('email')

  if (id && email) {
    const ticket = await queryOne<any>(
      `SELECT t.*, o.imei, o.status as order_status
       FROM tickets t LEFT JOIN orders o ON o.id = t.order_id
       WHERE t.id = $1 AND t.email = $2`,
      [id, email]
    )
    if (!ticket) return NextResponse.json({ error: 'Ticket introuvable.' }, { status: 404 })
    const messages = await query<any>(
      `SELECT content, author_role, created_at FROM ticket_messages
       WHERE ticket_id = $1 ORDER BY created_at ASC`,
      [id]
    )
    return NextResponse.json({ ticket, messages })
  }

  const auth = await requireAuth(req, 'admin')
  if (auth instanceof NextResponse) return auth

  const status   = url.searchParams.get('status') ?? 'all'
  const search   = url.searchParams.get('search') ?? ''
  const page     = Math.max(1, Number(url.searchParams.get('page') ?? 1))
  const perPage  = 20

  const conds: string[] = []
  const params: unknown[] = []
  let p = 1

  if (status !== 'all') { conds.push(`t.status = $${p++}`); params.push(status) }
  if (search) {
    conds.push(`(t.email ILIKE $${p} OR t.subject ILIKE $${p})`)
    params.push(`%${search}%`); p++
  }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : ''

  const tickets = await query<any>(`
    SELECT t.id, t.email, t.name, t.subject, t.status, t.priority, t.category,
           t.created_at, t.updated_at,
           COUNT(tm.id) as message_count
    FROM tickets t
    LEFT JOIN ticket_messages tm ON tm.ticket_id = t.id
    ${where}
    GROUP BY t.id
    ORDER BY
      CASE t.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
      t.updated_at DESC
    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
  `, params)

  const [{ count }] = await query<any>(`SELECT COUNT(*) FROM tickets t ${where}`, params)

  const stats = await queryOne<any>(`
    SELECT
      COUNT(*) FILTER (WHERE status='open')     as open,
      COUNT(*) FILTER (WHERE status='pending')  as pending,
      COUNT(*) FILTER (WHERE status='resolved') as resolved,
      COUNT(*) FILTER (WHERE priority='high' OR priority='urgent') as high_priority
    FROM tickets
  `)

  return NextResponse.json({ tickets, total: Number(count), stats, page, perPage })
}
