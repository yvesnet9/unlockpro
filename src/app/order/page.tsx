'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Service {
  id: number
  name: string
  price: string
  eta_hours: number
  brand: string
  carrier: string
}

function OrderForm() {
  const params = useSearchParams()
  const router = useRouter()

  const [brand, setBrand] = useState(params.get('brand') ?? '')
  const [carrier, setCarrier] = useState(params.get('carrier') ?? '')
  const [imei, setImei] = useState(params.get('imei') ?? '')
  const [email, setEmail] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Charge les services dispo selon marque + opérateur
  useEffect(() => {
    if (!brand || !carrier) return
    fetch(`/api/providers?brand=${brand}&carrier=${carrier}`)
      .then(r => r.json())
      .then((data: Service[]) => {
        setServices(data)
        setSelectedService(data[0] ?? null)
      })
      .catch(console.error)
  }, [brand, carrier])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!selectedService) return
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: selectedService.id, imei, email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Erreur inconnue'); return }
      // Redirige vers Stripe Checkout
      window.location.href = data.checkoutUrl
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a',
    borderRadius: '8px', padding: '12px 14px', color: '#f0ede8',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }
  const label: React.CSSProperties = { fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.04em' }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer' }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '40px' }}>
          ← Retour
        </a>
        <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 8px' }}>Commander un déblocage</h1>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px' }}>Remplissez le formulaire — paiement sécurisé par Stripe.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={label}>MARQUE</label>
            <select value={brand} onChange={e => setBrand(e.target.value)} style={sel} required>
              <option value="">Sélectionnez une marque</option>
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="huawei">Huawei</option>
              <option value="xiaomi">Xiaomi</option>
              <option value="oppo">Oppo</option>
              <option value="vivo">Vivo</option>
              <option value="realme">Realme</option>
              <option value="oneplus">OnePlus</option>
              <option value="tecno">Tecno</option>
              <option value="infinix">Infinix</option>
              <option value="itel">Itel</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label style={label}>OPÉRATEUR ACTUEL</label>
            <select value={carrier} onChange={e => setCarrier(e.target.value)} style={sel} required>
              <option value="">Sélectionnez votre opérateur</option>
              <option value="sfr">SFR</option>
              <option value="orange">Orange</option>
              <option value="bouygues">Bouygues Telecom</option>
              <option value="free">Free Mobile</option>
              <option value="lycamobile">Lycamobile</option>
              <option value="nrj">NRJ Mobile</option>
              <option value="swisscom">Swisscom (CH)</option>
              <option value="sunrise">Sunrise (CH)</option>
              <option value="salt">Salt (CH)</option>
              <option value="proximus">Proximus (BE)</option>
              <option value="base">Base (BE)</option>
              <option value="mtn">MTN (Afrique)</option>
              <option value="airtel">Airtel (Afrique)</option>
              <option value="vodacom">Vodacom (Afrique)</option>
              <option value="other">Autre opérateur</option>
            </select>
          </div>

          {services.length > 1 && (
            <div>
              <label style={label}>SERVICE</label>
              <select value={selectedService?.id} onChange={e => setSelectedService(services.find(s => s.id === Number(e.target.value)) ?? null)} style={sel}>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {Number(s.price).toFixed(2)} €</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={label}>IMEI (15 CHIFFRES)</label>
            <input
              type="text" placeholder="356938035643809" maxLength={15}
              value={imei} onChange={e => setImei(e.target.value.replace(/\D/g, ''))}
              style={{ ...inp, fontFamily: 'monospace', fontSize: '18px', letterSpacing: '2px' }}
              required
            />
            <p style={{ fontSize: '12px', color: '#555', margin: '6px 0 0' }}>Composez *#06# pour trouver votre IMEI</p>
          </div>

          <div>
            <label style={label}>EMAIL DE LIVRAISON</label>
            <input
              type="email" placeholder="vous@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              style={inp} required
            />
            <p style={{ fontSize: '12px', color: '#555', margin: '6px 0 0' }}>Le code sera envoyé à cette adresse</p>
          </div>

          {selectedService && (
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Service</span>
                <span style={{ fontSize: '14px' }}>{selectedService.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Délai estimé</span>
                <span style={{ fontSize: '14px' }}>≤ {selectedService.eta_hours}h</span>
              </div>
              <div style={{ borderTop: '1px solid #222', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total TTC</span>
                <span style={{ fontWeight: 800, fontSize: '20px', color: '#a3ff6b' }}>{Number(selectedService.price).toFixed(2)} €</span>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#1a0a0a', border: '1px solid #4a1a1a', borderRadius: '8px', padding: '12px 16px', color: '#ff6b6b', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedService || imei.length !== 15 || !email}
            style={{
              background: loading ? '#1e1e1e' : '#a3ff6b',
              color: loading ? '#444' : '#0a0a0a',
              border: 'none', borderRadius: '10px', padding: '16px',
              fontSize: '16px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.2s',
            }}>
            {loading ? 'Redirection vers le paiement...' : 'Payer en sécurité →'}
          </button>

          <p style={{ fontSize: '12px', color: '#444', textAlign: 'center', margin: '0' }}>
            🔒 Paiement sécurisé par Stripe · Remboursé si échec
          </p>
        </form>
      </div>
    </div>
  )
}

export default function OrderPage() {
  return <Suspense><OrderForm /></Suspense>
}
