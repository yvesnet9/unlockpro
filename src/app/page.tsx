'use client'
import { useState } from 'react'
import Link from 'next/link'

const COUNTRIES = [
  { code: 'CI', flag: '🇨🇮', name: "Cote d'Ivoire", dial: '+225' },
  { code: 'CM', flag: '🇨🇲', name: 'Cameroun', dial: '+237' },
  { code: 'SN', flag: '🇸🇳', name: 'Sénégal', dial: '+221' },
  { code: 'CD', flag: '🇨🇩', name: 'Congo RDC', dial: '+243' },
  { code: 'ML', flag: '🇲🇱', name: 'Mali', dial: '+223' },
  { code: 'GN', flag: '🇬🇳', name: 'Guinée', dial: '+224' },
  { code: 'BJ', flag: '🇧🇯', name: 'Bénin', dial: '+229' },
  { code: 'TG', flag: '🇹🇬', name: 'Togo', dial: '+228' },
]

const AMOUNTS = [5, 10, 15, 25, 50]

const STATS = [
  { value: '500K+', label: 'recharges envoyées' },
  { value: '50+', label: 'pays couverts' },
  { value: '< 10s', label: 'livraison moyenne' },
  { value: '4.9/5', label: 'avis clients' },
]

const TESTIMONIALS = [
  { name: 'Aminata B.', country: 'France', flag: '🇫🇷', device: 'MTN Cote Ivoire', date: 'Il y a 2 jours', comment: 'Ma mère a reçu la recharge en moins de 10 secondes. Service impeccable !', stars: 5 },
  { name: 'Marc D.', country: 'Belgique', flag: '🇧🇪', device: 'Orange Cameroun', date: 'Il y a 3 jours', comment: 'Rapide, fiable et sans frais cachés. J utilise UnlockPro chaque semaine.', stars: 5 },
  { name: 'Fatou D.', country: 'Suisse', flag: '🇨🇭', device: 'Airtel Sénégal', date: 'Il y a 5 jours', comment: 'Livraison instantanée comme promis. Mon frère a reçu son crédit immédiatement.', stars: 5 },
  { name: 'Fatou D.', country: 'Suisse', flag: '🇨🇭', device: 'Airtel Sénégal', date: 'Il y a 5 jours', comment: 'Livraison instantanée comme promis. Mon frère a reçu son crédit immédiatement.', stars: 5 },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('recharge')
  const [selectedCountry, setSelectedCountry] = useState('CI')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState(10)
  const country = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>Unlock<span style={{ color: '#059669' }}>Pro</span></div>
        <div style={{ display: 'flex', gap: '28px', fontSize: '13px' }}>
          <Link href="/order?type=recharge" style={{ color: '#059669', textDecoration: 'none', fontWeight: 700 }}>Recharges</Link>
          <Link href="/order/giftcard" style={{ color: '#888', textDecoration: 'none' }}>Gift Cards</Link>
          <Link href="/order?type=unlock" style={{ color: '#888', textDecoration: 'none' }}>Déblocage</Link>
          <Link href="/dashboard" style={{ color: '#888', textDecoration: 'none' }}>Mon compte</Link>
        </div>
        <Link href="/order" style={{ background: '#059669', color: '#0a0a0a', padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: 800, textDecoration: 'none' }}>Commander</Link>
      </nav>

      <div style={{ background: '#111', borderBottom: '1px solid #1a1a1a', padding: '8px 48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['500 000+ recharges envoyées', 'Paiement sécurisé Stripe', 'Livraison instantanée', 'Support 7j/7'].map(t => (
            <span key={t} style={{ fontSize: '12px', color: '#555' }}><span style={{ color: '#059669' }}>✓</span> {t}</span>
          ))}
        </div>
      </div>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 48px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1a2e0f', border: '1px solid #3a5a1a', borderRadius: '20px', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>Service disponible maintenant</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', margin: '0 0 20px' }}>
            Rechargez le téléphone<br />de vos proches<br /><span style={{ color: '#059669' }}>en Afrique.</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, margin: '0 0 28px', maxWidth: '400px' }}>
            MTN, Orange, Airtel, Moov et 50+ opérateurs. Livraison instantanée. Zéro frais caché.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => setSelectedCountry(c.code)}
                style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${selectedCountry === c.code ? '#059669' : '#2a2a2a'}`, background: selectedCountry === c.code ? '#1a2e0f' : 'transparent', color: selectedCountry === c.code ? '#059669' : '#555', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                {c.flag} {c.code}
              </button>
            ))}
            <span style={{ fontSize: '12px', color: '#444', alignSelf: 'center' }}>+42 pays</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#444' }}>✓ Livraison instantanée sur le téléphone du destinataire</span>
            <span style={{ fontSize: '12px', color: '#444' }}>✓ Remboursé si échec · Paiement 100% sécurisé</span>
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', gap: '4px', background: '#1a1a1a', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
            {[['recharge','Recharge'],['giftcard','Gift Card'],['unlock','Déblocage']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ flex: 1, padding: '9px', fontSize: '12px', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700, background: activeTab === key ? '#059669' : 'transparent', color: activeTab === key ? '#0a0a0a' : '#555' }}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'recharge' && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600 }}>PAYS DESTINATION</label>
                <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '11px 12px', color: '#f0ede8', fontSize: '13px', outline: 'none' }}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600 }}>NUMÉRO DU DESTINATAIRE</label>
                <input type="tel" placeholder={country ? country.dial + ' XX XX XX XX' : '+XX'} value={phone} onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', background: '#0a0a0a', border: `1px solid ${phone.length > 8 ? '#059669' : '#2a2a2a'}`, borderRadius: '8px', padding: '11px 12px', color: '#f0ede8', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600 }}>MONTANT</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {AMOUNTS.map(a => (
                    <button key={a} onClick={() => setAmount(a)}
                      style={{ flex: 1, padding: '10px 6px', borderRadius: '8px', border: `1px solid ${amount === a ? '#059669' : '#2a2a2a'}`, background: amount === a ? '#1a2e0f' : 'transparent', color: amount === a ? '#059669' : '#555', fontSize: '13px', cursor: 'pointer', fontWeight: 700 }}>
                      {a} €
                    </button>
                  ))}
                </div>
              </div>
              <Link href={`/order/recharge?country=${selectedCountry}&phone=${phone}&amount=${amount}`}
                style={{ display: 'block', background: '#059669', color: '#0a0a0a', padding: '14px', borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '15px', textDecoration: 'none' }}>
                Envoyér la recharge →
              </Link>
            </>
          )}
          {activeTab === 'giftcard' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎁</div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Amazon, iTunes, Google Play et plus</p>
              <Link href="/order/giftcard" style={{ display: 'block', background: '#059669', color: '#0a0a0a', padding: '14px', borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>Voir les Gift Cards →</Link>
            </div>
          )}
          {activeTab === 'unlock' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔓</div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Déblocage officiel toutes marques en 24h</p>
              <Link href="/order?type=unlock" style={{ display: 'block', background: '#059669', color: '#0a0a0a', padding: '14px', borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>Debloquer mon téléphone →</Link>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
            {['🔒 Stripe SSL', '⚡ Instantane', '↩ Remboursé si échec'].map(t => (
              <span key={t} style={{ fontSize: '11px', color: '#444' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '40px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#059669' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 48px' }}>
        <p style={{ fontSize: '12px', color: '#555', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>NOS SERVICES</p>
        <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 48px' }}>Tout ce dont vous avez besoin.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { title: 'Recharge mobile', desc: 'MTN, Orange, Airtel, Moov, Vodacom...', price: '5 € – 50 €', hot: true, icon: '📱', href: '/order/recharge' },
            { title: 'Gift Cards', desc: 'Amazon, iTunes, Google Play, Netflix...', price: '10 € – 100 €', hot: false, icon: '🎁', href: '/order/giftcard' },
            { title: 'Déblocage téléphone', desc: 'iPhone, Samsung, Huawei — Code officiel', price: 'dès 12,99 €', hot: false, icon: '🔓', href: '/order?type=unlock' },
          ].map(s => (
            <Link key={s.title} href={s.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: s.hot ? '#111b0a' : '#111', border: `1px solid ${s.hot ? '#3a5a1a' : '#1e1e1e'}`, borderRadius: '12px', padding: '28px', cursor: 'pointer' }}>
                {s.hot && <div style={{ background: '#059669', color: '#0a0a0a', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>POPULAIRE</div>}
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f0ede8', marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#555', marginBottom: '16px', lineHeight: 1.5 }}>{s.desc}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669' }}>{s.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '80px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#555', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>PROCESSUS</p>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 48px' }}>Simple. Rapide. Instantané.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { n: '01', title: 'Choisissez le pays', desc: 'Sélectionnez le pays et operateur du destinataire.' },
              { n: '02', title: 'Entrez le numéro', desc: 'Le numéro de téléphone de votre proche en Afrique.' },
              { n: '03', title: 'Payez en securite', desc: 'Paiement par carte ou PayPal via Stripe.' },
              { n: '04', title: 'Livraison instantanée', desc: 'Le crédit arrive en moins de 10 secondes.' },
            ].map(step => (
              <div key={step.n} style={{ borderTop: '2px solid #059669', paddingTop: '20px' }}>
                <div style={{ fontSize: '13px', color: '#059669', fontWeight: 700, marginBottom: '10px' }}>{step.n}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', color: '#f0ede8' }}>{step.title}</h3>
                <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '14px 28px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#059669', lineHeight: 1 }}>4.9</div>
                <div style={{ color: '#059669', fontSize: '16px' }}>★★★★★</div>
              </div>
              <div style={{ borderLeft: '1px solid #222', paddingLeft: '16px', textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Excellent</div>
                <div style={{ fontSize: '12px', color: '#555' }}>Basé sur 500K+ recharges</div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>✓ Avis vérifiés</div>
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Ce que disent nos clients</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '10px', color: '#059669', background: '#1a2e0f', padding: '3px 8px', borderRadius: '20px', fontWeight: 600 }}>✓ Vérifié</div>
                <div style={{ color: '#059669', fontSize: '16px', marginBottom: '12px' }}>{'★'.repeat(t.stars)}</div>
                <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '18px', fontSize: '13px' }}>"{t.comment}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1a2e0f', border: '1px solid #3a5a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#059669', flexShrink: 0 }}>
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{t.name} {t.flag}</div>
                    <div style={{ color: '#444', fontSize: '11px' }}>{t.country} · {t.device}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#333' }}>{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '60px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { title: 'Remboursément garanti', desc: 'Si la recharge ne parvient pas, on vous rembourse intégralemennt. Sans question.' },
            { title: 'Paiement 100% sécurisé', desc: 'Stripe PCI-DSS niveau 1. Aucune donnee bancaire stockee sur nos serveurs.' },
            { title: 'Support 7j/7', desc: 'Notre équipe répond en moins de 2h par email ou WhatsApp.' },
          ].map(g => (
            <div key={g.title} style={{ borderLeft: '3px solid #059669', paddingLeft: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', color: '#f0ede8' }}>{g.title}</h3>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '40px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Unlock<span style={{ color: '#059669' }}>Pro</span></div>
        <div style={{ fontSize: '13px', color: '#444', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[['Recharges','/order/recharge'],['Gift Cards','/order/giftcard'],['Déblocage','/order?type=unlock'],['FAQ','/faq'],['Mentions legales','/mentions-legales'],['CGV','/cgv'],['Support','/support']].map(([label, href]) => (
            <Link key={label} href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#333' }}>© {new Date().getFullYear()} UnlockPro — Paiement sécurisé · Livraison instantanée · Support 7j/7</p>
      </footer>

    </div>
  )
}
