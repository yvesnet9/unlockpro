'use client'
import { useState, useEffect } from 'react'

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
  completed: '#059669', failed: '#ff6b6b', refunded: '#888',
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'unlock' | 'recharge'>('unlock')
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ total: 0, completed: 0, revenue: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setOrders([])
    fetch(`/api/admin/orders?type=${activeTab}`)
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders ?? [])
        setStats(data.stats ?? {})
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeTab])

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search) {
      const s = search.toLowerCase()
      if (activeTab === 'unlock') return o.email?.includes(s) || o.imei?.includes(s)
      return o.email?.includes(s) || o.phone?.includes(s)
    }
    return true
  })

  const cell: React.CSSProperties = { padding: '14px 16px', fontSize: '13px', borderBottom: '1px solid #1a1a1a', verticalAlign: 'middle' }
  const green = '#059669'

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '18px' }}>Unlock<span style={{ color: green }}>Pro</span> Admin</div>
        <a href="/" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>← Site</a>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: '4px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '4px', marginBottom: '28px', width: 'fit-content' }}>
          {[['unlock', 'Deblocage'], ['recharge', 'Recharges']].map(([key, label]) => (
            <button key={key} onClick={() => { setActiveTab(key as any); setFilter('all'); setSearch('') }}
              style={{ padding: '10px 28px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px', background: activeTab === key ? green : 'transparent', color: activeTab === key ? '#fff' : '#555' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total commandes', value: stats.total },
            { label: 'Completees', value: stats.completed, accent: true },
            { label: 'En attente', value: stats.pending },
            { label: 'Revenu total', value: `${Number(stats.revenue).toFixed(0)} EUR`, accent: true },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px 24px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.accent ? green : '#f0ede8' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input placeholder={activeTab === 'unlock' ? 'Rechercher email / IMEI...' : 'Rechercher email / telephone...'}
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '10px 14px', color: '#f0ede8', fontSize: '14px', outline: 'none' }} />
          {['all', 'pending', 'processing', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '10px 18px', borderRadius: '8px', border: `1px solid ${filter === s ? green : '#222'}`, background: filter === s ? '#0a2a1a' : 'transparent', color: filter === s ? green : '#666', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              {s === 'all' ? 'Toutes' : s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#111' }}>
                {(activeTab === 'unlock'
                  ? ['ID', 'Email', 'Service', 'IMEI', 'Statut', 'Montant', 'Date', 'Actions']
                  : ['ID', 'Email', 'Telephone', 'Operateur', 'Produit', 'Montant EUR', 'Statut', 'Date']
                ).map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', textAlign: 'left', borderBottom: '1px solid #1a1a1a' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...cell, textAlign: 'center', color: '#444', padding: '40px' }}>Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ ...cell, textAlign: 'center', color: '#444', padding: '40px' }}>Aucune commande trouvee</td></tr>
              ) : activeTab === 'unlock' ? filtered.map(o => (
                <tr key={o.id}>
                  <td style={cell}><span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{o.id.split('-')[0].toUpperCase()}</span></td>
                  <td style={cell}>{o.email}</td>
                  <td style={{ ...cell, color: '#aaa' }}>{o.service_name}</td>
                  <td style={{ ...cell, fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{o.imei}</td>
                  <td style={cell}>
                    <span style={{ background: STATUS_COLORS[o.status] ?? '#1a1a1a', color: STATUS_TEXT[o.status] ?? '#888', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ ...cell, fontWeight: 700, color: green }}>{Number(o.amount).toFixed(2)} EUR</td>
                  <td style={{ ...cell, color: '#555', fontSize: '12px' }}>{new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={cell}>
                    <a href={`/admin/orders/${o.id}`} style={{ color: '#666', textDecoration: 'none', fontSize: '12px', border: '1px solid #2a2a2a', padding: '5px 10px', borderRadius: '6px' }}>Detail</a>
                  </td>
                </tr>
              )) : filtered.map(o => (
                <tr key={o.id}>
                  <td style={cell}><span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{o.id.split('-')[0].toUpperCase()}</span></td>
                  <td style={cell}>{o.email}</td>
                  <td style={{ ...cell, fontFamily: 'monospace', fontSize: '12px' }}>{o.phone}</td>
                  <td style={{ ...cell, color: '#aaa' }}>{o.operator_name}</td>
                  <td style={{ ...cell, color: '#aaa' }}>{o.product_name}</td>
                  <td style={{ ...cell, fontWeight: 700, color: green }}>{Number(o.amount_eur).toFixed(2)} EUR</td>
                  <td style={cell}>
                    <span style={{ background: STATUS_COLORS[o.status] ?? '#1a1a1a', color: STATUS_TEXT[o.status] ?? '#888', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ ...cell, color: '#555', fontSize: '12px' }}>{new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
