export default function CommentCaMarche() {
  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 48px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 700, textDecoration: 'none', color: '#f0ede8' }}>Unlock<span style={{ color: '#a3ff6b' }}>Pro</span></a>
        <a href="/order" style={{ background: '#a3ff6b', color: '#0a0a0a', padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Commander →</a>
      </nav>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', margin: '0 0 16px' }}>Comment ça marche ?</h1>
        <p style={{ fontSize: '18px', color: '#888', margin: '0 0 64px', lineHeight: 1.7 }}>Débloquez votre téléphone en 4 étapes simples. Résultat garanti ou remboursé.</p>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: '#a3ff6b', minWidth: '80px' }}>01</div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px' }}>Trouvez votre IMEI</h2>
            <p style={{ color: '#888', lineHeight: 1.8, margin: '0 0 16px' }}>Composez *#06# sur votre téléphone pour afficher votre numéro IMEI à 15 chiffres.</p>
            <div style={{ background: '#111b0a', border: '1px solid #2a4a00', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#a3ff6b' }}>💡 Vous pouvez aussi le trouver dans Paramètres → À propos du téléphone.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: '#a3ff6b', minWidth: '80px' }}>02</div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px' }}>Choisissez votre service</h2>
            <p style={{ color: '#888', lineHeight: 1.8, margin: '0 0 16px' }}>Sélectionnez la marque et l'opérateur d'origine de votre téléphone.</p>
            <div style={{ background: '#111b0a', border: '1px solid #2a4a00', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#a3ff6b' }}>💡 Vérifiez bien l'opérateur d'origine — pas votre opérateur actuel.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: '#a3ff6b', minWidth: '80px' }}>03</div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px' }}>Payez en sécurité</h2>
            <p style={{ color: '#888', lineHeight: 1.8, margin: '0 0 16px' }}>Paiement sécurisé par Stripe — Visa, Mastercard, American Express.</p>
            <div style={{ background: '#111b0a', border: '1px solid #2a4a00', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#a3ff6b' }}>💡 PCI-DSS niveau 1 — vos données bancaires ne sont jamais stockées.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: '#a3ff6b', minWidth: '80px' }}>04</div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px' }}>Recevez votre code</h2>
            <p style={{ color: '#888', lineHeight: 1.8, margin: '0 0 16px' }}>Votre code arrive par email sous 24 à 72h maximum selon le service.</p>
            <div style={{ background: '#111b0a', border: '1px solid #2a4a00', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#a3ff6b' }}>💡 Si le code ne fonctionne pas, remboursement intégral garanti.</div>
          </div>
        </div>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 16px' }}>Prêt à débloquer votre téléphone ?</h2>
          <p style={{ color: '#888', margin: '0 0 24px' }}>France, Suisse, Belgique, Luxembourg et Afrique.</p>
          <a href="/order" style={{ background: '#a3ff6b', color: '#0a0a0a', padding: '16px 40px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>Commander maintenant →</a>
        </div>
      </div>
    </div>
  )
}
