'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnalyticsData {
  kpis: any; dailyRevenue: any[]; topServices: any[]
  byCarrier: any[]; byBrand: any[]; byProvider: any[]
  support: any; resellers: any
}

const CARRIER_COLORS: Record<string, string> = { sfr: '#e2001a', orange: '#ff6600', bouygues: '#0060a9', free: '#cd1719' }
const BRAND_COLORS:   Record<string, string> = { apple: '#888', samsung: '#1428a0', huawei: '#cf0a2c', other: '#555' }

export default function AnalyticsDashboard() {
  const [data,    setData]    = useState<AnalyticsData | null>(null)
  const [range,   setRange]   = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics?range=${range}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [range])

  function fmt(n: number)  { return new Intl.NumberFormat('fr-FR').format(Math.round(n)) }
  function fmtE(n: number) { return `${fmt(n)} €` }
  function pct(a: number, b: number) { return b > 0 ? Math.round((a / b) * 100) : 0 }

  function BarChart({ items, valueKey, labelKey, colorMap }: { items: any[]; valueKey: string; labelKey: string; colorMap?: Record<string, string> }) {
    const max = Math.max(...items.map(i => Number(i[valueKey])), 1)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => {
          const val   = Number(item[valueKey])
          const color = colorMap?.[item[labelKey]] ?? '#a3ff6b'
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#666', width: '80px', textAlign: 'right', flexShrink: 0, textTransform: 'capitalize' }}>{item[labelKey]}</span>
              <div style={{ flex: 1, height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '8px', borderRadius: '4px', background: color, width: `${(val / max) * 100}%`, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#888', width: '60px', flexShrink: 0 }}>{fmtE(val)}</span>
            </div>
          )
        })}
      </div>
    )
  }

  function RevenueChart({ data }: { data: any[] }) {
    if (!data.length) return <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '13px' }}>Pas de données</div>
    const maxRev = Math.max(...data.map(d => d.revenue), 1)
    const W = 640, H = 120, padL = 8, padR = 8
    const barW = Math.max(2, (W - padL - padR) / data.length - 2)
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
        {data.map((d, i) => {
          const x    = padL + i * ((W - padL - padR) / data.length)
          const barH = Math.max(2, (d.revenue / maxRev) * (H - 20))
          const profH = Math.max(1, (d.profit / maxRev) * (H - 20))
          return (
            <g key={i}>
              <rect x={x} y={H - barH}  width={barW} height={barH}  fill="#1a2e0f" rx="2" />
              <rect x={x} y={H - profH} width={barW} height={profH} fill="#a3ff6b" rx="2" />
            </g>
          )
        })}
        <rect x="0"  y="0" width="10" height="10" fill="#1a2e0f" rx="2" />
        <text x="14" y="9" fill="#555" fontSize="10">Revenu</text>
        <rect x="55" y="0" width="10" height="10" fill="#a3ff6b" rx="2" />
        <text x="69" y="9" fill="#555" fontSize="10">Profit</text>
      </svg>
    )
  }

  const card: React.CSSProperties = { background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '22px' }

  if (loading) return <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#444' }}>Chargement…</div>
  if (!data)   return <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#ff6b6b' }}>Erreur de chargement</div>

  const { kpis, dailyRevenue, topServices, byCarrier, byBrand, byProvider, support, resellers } = data

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Dashboard</Link>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>Analytics</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[7, 30, 90, 365].map(r => (
            <button key={r} onClick={() => setRange(r)}
              style={{ padding: '7px 14px', borderRadius: '6px', border: `1px solid ${range === r ? '#a3ff6b' : '#222'}`, background: range === r ? '#1a2e0f' : 'transparent', color: range === r ? '#a3ff6b' : '#555', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              {r}j
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '12px' }}>
          {[
            { label: `REVENU ${range}J`, value: fmtE(kpis.revenue_period), accent: true },
            { label: 'PROFIT TOTAL',     value: fmtE(kpis.profit),          accent: true },
            { label: 'MARGE NETTE',      value: `${kpis.margin} %` },
            { label: 'TAUX CONVERSION',  value: `${kpis.conversionRate} %` },
            { label: 'PANIER MOYEN',     value: `${kpis.avgOrderValue} €` },
          ].map(k => (
            <div key={k.label} style={{ background: '#111', borderRadius: '10px', padding: '18px 20px' }}>
              <p style={{ fontSize: '11px', color: '#444', margin: '0 0 6px', fontWeight: 600, letterSpacing: '0.06em' }}>{k.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: k.accent ? '#a3ff6b' : '#f0ede8' }}>{k.value}</p>
            </div>
          ))}
        </div>

        <div style={card}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', margin: '0 0 20px', letterSpacing: '0.04em' }}>REVENUS — {range} DERNIERS JOURS</p>
          <RevenueChart data={dailyRevenue} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '16px' }}>
          <div style={card}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', margin: '0 0 18px', letterSpacing: '0.04em' }}>TOP SERVICES</p>
            {topServices.slice(0, 6).map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #111', fontSize: '13px' }}>
                <span style={{ color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '8px' }}>{s.name}</span>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, color: '#a3ff6b' }}>{fmtE(s.revenue)}</div>
                  <div style={{ fontSize: '11px', color: '#444' }}>{s.completed} ventes</div>
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', margin: '0 0 18px', letterSpacing: '0.04em' }}>PAR OPÉRATEUR</p>
            <BarChart items={byCarrier} valueKey="revenue" labelKey="carrier" colorMap={CARRIER_COLORS} />
          </div>
          <div style={card}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', margin: '0 0 18px', letterSpacing: '0.04em' }}>PAR MARQUE</p>
            <BarChart items={byBrand} valueKey="revenue" labelKey="brand" colorMap={BRAND_COLORS} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div style={card}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', margin: '0 0 18px', letterSpacing: '0.04em' }}>PERFORMANCE FOURNISSEURS</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead><tr>
                {['Fournisseur','OK','Échecs','Taux','Coût'].map(h => (
                  <th key={h} style={{ padding: '6px 8px', fontSize: '11px', color: '#444', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid #1a1a1a' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {byProvider.map((p, i) => (
                  <tr key={i}>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #111', fontWeight: 600, textTransform: 'capitalize' }}>{p.name}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #111', color: '#a3ff6b' }}>{p.completed}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #111', color: p.failed > 0 ? '#ff6b6b' : '#555' }}>{p.failed}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #111' }}>
                      <span style={{ color: pct(p.completed, p.orders) >= 90 ? '#a3ff6b' : pct(p.completed, p.orders) >= 70 ? '#ffcc00' : '#ff6b6b' }}>
                        {pct(p.completed, p.orders)} %
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #111', color: '#888' }}>{fmtE(p.total_cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={card}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#555', margin: '0 0 18px', letterSpacing: '0.04em' }}>SUPPORT</p>
            {[
              { label: 'Tickets ouverts',   val: support?.open ?? 0,     color: '#ffcc00' },
              { label: 'En attente',         val: support?.pending ?? 0,  color: '#66aaff' },
              { label: 'Résolus',            val: support?.resolved ?? 0, color: '#a3ff6b' },
              { label: 'Résolution moy.',    val: `${support?.avg_resolution_hours ?? 0}h`, color: '#f0ede8' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #111', fontSize: '13px' }}>
                <span style={{ color: '#555' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
              </div>
            ))}
            <Link href="/dashboard/tickets" style={{ display: 'block', marginTop: '16px', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '9px', textAlign: 'center', color: '#666', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
              Voir les tickets →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
