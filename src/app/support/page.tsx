'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'code_not_received', label: 'Code non reçu' },
  { id: 'code_not_working',  label: 'Code ne fonctionne pas' },
  { id: 'payment',           label: 'Problème de paiement' },
  { id: 'refund',            label: 'Remboursement' },
  { id: 'other',             label: 'Autre question' },
]

function SupportContent() {
  const params     = useSearchParams()
  const ticketId   = params.get('id')
  const emailParam = params.get('email') ?? ''

  const [tab,      setTab]      = useState<'new'|'track'>(ticketId ? 'track' : 'new')
  const [form,     setForm]     = useState({ email: emailParam, name: '', orderId: '', subject: '', message: '', category: 'other' })
  const [lookup,   setLookup]   = useState({ id: ticketId ?? '', email: emailParam })
  const [ticket,   setTicket]   = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading,  setLoading]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => { if (ticketId && emailParam) fetchTicket() }, [])

  async function fetchTicket() {
    setLoading(true); setError('')
    const res = await fetch(`/api/support?id=${lookup.id}&email=${encodeURIComponent(lookup.email)}`)
    if (!res.ok) { setError('Ticket introuvable.'); setLoading(false); return }
    const data = await res.json()
    setTicket(data.ticket); setMessages(data.messages)
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, orderId: form.orderId || undefined }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  const inp: React.CSSProperties = { width: '100%', background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 14px', color: '#f0ede8', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const lbl: React.CSSProperties = { fontSize: '11px', color: '#555', display: 'block', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }
  const STATUS_COLOR: Record<string,string> = { open:'#ffcc00', pending:'#66aaff', resolved:'#a3ff6b', closed:'#555' }

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 48px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '18px', fontWeight: 800, color: '#f0ede8', textDecoration: 'none' }}>Unlock<span style={{ color: '#a3ff6b' }}>Pro</span></Link>
        <span style={{ fontSize: '14px', color: '#555' }}>Support client</span>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 8px' }}>Support</h1>
        <p style={{ color: '#555', fontSize: '15px', margin: '0 0 40px' }}>Réponse garantie sous 2–4h en jours ouvrés.</p>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: '#111', borderRadius: '10px', padding: '4px' }}>
          {[{ id: 'new', label: 'Nouveau ticket' }, { id: 'track', label: 'Suivre mon ticket' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: tab === t.id ? '#1a2e0f' : 'transparent', color: tab === t.id ? '#a3ff6b' : '#555', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'new' && !sent && (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lbl}>EMAIL</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp} required placeholder="vous@email.com" />
              </div>
              <div>
                <label style={lbl}>NOM (OPTIONNEL)</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} placeholder="Jean Dupont" />
              </div>
            </div>
            <div>
              <label style={lbl}>ID DE COMMANDE (OPTIONNEL)</label>
              <input value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))} style={inp} placeholder="uuid de votre commande" />
            </div>
            <div>
              <label style={lbl}>CATÉGORIE</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>SUJET</label>
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={inp} required placeholder="Décrivez brièvement le problème" />
            </div>
            <div>
              <label style={lbl}>MESSAGE</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={6} required placeholder="Décrivez votre problème en détail..."
                style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
            </div>
            {error && <div style={{ background: '#1a0808', border: '1px solid #3a1010', borderRadius: '8px', padding: '12px 14px', color: '#ff6b6b', fontSize: '13px' }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ background: loading ? '#1a1a1a' : '#a3ff6b', color: loading ? '#444' : '#0a0a0a', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Envoi…' : 'Envoyer le ticket →'}
            </button>
          </form>
        )}

        {tab === 'new' && sent && (
          <div style={{ background: '#0d1a00', border: '1px solid #2a4a00', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#a3ff6b', margin: '0 0 12px' }}>Ticket envoyé !</h2>
            <p style={{ color: '#5a8a2a', margin: '0 0 24px' }}>Notre équipe vous répond sous 2–4h.</p>
            <button onClick={() => { setSent(false); setTab('track') }}
              style={{ background: 'transparent', border: '1px solid #2a4a00', borderRadius: '8px', padding: '10px 20px', color: '#a3ff6b', fontSize: '14px', cursor: 'pointer' }}>
              Suivre mon ticket →
            </button>
          </div>
        )}

        {tab === 'track' && !ticket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lbl}>ID DU TICKET</label>
              <input value={lookup.id} onChange={e => setLookup(l => ({ ...l, id: e.target.value }))} style={inp} placeholder="uuid..." />
            </div>
            <div>
              <label style={lbl}>EMAIL</label>
              <input type="email" value={lookup.email} onChange={e => setLookup(l => ({ ...l, email: e.target.value }))} style={inp} placeholder="vous@email.com" />
            </div>
            {error && <div style={{ background: '#1a0808', border: '1px solid #3a1010', borderRadius: '8px', padding: '12px 14px', color: '#ff6b6b', fontSize: '13px' }}>{error}</div>}
            <button onClick={fetchTicket} disabled={loading}
              style={{ background: '#a3ff6b', color: '#0a0a0a', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Recherche…' : 'Voir mon ticket →'}
            </button>
          </div>
        )}

        {tab === 'track' && ticket && (
          <div>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{ticket.subject}</h2>
                <span style={{ fontSize: '12px', fontWeight: 600, color: STATUS_COLOR[ticket.status] ?? '#888', background: `${STATUS_COLOR[ticket.status]}22`, padding: '4px 10px', borderRadius: '20px' }}>
                  {ticket.status}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m: any, i: number) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.author_role === 'admin' ? 'flex-start' : 'flex-end' }}>
                  <div style={{ maxWidth: '80%', background: m.author_role === 'admin' ? '#111' : '#1a2e0f', border: `1px solid ${m.author_role === 'admin' ? '#1e1e1e' : '#2a4a00'}`, borderRadius: '12px', padding: '16px', fontSize: '14px', lineHeight: 1.7, color: m.author_role === 'admin' ? '#f0ede8' : '#c8f0a0', whiteSpace: 'pre-wrap' }}>
                    {m.content}
                  </div>
                  <span style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>
                    {m.author_role === 'admin' ? 'Support UnlockPro' : 'Vous'} · {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SupportPage() {
  return <Suspense><SupportContent /></Suspense>
}
