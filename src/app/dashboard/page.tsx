'use client'
import { useState, useEffect } from 'react'

interface Order {
  id: string
  email: string
  service_name: string
  imei: string
  status: string
  amount: string
  created_at: string
  unlock_code?: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:    '#665500',
  paid:       '#003366',
  processing: '#003344',
  completed:  '#1a3300',
  failed:     '#330000',
  refunded:   '#2a2a2a',
}
const STATUS_TEXT: Record<string, string> = {
  pending: '#ffcc00', paid: '#66aaff', processing: '#33ddcc',
  completed: '#a3ff6b', failed: '#ff6b6b', refunded: '#888',
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ total: 0, completed: 0, revenue: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders ?? [])
        setStats(data.stats ?? {})
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search && !o.email.includes(search) && !o.imei.includes(search)) return false
    return true
  })

  const cell: React.CSSProperties = { padding: '14px 16px', fontSize: '13px', borderBottom: '1px solid #1a1a1a', verticalAlign: 'middle' }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '18px' }}>Unlock<span style={{ color: '#a3ff6b' }}>Pro</span> Admin</div>
        <a href="/" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>← Site</a>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total commandes', value: stats.total },
            { label: 'Complétées', value: stats.completed, accent: true },
            { label: 'En attente', value: stats.pending },
            { label: 'Revenu total', value: `${Number(stats.revenue).toFixed(0)} €`, accent: true },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px 24px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.accent ? '#a3ff6b' : '#f0ede8' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            placeholder="Rechercher email / IMEI..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '10px 14px', color: '#f0ede8', fontSize: '14px', outline: 'none' }}
          />
          {['all', 'pending', 'processing', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '10px 18px', borderRadius: '8px', border: `1px solid ${filter === s ? '#a3ff6b' : '#222'}`, background: filter === s ? '#1a2e0f' : 'transparent', color: filter === s ? '#a3ff6b' : '#666', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              {s === 'all' ? 'Toutes' : s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#111' }}>
                {['ID', 'Email', 'Service', 'IMEI', 'Statut', 'Montant', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', textAlign: 'left', borderBottom: '1px solid #1a1a1a' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...cell, textAlign: 'center', color: '#444', padding: '40px' }}>Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ ...cell, textAlign: 'center', color: '#444', padding: '40px' }}>Aucune commande trouvée</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} style={{ background: 'transparent' }}>
                  <td style={cell}><span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{o.id.split('-')[0].toUpperCase()}</span></td>
                  <td style={cell}>{o.email}</td>
                  <td style={{ ...cell, color: '#aaa' }}>{o.service_name}</td>
                  <td style={{ ...cell, fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{o.imei}</td>
                  <td style={cell}>
                    <span style={{ background: STATUS_COLORS[o.status] ?? '#1a1a1a', color: STATUS_TEXT[o.status] ?? '#888', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ ...cell, fontWeight: 700, color: '#a3ff6b' }}>{Number(o.amount).toFixed(2)} €</td>
                  <td style={{ ...cell, color: '#555', fontSize: '12px' }}>{new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={cell}>
                    <a href={`/admin/orders/${o.id}`} style={{ color: '#666', textDecoration: 'none', fontSize: '12px', border: '1px solid #2a2a2a', padding: '5px 10px', borderRadius: '6px' }}>
                      Détail →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
