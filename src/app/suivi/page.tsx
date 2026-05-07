export const metadata = {
  title: 'Suivi de commande — UnlockPro',
  description: 'Suivez l\'état de votre commande de déblocage.',
}

export default function Suivi() {
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:'#0a0a0a',color:'#f0ede8',minHeight:'100vh'}}>
      <nav style={{padding:'20px 48px',borderBottom:'1px solid #1e1e1e',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:700,textDecoration:'none',color:'#f0ede8'}}>Unlock<span style={{color:'#a3ff6b'}}>Pro</span></a>
        <a href="/order" style={{background:'#a3ff6b',color:'#0a0a0a',padding:'10px 22px',borderRadius:'8px',fontSize:'14px',fontWeight:600,textDecoration:'none'}}>Commander</a>
      </nav>
      <div style={{maxWidth:'600px',margin:'0 auto',padding:'80px 48px'}}>
        <h1 style={{fontSize:'40px',fontWeight:800,margin:'0 0 16px'}}>Suivi de commande</h1>
        <p style={{color:'#888',margin:'0 0 48px'}}>Entrez votre numéro de commande pour voir l'état de votre déblocage.</p>
        <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'16px',padding:'32px'}}>
          <form action="/api/suivi" method="GET">
            <label style={{fontSize:'11px',fontWeight:700,letterSpacing:'1px',color:'#555',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>NUMÉRO DE COMMANDE</label>
            <input name="id" placeholder="Ex: 9B6D3374" style={{width:'100%',background:'#0a0a0a',border:'1px solid #2a2a2a',borderRadius:'8px',padding:'14px 16px',color:'#f0ede8',fontSize:'16px',outline:'none',boxSizing:'border-box',marginBottom:'16px'}} />
            <label style={{fontSize:'11px',fontWeight:700,letterSpacing:'1px',color:'#555',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>VOTRE EMAIL</label>
            <input name="email" type="email" placeholder="votre@email.com" style={{width:'100%',background:'#0a0a0a',border:'1px solid #2a2a2a',borderRadius:'8px',padding:'14px 16px',color:'#f0ede8',fontSize:'16px',outline:'none',boxSizing:'border-box',marginBottom:'24px'}} />
            <button type="submit" style={{width:'100%',background:'#a3ff6b',color:'#0a0a0a',padding:'16px',borderRadius:'10px',fontSize:'16px',fontWeight:700,border:'none',cursor:'pointer'}}>Rechercher ma commande →</button>
          </form>
        </div>
        <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'20px',marginTop:'24px',fontSize:'13px',color:'#666'}}>
          💡 Votre numéro de commande se trouve dans l'email de confirmation reçu après votre paiement.
        </div>
      </div>
    </div>
  )
}
