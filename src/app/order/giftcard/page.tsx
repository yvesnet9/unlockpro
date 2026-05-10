import Link from 'next/link'

export default function GiftCardPage() {
  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎁</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>Gift Cards</h1>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, marginBottom: '32px' }}>
          Amazon, iTunes, Google Play, Netflix et plus encore. Cette section sera disponible très prochainement.
        </p>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>Vous souhaitez commander une Gift Card maintenant ?</p>
          <a href="https://wa.me/32465188199?text=Bonjour, je souhaite commander une Gift Card" style={{ display: 'block', background: '#059669', color: '#fff', padding: '14px', borderRadius: '10px', textAlign: 'center', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
            📲 Commander via WhatsApp
          </a>
        </div>
        <Link href="/" style={{ color: '#059669', textDecoration: 'none', fontSize: '14px' }}>← Retour à l accueil</Link>
      </div>
    </div>
  )
}
