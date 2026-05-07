'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRANDS = [
  { id: 'apple', label: 'Apple', icon: '🍎' },
  { id: 'samsung', label: 'Samsung', icon: '📱' },
  { id: 'huawei', label: 'Huawei', icon: '📲' },
  { id: 'other', label: 'Autre', icon: '📡' },
]

const CARRIERS = [
  { id: 'sfr', label: 'SFR' },
  { id: 'orange', label: 'Orange' },
  { id: 'bouygues', label: 'Bouygues' },
  { id: 'free', label: 'Free' },
]

const STATS = [
  { value: '50 000+', label: 'téléphones débloqués' },
  { value: '99.2 %', label: 'taux de succès' },
  { value: '< 24h', label: 'délai moyen' },
  { value: '4.9 / 5', label: 'avis clients' },
]

const STEPS = [
  { n: '01', title: 'Entrez votre IMEI', desc: 'Composez *#06# pour obtenir votre IMEI à 15 chiffres.' },
  { n: '02', title: 'Choisissez votre service', desc: 'Sélectionnez votre marque et votre opérateur actuel.' },
  { n: '03', title: 'Payez en sécurité', desc: 'Paiement par carte ou PayPal via Stripe.' },
  { n: '04', title: 'Recevez votre code', desc: 'Le code arrive par email sous 24h maximum.' },
]

