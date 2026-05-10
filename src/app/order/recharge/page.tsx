'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

const COUNTRIES: Record<string, { name: string; flag: string }> = {
  CI: { name: "Côte d'Ivoire", flag: '🇨🇮' },
  CM: { name: 'Cameroun', flag: '🇨🇲' },
  SN: { name: 'Sénégal', flag: '🇸🇳' },
  CD: { name: 'Congo RDC', flag: '🇨🇩' },
  ML: { name: 'Mali', flag: '🇲🇱' },
  GN: { name: 'Guinée', flag: '🇬🇳' },
  BJ: { name: 'Bénin', flag: '🇧🇯' },
  TG: { name: 'Togo', flag: '🇹🇬' },
}

function RechargeForm() {
  const params = useSearchParams()
  const country = params.get('country') ?? 'CI'
  const phone = params.get('phone') ?? ''
  const amount = params.get('amount') ?? '10'
  const countryInfo = COUNTRIES[country] ?? { name: country, flag: '🌍' }

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', borderBottom: '1px solid #1e1e1e' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 800, textDecoration: 'none', color: '#f0ede8' }}>
          Unlock<span style={{ color: '#059669' }}>Pro</span>
        </Link>
        <Link href="/" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Retour</Link>
      </nav>

      <div style={{ maxWidth: '520px', margin: '60px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
          Recharge mobile
        </h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>
          Vérifiez les informations avant de payer
        </p>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '16px' }}>
            RÉCAPITULATIF
          </div>
          {[
            { label: 'Pays', value: `${countryInfo.flag} ${countryInfo.name}` },
            { label: 'Numéro', value: phone || '—' },
            { label: 'Montant', value: `${amount} €` },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ color: '#555', fontSize: '14px' }}>{r.label}</span>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0' }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#059669' }}>{amount} €</span>
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#555', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '16px' }}>
            VOTRE EMAIL
          </div>
          <input type="email" placeholder="vous@email.com"
            style={{ width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px', color: '#f0ede8', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          <p style={{ fontSize: '12px', color: '#444', marginTop: '8px' }}>
            La confirmation sera envoyée à cette adresse
          </p>
        </div>

        <a href={`https://wa.me/32465188199?text=Recharge ${amount}€ vers ${phone} (${countryInfo.name})`}
          style={{ display: 'block', background: '#059669', color: '#fff', padding: '16px', borderRadius: '12px', textAlign: 'center', fontWeight: 800, fontSize: '15px', textDecoration: 'none', marginBottom: '12px' }}>
          📲 Commander via WhatsApp
        </a>

        <p style={{ fontSize: '12px', color: '#333', textAlign: 'center' }}>
          🔒 Paiement sécurisé · Livraison instantanée · Remboursé si échec
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
