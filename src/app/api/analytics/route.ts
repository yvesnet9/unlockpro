import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, 'admin')
  if (auth instanceof NextResponse) return auth

  const range = req.nextUrl.searchParams.get('range') ?? '30'
  const days  = Math.min(365, Math.max(7, Number(range)))

  const kpis = await queryOne<any>(`
    SELECT
      COUNT(*)                                                          AS orders_total,
      COUNT(*) FILTER (WHERE status = 'completed')                     AS orders_completed,
      COUNT(*) FILTER (WHERE status = 'failed')                        AS orders_failed,
      COUNT(*) FILTER (WHERE status = 'processing' OR status = 'paid') AS orders_pending,
      COALESCE(SUM(amount) FILTER (WHERE status='completed'), 0)       AS revenue,
      COALESCE(SUM(amount - COALESCE(cost,0)) FILTER (WHERE status='completed'), 0) AS profit,
      COALESCE(AVG(amount) FILTER (WHERE status='completed'), 0)       AS avg_order_value,
      COALESCE(SUM(amount) FILTER (WHERE status='completed' AND created_at > NOW() - ($1 || ' days')::INTERVAL), 0) AS revenue_period
    FROM orders
  `, [days])

  const conversionRate = kpis.orders_total > 0
    ? Math.round((kpis.orders_completed / kpis.orders_total) * 100) : 0

  const dailyRevenue = await query<any>(`
    SELECT
      TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS day,
      COUNT(*) AS orders,
      COUNT(*) FILTER (WHERE status='completed') AS completed,
      COALESCE(SUM(amount) FILTER (WHERE status='completed'), 0) AS revenue,
      COALESCE(SUM(amount - COALESCE(cost,0)) FILTER (WHERE status='completed'), 0) AS profit
    FROM orders
    WHERE created_at > NOW() - ($1 || ' days')::INTERVAL
    GROUP BY DATE(created_at)
    ORDER BY day ASC
  `, [days])

  const topServices = await query<any>(`
    SELECT s.name, s.brand, s.carrier,
      COUNT(o.id) AS orders,
      COUNT(o.id) FILTER (WHERE o.status='completed') AS completed,
      COALESCE(SUM(o.amount) FILTER (WHERE o.status='completed'), 0) AS revenue
    FROM services s
    LEFT JOIN orders o ON o.service_id = s.id
      AND o.created_at > NOW() - ($1 || ' days')::INTERVAL
    GROUP BY s.id, s.name, s.brand, s.carrier
    ORDER BY revenue DESC LIMIT 10
  `, [days])

  const byCarrier = await query<any>(`
    SELECT s.carrier,
      COUNT(o.id) FILTER (WHERE o.status='completed') AS orders,
      COALESCE(SUM(o.amount) FILTER (WHERE o.status='completed'), 0) AS revenue
    FROM orders o JOIN services s ON s.id = o.service_id
    WHERE o.created_at > NOW() - ($1 || ' days')::INTERVAL
    GROUP BY s.carrier ORDER BY revenue DESC
  `, [days])

  const byBrand = await query<any>(`
    SELECT s.brand,
      COUNT(o.id) FILTER (WHERE o.status='completed') AS orders,
      COALESCE(SUM(o.amount) FILTER (WHERE o.status='completed'), 0) AS revenue
    FROM orders o JOIN services s ON s.id = o.service_id
    WHERE o.created_at > NOW() - ($1 || ' days')::INTERVAL
    GROUP BY s.brand ORDER BY revenue DESC
  `, [days])

  const byProvider = await query<any>(`
    SELECT p.name,
      COUNT(o.id) AS orders,
      COUNT(o.id) FILTER (WHERE o.status='completed') AS completed,
      COUNT(o.id) FILTER (WHERE o.status='failed') AS failed,
      COALESCE(AVG(o.attempts), 0) AS avg_attempts,
      COALESCE(SUM(o.cost) FILTER (WHERE o.status='completed'), 0) AS total_cost
    FROM providers p
    LEFT JOIN orders o ON o.provider_id = p.id
      AND o.created_at > NOW() - ($1 || ' days')::INTERVAL
    GROUP BY p.id, p.name ORDER BY completed DESC
  `, [days])

  const supportStats = await queryOne<any>(`
    SELECT
      COUNT(*) FILTER (WHERE status='open')     AS open,
      COUNT(*) FILTER (WHERE status='pending')  AS pending,
      COUNT(*) FILTER (WHERE status='resolved') AS resolved,
      COALESCE(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)
        FILTER (WHERE resolved_at IS NOT NULL), 0) AS avg_resolution_hours
    FROM tickets
    WHERE created_at > NOW() - ($1 || ' days')::INTERVAL
  `, [days])

  return NextResponse.json({
    range: days,
    kpis: {
      ...kpis,
      conversionRate,
      revenue:       Number(kpis.revenue),
      profit:        Number(kpis.profit),
      avgOrderValue: Number(kpis.avg_order_value).toFixed(2),
      revenuePeriod: Number(kpis.revenue_period),
      margin: kpis.revenue > 0 ? Math.round((kpis.profit / kpis.revenue) * 100) : 0,
    },
    dailyRevenue:  dailyRevenue.map((r: any) => ({ ...r, revenue: Number(r.revenue), profit: Number(r.profit) })),
    topServices:   topServices.map((s: any) => ({ ...s, revenue: Number(s.revenue) })),
    byCarrier:     byCarrier.map((c: any) => ({ ...c, revenue: Number(c.revenue) })),
    byBrand:       byBrand.map((b: any) => ({ ...b, revenue: Number(b.revenue) })),
    byProvider:    byProvider.map((p: any) => ({ ...p, avg_attempts: Number(p.avg_attempts).toFixed(1), total_cost: Number(p.total_cost) })),
    support:       { ...supportStats, avg_resolution_hours: Number(supportStats?.avg_resolution_hours ?? 0).toFixed(1) },
    resellers:     { active_resellers: 0, orders: 0, revenue: 0 },
  })
}

export async function POST(req: NextRequest) {
  const { event, page, brand, carrier, amount, sessionId } = await req.json().catch(() => ({}))
  if (!event) return NextResponse.json({ ok: false })
  await query(
    `INSERT INTO analytics_events (event, page, brand, carrier, amount, session_id)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [event, page ?? null, brand ?? null, carrier ?? null, amount ?? null, sessionId ?? null]
  ).catch(() => {})
  return NextResponse.json({ ok: true })
}
