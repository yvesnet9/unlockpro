export const metadata = {
  title: 'FAQ Déblocage téléphone — UnlockPro',
  description: 'Toutes les réponses sur le déblocage de téléphone.',
}

export default function FAQ() {
  const questions = [
    { q: "Combien de temps prend le déblocage ?", a: "De quelques heures pour Samsung jusqu'a 48-72h pour iPhone. Le delai exact est indique avant le paiement." },
    { q: "Est-ce que le deblocage est legal ?", a: "Oui, totalement legal en France, Belgique, Suisse et dans toute l'Union Europeenne." },
    { q: "Que se passe-t-il si le code ne fonctionne pas ?", a: "Remboursement integral dans 3 a 5 jours ouvres. Sans questions." },
    { q: "Comment entrer le code de deblocage ?", a: "Inserez une SIM d'un autre operateur. Le telephone demandera un code. Entrez le code recu par email." },
    { q: "Le deblocage rompt-il la garantie ?", a: "Non. Le deblocage reseau ne modifie pas le logiciel et ne rompt pas la garantie constructeur." },
    { q: "Quels operateurs sont supportes ?", a: "SFR, Orange, Bouygues, Free (France), Swisscom, Sunrise, Salt (Suisse), Proximus, Base (Belgique), MTN, Orange, Airtel, Vodacom (Afrique)." },
    { q: "Puis-je debloquer un telephone vole ?", a: "Non. Nous ne debloquons pas les telephones signales voles ou sur liste noire IMEI." },
    { q: "Le deblocage est-il permanent ?", a: "Oui, permanent. Meme apres une mise a jour du logiciel." },
    { q: "Comment payer ?", a: "Visa, Mastercard et American Express via Stripe. Donnees bancaires jamais stockees." },
  ]
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:'#0a0a0a',color:'#f0ede8',minHeight:'100vh'}}>
      <nav style={{padding:'20px 48px',borderBottom:'1px solid #1e1e1e',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:700,textDecoration:'none',color:'#f0ede8'}}>Unlock<span style={{color:'#a3ff6b'}}>Pro</span></a>
        <a href="/order" style={{background:'#a3ff6b',color:'#0a0a0a',padding:'10px 22px',borderRadius:'8px',fontSize:'14px',fontWeight:600,textDecoration:'none'}}>Commander</a>
      </nav>
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'80px 48px'}}>
        <h1 style={{fontSize:'48px',fontWeight:800,margin:'0 0 16px'}}>Questions frequentes</h1>
        <p style={{fontSize:'18px',color:'#888',margin:'0 0 64px'}}>Tout ce que vous devez savoir sur le deblocage.</p>
        {questions.map((item,i) => (
          <div key={i} style={{borderBottom:'1px solid #1a1a1a',padding:'28px 0'}}>
            <h2 style={{fontSize:'18px',fontWeight:700,margin:'0 0 12px',color:'#f0ede8'}}>{item.q}</h2>
            <p style={{color:'#888',lineHeight:1.8,margin:0}}>{item.a}</p>
          </div>
        ))}
        <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'32px',textAlign:'center',marginTop:'48px'}}>
          <h2 style={{fontSize:'22px',fontWeight:700,margin:'0 0 12px'}}>Vous avez une autre question ?</h2>
          <a href="/support" style={{background:'#a3ff6b',color:'#0a0a0a',padding:'14px 32px',borderRadius:'10px',fontSize:'15px',fontWeight:700,textDecoration:'none',display:'inline-block'}}>Contacter le support</a>
        </div>
      </div>
    </div>
  )
}
