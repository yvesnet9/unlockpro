'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const COUNTRIES = [
  { code: 'CI', flag: '🇨🇮', name: "Cote d'Ivoire" },
  { code: 'CM', flag: '🇨🇲', name: 'Cameroun' },
  { code: 'SN', flag: '🇸🇳', name: 'Senegal' },
  { code: 'CD', flag: '🇨🇩', name: 'Congo RDC' },
  { code: 'ML', flag: '🇲🇱', name: 'Mali' },
  { code: 'GN', flag: '🇬🇳', name: 'Guinee' },
  { code: 'BJ', flag: '🇧🇯', name: 'Benin' },
  { code: 'TG', flag: '🇹🇬', name: 'Togo' },
]

function RechargeForm() {
  const params = useSearchParams()
  const [country, setCountry] = useState(params.get('country') ?? 'CI')
  const [phone, setPhone] = useState(params.get('phone') ?? '')
  const [email, setEmail] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState('')

  const countryInfo = COUNTRIES.find(c => c.code === country) ?? COUNTRIES[0]

  useEffect(() => {
    setLoadingProducts(true)
    setProducts([])
    setSelectedProduct(null)
    fetch(`/api/recharge/products?country=${country}`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.content ?? [])
        setProducts(list)
        if (list.length > 0) setSelectedProduct(list[0])
        setLoadingProducts(false)
      })
      .catch(() => setLoadingProducts(false))
  }, [country])

  async function handleSubmit() {
    if (!email || !phone || !selectedProduct) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/recharge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          country,
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          operator_name: selectedProduct.operator?.name ?? '',
          amount_eur: selectedProduct.prices?.retail?.amount ?? 0,
          amount_destination: selectedProduct.destination?.amount ?? 0,
          unit: selectedProduct.destination?.unit ?? '',
        })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error ?? 'Erreur lors de la commande')
    } catch {
      setError('Erreur reseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', borderBottom: '1px solid #1e1e1e' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, textDecoration: 'none', color: '#f0ede8' }}>
          Unlock<span style={{ color: '#059669' }}>Pro</span>
        </Link>
        <Link href="/" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Retour</Link>
      </nav>

      <div style={{ maxWidth: '560px', margin: '48px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>Recharge mobile</h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>Livraison instantanee sur le telephone du destinataire</p>

        {error && (
          <div style={{ background: '#330000', border: '1px solid #660000', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#ff6b6b', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>PAYS DESTINATION</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setCountry(c.code)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${country === c.code ? '#059669' : '#2a2a2a'}`, background: country === c.code ? '#0a2a1a' : 'transparent', color: country === c.code ? '#059669' : '#555', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                {c.flag} {c.code}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>NUMERO DU DESTINATAIRE</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+225 07 XX XX XX XX"
            style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${phone.length > 8 ? '#059669' : '#2a2a2a'}`, borderRadius: '8px', padding: '12px', color: '#f0ede8', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>
            OFFRE DE RECHARGE {loadingProducts && '— Chargement...'}
          </label>
          {!loadingProducts && products.length === 0 && (
            <p style={{ color: '#555', fontSize: '14px' }}>Aucun produit disponible pour ce pays</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {products.map(p => {
              const price = p.prices?.retail?.amount ?? p.retail_price ?? 0
              const dest = p.destination?.amount ?? ''
              const unit = p.destination?.unit ?? ''
              const op = p.operator?.name ?? ''
              const isSelected = selectedProduct?.id === p.id
              return (
                <button key={p.id} onClick={() => setSelectedProduct(p)}
                  style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${isSelected ? '#059669' : '#2a2a2a'}`, background: isSelected ? '#0a2a1a' : '#0a0a0a', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#059669' : '#f0ede8' }}>{op}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{dest} {unit}</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: isSelected ? '#059669' : '#f0ede8' }}>{Number(price).toFixed(2)} EUR</div>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <label style={{ fontSize: '11px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>VOTRE EMAIL</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="vous@email.com"
            style={{ width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px', color: '#f0ede8', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          <p style={{ fontSize: '12px', color: '#444', marginTop: '8px' }}>La confirmation de recharge sera envoyee a cette adresse</p>
        </div>

        <button onClick={handleSubmit} disabled={loading || !selectedProduct}
          style={{ width: '100%', background: loading || !selectedProduct ? '#1a2a1a' : '#059669', color: loading || !selectedProduct ? '#444' : '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '15px', cursor: loading || !selectedProduct ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>
          {loading ? 'Redirection vers le paiement...' : selectedProduct ? `Payer ${Number(selectedProduct.prices?.retail?.amount ?? 0).toFixed(2)} EUR →` : 'Selectionnez une offre'}
        </button>

        <p style={{ fontSize: '12px', color: '#333', textAlign: 'center' }}>
          Paiement securise Stripe · Livraison instantanee · Rembourse si echec
        </p>
      </div>
    </div>
  )
}

export default function RechargePage() {
  return (
    <Suspense>
      <RechargeForm />
    </Suspense>
  )
}
