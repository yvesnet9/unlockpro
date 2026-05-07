'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Status = 'pending' | 'paid' | 'processing' | 'completed' | 'failed' | 'refunded'

interface Order {
  id: string
  status: Status
  serviceName: string
  imei: string
  unlockCode: string | null
  etaHours: number
  createdAt: string
  updatedAt: string
}

const STEPS = [
  { label: 'Paiement reçu',    desc: 'Votre paiement a été validé par Stripe.' },
  { label: 'En traitement',    desc: 'La demande est envoyée au fournisseur.' },
  { label: 'Code disponible',  desc: 'Votre code a été envoyé par email.' },
]

function stepIndex(status: Status): number {
  if (status === 'completed') return 3
  if (status === 'processing') return 2
  if (status === 'paid') return 1
  return 0
}

function TrackingContent() {
  const params   = useSearchParams()
  const orderId  = params.get('id')
  const [order,  setOrder]  = useState<Order | null>(null)
  const [error,  setError]  = useState('')
  const [copied, setCopied] = useState(false)
  const [tick,   setTick]   = useState(0)

  const fetchOrder = useCallback(async () => {
    if (!orderId) return
    try {
      const res = await fetch(`/api/orders?id=${orderId}`)
      if (!res.ok) { setError('Commande introuvable.'); return }
      setOrder(await res.json())
    } catch { setError('Erreur réseau.') }
  }, [orderId])

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(() => setTick(t => t + 1), 15_000)
    return () => clearInterval(interval)
  }, [fetchOrder])

  useEffect(() => { fetchOrder() }, [tick, fetchOrder])

  function copyCode() {
    if (!order?.unlockCode) return
    navigator.clipboard.writeText(order.unlockCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const step       = order ? stepIndex(order.status) : 0
  const isFailed   = order?.status === 'failed'
  const isCompleted = order?.status === 'completed'

  if (!orderId) return (
    <div style={wrap}>
      <p style={{ color: '#ff6b6b' }}>Aucun ID de commande dans l'URL.</p>
      <a href="/" style={btnGhost}>← Retour</a>
    </div>
  )

  return (
    <div style={wrap}>
      <a href="/" style={{ color: '#555', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '40px' }}>← Retour accueil</a>
      <div style={{ marginBottom: '40px' }}>
        <p style={lbl}>COMMANDE</p>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
          {isCompleted ? '🎉 Code prêt !' : isFailed ? '⚠️ Échec' : 'Suivi en temps réel'}
        </h1>
        {order && <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>{order.serviceName} · IMEI {order.imei}</p>}
      </div>

      {error && <div style={errBox}>{error}</div>}
      {!order && !error && <div style={{ color: '#444', fontSize: '14px' }}>Chargement…</div>}

      {order && !isFailed && (
        <>
          <div style={{ marginBottom: '40px' }}>
            {STEPS.map((s, i) => {
              const done   = step > i
              const active = step === i + 1
              return (
                <div key={s.label} style={{ display: 'flex', gap: '16px', marginBottom: '4px', position: 'relative' }}>
                  {i < STEPS.length - 1 && (
                    <div style={{ position: 'absolute', left: '15px', top: '32px', width: '2px', height: '40px', background: done ? '#a3ff6b' : '#1e1e1e' }} />
                  )}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${done || active ? '#a3ff6b' : '#2a2a2a'}`, background: done ? '#a3ff6b' : active ? '#1a2e0f' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                    {done ? <span style={{ fontSize: '14px', color: '#0a0a0a', fontWeight: 700 }}>✓</span>
                      : active ? <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a3ff6b', display: 'block' }} />
                      : null}
                  </div>
                  <div style={{ paddingTop: '6px', paddingBottom: '24px' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: done || active ? '#f0ede8' : '#444' }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {isCompleted && order.unlockCode && (
            <div style={{ background: '#0d1a00', border: '1px solid #2a4a00', borderRadius: '16px', padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#5a8a2a', fontWeight: 600, letterSpacing: '0.06em' }}>VOTRE CODE DE DÉBLOCAGE</p>
              <div style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '6px', color: '#a3ff6b', margin: '16px 0', fontFamily: 'monospace' }}>
                {order.unlockCode}
              </div>
              <button onClick={copyCode} style={{ background: copied ? '#1a3300' : '#a3ff6b', color: copied ? '#a3ff6b' : '#0a0a0a', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {copied ? '✓ Copié !' : 'Copier le code'}
              </button>
            </div>
          )}

          {!isCompleted && (
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#555' }}>Délai estimé</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>≤ {order.etaHours}h</span>
              </div>
              <div style={{ height: '4px', background: '#1e1e1e', borderRadius: '2px' }}>
                <div style={{ height: '4px', borderRadius: '2px', background: '#a3ff6b', width: `${step * 33}%`, transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#444' }}>Page rafraîchie automatiquement toutes les 15 secondes.</p>
            </div>
          )}
        </>
      )}

      {isFailed && (
        <div style={{ background: '#1a0000', border: '1px solid #4a0000', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#ff6b6b' }}>La commande a échoué</p>
          <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#aa4444' }}>Vous serez remboursé intégralement dans 3–5 jours ouvrés.</p>
          <a href="/support" style={{ color: '#ff6b6b', fontSize: '14px', fontWeight: 600 }}>Contacter le support →</a>
        </div>
      )}

      <a href="/support" style={btnGhost}>Une question ? Contactez le support</a>
    </div>
  )
}

const wrap: React.CSSProperties = { fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', padding: '80px 24px', maxWidth: '560px', margin: '0 auto' }
const lbl: React.CSSProperties  = { fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 12px' }
const errBox: React.CSSProperties = { background: '#1a0a0a', border: '1px solid #4a1a1a', borderRadius: '8px', padding: '14px 16px', color: '#ff6b6b', fontSize: '14px', marginBottom: '24px' }
const btnGhost: React.CSSProperties = { display: 'block', textAlign: 'center', color: '#555', textDecoration: 'none', fontSize: '13px', marginTop: '24px', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '12px' }

export default function SuccessPage() {
  return <Suspense><TrackingContent /></Suspense>
}
