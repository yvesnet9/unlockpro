export default function Blog() {
  const articles = [
    { slug: 'debloquer-iphone-sfr', title: 'Comment débloquer un iPhone bloqué SFR ?', date: 'Mars 2026', desc: 'Guide complet pour débloquer votre iPhone SFR rapidement et officiellement. Code garanti ou remboursé.', tag: 'iPhone' },
    { slug: 'debloquer-samsung-orange', title: 'Débloquer un Samsung Galaxy bloqué Orange', date: 'Mars 2026', desc: 'Toutes les étapes pour débloquer votre Samsung Galaxy d\'Orange en moins de 24h.', tag: 'Samsung' },
    { slug: 'debloquer-telephone-suisse', title: 'Déblocage téléphone Swisscom, Sunrise et Salt', date: 'Mars 2026', desc: 'Comment débloquer votre téléphone des opérateurs suisses Swisscom, Sunrise ou Salt facilement.', tag: 'Suisse' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 48px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 700, textDecoration: 'none', color: '#f0ede8' }}>Unlock<span style={{ color: '#a3ff6b' }}>Pro</span></a>
        <a href="/order" style={{ background: '#a3ff6b', color: '#0a0a0a', padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Commander →</a>
      </nav>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', margin: '0 0 16px' }}>Blog</h1>
        <p style={{ fontSize: '18px', color: '#888', margin: '0 0 64px' }}>Guides et conseils sur le déblocage de téléphone.</p>
        <div style={{ display: 'grid', gap: '24px' }}>
          {articles.map(a => (
            <a key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: 'none', background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '32px', display: 'block', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ background: '#1a2e0f', color: '#a3ff6b', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' }}>{a.tag}</span>
                <span style={{ color: '#444', fontSize: '13px' }}>{a.date}</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 12px', color: '#f0ede8' }}>{a.title}</h2>
              <p style={{ color: '#888', lineHeight: 1.7, margin: '0 0 16px' }}>{a.desc}</p>
              <span style={{ color: '#a3ff6b', fontSize: '14px', fontWeight: 600 }}>Lire l'article →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
