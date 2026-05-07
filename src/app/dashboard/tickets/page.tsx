'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  open:     { bg: '#332200', color: '#ffcc00', label: 'Ouvert' },
  pending:  { bg: '#001a33', color: '#66aaff', label: 'En attente' },
  resolved: { bg: '#0d1a00', color: '#a3ff6b', label: 'Résolu' },
  closed:   { bg: '#1a1a1a', color: '#555',    label: 'Fermé' },
}
const PRIORITY_DOT: Record<string, string> = {
  urgent: '#ff4444', high: '#ff8800', normal: '#ffcc00', low: '#555',
}
const CATEGORY_LABEL: Record<string, string> = {
  code_not_received: 'Code non reçu',
  code_not_working:  'Code invalide',
  payment:           'Paiement',
  refund:            'Remboursement',
  other:             'Autre',
}

export default function AdminTickets() {
  const [tickets,  setTickets]  = useState<any[]>([])
  const [stats,    setStats]    = useState<any>({})
  const [selected, setSelected] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [reply,    setReply]    = useState('')
  const [filter,   setFilter]   = useState('open')
  const [search,   setSearch]   = useState('')
  const [sending,  setSending]  = useState(false)
  const [loading,  setLoading]  = useState(true)

  const fetchTickets = useCallback(async () => {
    const qs = new URLSearchParams({ status: filter, search })
    const res = await fetch(`/api/support?${qs}`)
    if (!res.ok) return
    const data = await res.json()
    setTickets(data.tickets ?? [])
    setStats(data.stats ?? {})
    setLoading(false)
  }, [filter, search])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  async function openTicket(t: any) {
    setSelected(t)
    const res = await fetch(`/api/support?id=${t.id}&email=${t.email}`)
    if (!res.ok) return
    const data = await res.json()
    setMessages(data.messages)
    setReply('')
  }

  async function sendReply() {
    if (!reply.trim() || !selected) return
    setSending(true)
    await fetch('/api/support/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: selected.id, content: reply }),
    })
    setReply('')
    setSending(false)
    const res = await fetch(`/api/support?id=${selected.id}&email=${selected.email}`)
    const data = await res.json()
    setMessages(data.messages)
  }

  async function setStatus(ticketId: string, status: string) {
    await fetch('/api/support/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, status }),
    })
    fetchTickets()
    if (selected?.id === ticketId) setSelected((s: any) => ({ ...s, status }))
  }

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '18px 28px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Dashboard</Link>
        <span style={{ fontWeight: 700, fontSize: '16px' }}>Support tickets</span>
      </div>

      <div style={{ display: 'flex', gap: '20px', padding: '16px 28px', borderBottom: '1px solid #111' }}>
        {[
          { label: 'Ouverts',    value: stats.open,          color: '#ffcc00' },
          { label: 'En attente', value: stats.pending,       color: '#66aaff' },
          { label: 'Résolus',    value: stats.resolved,      color: '#a3ff6b' },
          { label: 'Haute prio', value: stats.high_priority, color: '#ff8800' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value ?? 0}</span>
            <span style={{ fontSize: '12px', color: '#444' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: selected ? '420px' : '100%', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '140px', background: '#111', border: '1px solid #222', borderRadius: '6px', padding: '7px 10px', color: '#f0ede8', fontSize: '13px', outline: 'none' }} />
            {['all', 'open', 'pending', 'resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '7px 12px', borderRadius: '6px', border: `1px solid ${filter === f ? '#a3ff6b' : '#222'}`, background: filter === f ? '#1a2e0f' : 'transparent', color: filter === f ? '#a3ff6b' : '#555', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                {{ all: 'Tous', open: 'Ouverts', pending: 'Attente', resolved: 'Résolus' }[f]}
              </button>
            ))}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#444', fontSize: '14px' }}>Chargement…</div>
            ) : tickets.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#444', fontSize: '14px' }}>Aucun ticket</div>
            ) : tickets.map(t => (
              <div key={t.id} onClick={() => openTicket(t)}
                style={{ padding: '14px 16px', borderBottom: '1px solid #111', cursor: 'pointer', background: selected?.id === t.id ? '#111' : 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PRIORITY_DOT[t.priority], flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{t.subject}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: STATUS_STYLE[t.status]?.color ?? '#888', background: STATUS_STYLE[t.status]?.bg, padding: '2px 8px', borderRadius: '12px', flexShrink: 0 }}>
                    {STATUS_STYLE[t.status]?.label}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#555' }}>{t.email} · {CATEGORY_LABEL[t.category] ?? t.category}</span>
                  <span style={{ fontSize: '11px', color: '#333' }}>{new Date(t.updated_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px' }}>{selected.subject}</h3>
                <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{selected.email} · {CATEGORY_LABEL[selected.category]}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['open', 'pending', 'resolved', 'closed'].map(s => (
                  <button key={s} onClick={() => setStatus(selected.id, s)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${selected.status === s ? STATUS_STYLE[s]?.color : '#222'}`, background: selected.status === s ? STATUS_STYLE[s]?.bg : 'transparent', color: selected.status === s ? STATUS_STYLE[s]?.color : '#555', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                    {STATUS_STYLE[s]?.label}
                  </button>
                ))}
                <button onClick={() => setSelected(null)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #222', background: 'transparent', color: '#555', fontSize: '12px', cursor: 'pointer' }}>✕</button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m: any, i: number) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.author_role === 'admin' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '75%', background: m.author_role === 'admin' ? '#1a2e0f' : '#111', border: `1px solid ${m.author_role === 'admin' ? '#2a4a00' : '#1e1e1e'}`, borderRadius: '10px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {m.content}
                  </div>
                  <span style={{ fontSize: '11px', color: '#333', marginTop: '3px' }}>
                    {m.author_role === 'admin' ? 'Vous (admin)' : 'Client'} · {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {selected.status !== 'closed' && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid #1a1a1a' }}>
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4}
                  placeholder="Écrire une réponse…"
                  style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '12px', color: '#f0ede8', fontSize: '14px', outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setStatus(selected.id, 'resolved')}
                    style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #2a4a00', background: 'transparent', color: '#a3ff6b', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                    Marquer résolu
                  </button>
                  <button onClick={sendReply} disabled={sending || !reply.trim()}
                    style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: sending || !reply.trim() ? '#1a1a1a' : '#a3ff6b', color: sending || !reply.trim() ? '#444' : '#0a0a0a', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    {sending ? 'Envoi…' : 'Répondre →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