export default function HomePage() {
  const [brand, setBrand] = useState('')
  const [carrier, setCarrier] = useState('')
  const [imei, setImei] = useState('')

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Unlock<span style={{ color: '#a3ff6b' }}>Pro</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: '#888' }}>
          <Link href="/comment-ca-marche" style={{ color: 'inherit', textDecoration: 'none' }}>Comment ça marche</Link>
          <Link href="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</Link>
          <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
          <Link href="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link>
          <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Mon compte</Link>
        </div>
        <Link href="/order" style={{ background: '#a3ff6b', color: '#0a0a0a', padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
          Débloquer maintenant
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-block', background: '#1a2e0f', color: '#a3ff6b', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '20px', marginBottom: '24px', letterSpacing: '0.04em' }}>
            
             ✓ SERVICE OFFICIEL — LÉGAL EN EUROPE & AFRIQUE
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', margin: '0 0 24px' }}>
            Débloquez votre<br />téléphone en<br /><span style={{ color: '#a3ff6b' }}>moins de 24h.</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#888', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '420px' }}>
            Compatible tous opérateurs français. Code officiel garanti, remboursement si échec.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/order" style={{ background: '#a3ff6b', color: '#0a0a0a', padding: '16px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
              Commencer →
            </Link>
            <Link href="/comment-ca-marche" style={{ background: 'transparent', color: '#f0ede8', padding: '16px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid #2a2a2a' }}>
              Comment ça marche
            </Link>
          </div>
        </div>

        {/* Widget de commande rapide */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '32px' }}>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#666', fontWeight: 600, letterSpacing: '0.04em' }}>COMMANDE RAPIDE</p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>Marque</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {BRANDS.map(b => (
                <button key={b.id} onClick={() => setBrand(b.id)}
                  style={{ padding: '10px 6px', borderRadius: '8px', border: `1px solid ${brand === b.id ? '#a3ff6b' : '#222'}`, background: brand === b.id ? '#1a2e0f' : 'transparent', color: brand === b.id ? '#a3ff6b' : '#888', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}>
                  <div>{b.icon}</div>
                  <div style={{ marginTop: '4px' }}>{b.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>Opérateur actuel</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {CARRIERS.map(c => (
                <button key={c.id} onClick={() => setCarrier(c.id)}
                  style={{ padding: '10px 6px', borderRadius: '8px', border: `1px solid ${carrier === c.id ? '#a3ff6b' : '#222'}`, background: carrier === c.id ? '#1a2e0f' : 'transparent', color: carrier === c.id ? '#a3ff6b' : '#888', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>IMEI (15 chiffres)</label>
            <input
              type="text"
              placeholder="Ex : 356938035643809"
              maxLength={15}
              value={imei}
              onChange={e => setImei(e.target.value.replace(/\D/g, ''))}
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '12px 14px', color: '#f0ede8', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
            />
            <p style={{ fontSize: '11px', color: '#555', margin: '6px 0 0' }}>Composez *#06# sur votre téléphone</p>
          </div>

          <Link
            href={brand && carrier && imei.length === 15 ? `/order?brand=${brand}&carrier=${carrier}&imei=${imei}` : '#'}
            style={{ display: 'block', background: brand && carrier && imei.length === 15 ? '#a3ff6b' : '#1e1e1e', color: brand && carrier && imei.length === 15 ? '#0a0a0a' : '#444', padding: '14px', borderRadius: '10px', textAlign: 'center', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'all 0.2s', cursor: brand && carrier && imei.length === 15 ? 'pointer' : 'default' }}>
            Voir le prix et commander →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', color: '#a3ff6b' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how" style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 48px' }}>
        <p style={{ fontSize: '12px', color: '#666', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '16px' }}>PROCESSUS</p>
        <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1.5px', margin: '0 0 64px' }}>Simple. Rapide. Garanti.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {STEPS.map(step => (
            <div key={step.n} style={{ borderTop: '2px solid #a3ff6b', paddingTop: '24px' }}>
              <div style={{ fontSize: '13px', color: '#a3ff6b', fontWeight: 700, marginBottom: '12px' }}>{step.n}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services / prix */}
      <section id="services" style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '100px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: '#666', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '16px' }}>TARIFS</p>
          <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1.5px', margin: '0 0 48px' }}>Tarifs transparents,<br />sans surprise.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { name: 'iPhone — SFR / Orange / Bouygues', price: '24,99 €', eta: '24–48h', hot: true },
              { name: 'Samsung Galaxy — France', price: '17,99 €', eta: '12–24h', hot: false },
              { name: 'Huawei — France', price: '12,99 €', eta: '48–72h', hot: false },
              { name: 'Autres marques', price: '11,99 €', eta: '48–72h', hot: false },
              { name: 'Service B2B (10+ commandes)', price: 'Sur devis', eta: 'Prioritaire', hot: false },
              { name: 'iCloud removal', price: 'Bientôt', eta: '—', hot: false },
            ].map(s => (
              <div key={s.name} style={{ background: s.hot ? '#111b0a' : '#111', border: `1px solid ${s.hot ? '#3a5a1a' : '#1e1e1e'}`, borderRadius: '12px', padding: '24px', position: 'relative' }}>
                {s.hot && <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#a3ff6b', color: '#0a0a0a', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>POPULAIRE</div>}
                <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '16px', lineHeight: 1.4 }}>{s.name}</div>
                <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>{s.price}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>Délai : {s.eta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          {[
            { title: 'Remboursement garanti', desc: 'Si le code ne fonctionne pas, on vous rembourse intégralement. Sans question.' },
            { title: 'Paiement 100% sécurisé', desc: 'Stripe PCI-DSS niveau 1. Aucune donnée bancaire stockée sur nos serveurs.' },
            { title: 'Support 7j/7', desc: 'Une question ? Notre équipe répond en moins de 2h par email ou chat.' },
          ].map(g => (
            <div key={g.title} style={{ borderLeft: '3px solid #a3ff6b', paddingLeft: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px' }}>{g.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Temoignages */}
      <section style={{padding:'80px 48px',background:'#050505'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <h2 style={{fontSize:'36px',fontWeight:800,margin:'0 0 48px',textAlign:'center'}}>Ce que disent nos clients</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'24px'}}>
            {[{name:'Thomas M.',country:'🇫🇷 France',text:'iPhone SFR débloqué en 24h. Code reçu par email, fonctionne parfaitement. Service impeccable !',stars:5},{name:'Sarah K.',country:'🇨🇭 Suisse',text:'Swisscom débloqué rapidement. Prix correct et service client réactif. Je recommande.',stars:5},{name:'Marc D.',country:'🇧🇪 Belgique',text:'Samsung Galaxy Proximus débloqué en moins de 12h. Très satisfait du service !',stars:5}].map((t,i) => (
              <div key={i} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'28px'}}>
                <div style={{color:'#a3ff6b',fontSize:'18px',marginBottom:'16px'}}>{"★".repeat(t.stars)}</div>
                <p style={{color:'#888',lineHeight:1.8,marginBottom:'20px'}}>{t.text}</p>
                <div style={{fontWeight:700,fontSize:'14px'}}>{t.name}</div>
                <div style={{color:'#444',fontSize:'12px',marginTop:'4px'}}>{t.country}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
          Unlock<span style={{ color: '#a3ff6b' }}>Pro</span>
        </div>
        <div style={{ fontSize: '13px', color: '#444', display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/comment-ca-marche" style={{ color: 'inherit', textDecoration: 'none' }}>Comment ça marche</Link>
          <Link href="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</Link>
          <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
          <Link href="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link>
          <Link href="/mentions-legales" style={{ color: 'inherit', textDecoration: 'none' }}>Mentions légales</Link>
          <Link href="/cgv" style={{ color: 'inherit', textDecoration: 'none' }}>CGV</Link>
          <Link href="/confidentialite" style={{ color: 'inherit', textDecoration: 'none' }}>Confidentialité</Link>
          <Link href="/suivi" style={{ color: 'inherit', textDecoration: 'none' }}>Suivi commande</Link>
          <Link href="/support" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
        </div>
        <p style={{ fontSize: '12px', color: '#333', marginTop: '24px' }}>
          © {new Date().getFullYear()} UnlockPro. Le déblocage de téléphone est légal en France et dans l'UE.
        </p>
      </footer>
    </div>
  )
}
