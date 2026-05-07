export const metadata = {
  title: 'Services de déblocage — France, Suisse, Belgique, Afrique — UnlockPro',
  description: 'Liste complète de nos services de déblocage par pays et opérateur.',
}

export default function Services() {
  const pays = [
    { flag: '🇫🇷', name: 'France', operateurs: ['SFR', 'Orange', 'Bouygues', 'Free', 'Lycamobile', 'NRJ Mobile', 'La Poste Mobile', 'Auchan Télécom'] },
    { flag: '🇨🇭', name: 'Suisse', operateurs: ['Swisscom', 'Sunrise', 'Salt', 'Lycamobile', 'Yallo', 'Wingo', 'Coop Mobile', 'M-Budget'] },
    { flag: '🇧🇪', name: 'Belgique', operateurs: ['Proximus', 'Base', 'Orange', 'VOO'] },
    { flag: '🇱🇺', name: 'Luxembourg', operateurs: ['POST', 'Tango', 'Orange'] },
    { flag: '🇳🇱', name: 'Pays-Bas', operateurs: ['KPN', 'Vodafone', 'T-Mobile', 'Tele2'] },
    { flag: '🇩🇪', name: 'Allemagne', operateurs: ['Deutsche Telekom', 'Vodafone', 'O2', 'E-Plus'] },
    { flag: '🇦🇹', name: 'Autriche', operateurs: ['A1', 'T-Mobile', 'Drei'] },
    { flag: '🇲🇦', name: 'Maroc', operateurs: ['Maroc Telecom', 'Inwi', 'Orange'] },
    { flag: '🇨🇮', name: 'Côte d\'Ivoire', operateurs: ['MTN', 'Orange', 'Moov'] },
    { flag: '🇳🇬', name: 'Nigeria', operateurs: ['MTN', 'Airtel', 'Glo'] },
    { flag: '🇨🇲', name: 'Cameroun', operateurs: ['MTN', 'Orange'] },
    { flag: '🇸🇳', name: 'Sénégal', operateurs: ['MTN', 'Orange'] },
    { flag: '🇿🇦', name: 'Afrique du Sud', operateurs: ['Vodacom', 'MTN', 'Cell C', 'Telkom', 'Rain'] },
    { flag: '🇨🇩', name: 'RDC', operateurs: ['Vodacom', 'Airtel', 'Orange', 'Africel'] },
    { flag: '🇦🇴', name: 'Angola', operateurs: ['Unitel', 'Movicel'] },
  ]

  const marques = ['Apple iPhone', 'Samsung Galaxy', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Tecno', 'Infinix', 'Itel']

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 48px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 700, textDecoration: 'none', color: '#f0ede8' }}>Unlock<span style={{ color: '#a3ff6b' }}>Pro</span></a>
        <a href="/order" style={{ background: '#a3ff6b', color: '#0a0a0a', padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Commander →</a>
      </nav>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', margin: '0 0 16px' }}>Nos services</h1>
        <p style={{ fontSize: '18px', color: '#888', margin: '0 0 64px' }}>215 services disponibles dans 15 pays. Code officiel garanti ou remboursé.</p>

        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 32px' }}>Marques supportées</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '64px' }}>
          {marques.map(m => (
            <span key={m} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600 }}>{m}</span>
          ))}
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 32px' }}>Pays et opérateurs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {pays.map(p => (
            <div key={p.name} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{p.flag}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px' }}>{p.name}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {p.operateurs.map(op => (
                  <span key={op} style={{ background: '#1a1a1a', color: '#888', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>{op}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px' }}>Votre pays n'est pas listé ?</h2>
          <p style={{ color: '#888', margin: '0 0 24px' }}>Contactez-nous — nous ajoutons régulièrement de nouveaux services.</p>
          <a href="/support" style={{ background: '#a3ff6b', color: '#0a0a0a', padding: '16px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>Nous contacter →</a>
        </div>
      </div>
    </div>
  )
}
