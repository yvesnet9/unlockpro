import Link from 'next/link'

export default function RechargeSuccessPage() {
  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px', color: '#059669' }}>
          Paiement confirmé !
        </h1>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, marginBottom: '32px' }}>
          Votre recharge est en cours de traitement. Elle sera envoyée sur le téléphone du destinataire dans quelques secondes.
        </p>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>Une confirmation sera envoyée à votre email.</div>
          <div style={{ fontSize: '13px', color: '#059669' }}>⚡ Livraison instantanée — sous quelques secondes</div>
        </div>
        <Link href="/" style={{ display: 'inline-block', background: '#059669', color: '#fff', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
