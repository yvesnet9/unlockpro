export default function Confidentialite() {
  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', padding: '80px 48px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <a href="/" style={{ color: '#a3ff6b', textDecoration: 'none', fontSize: '14px' }}>← Retour</a>
        <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', margin: '32px 0 48px' }}>Politique de confidentialité</h1>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>1. Responsable du traitement</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          <strong style={{ color: '#f0ede8' }}>L.I.S</strong> (BE0784.397.032)<br />
          Alsembergsesteenweg 897, 1180 Ukkel, Belgique<br />
          Email : support@unlockpro.fr
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>2. Données collectées</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Lors d'une commande, nous collectons :<br />
          — Adresse email de livraison<br />
          — Numéro IMEI du téléphone<br />
          — Opérateur et marque du téléphone<br />
          — Données de paiement (traitées par Stripe, non stockées sur nos serveurs)<br />
          — Adresse IP et données de navigation
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>3. Finalités du traitement</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Vos données sont utilisées pour :<br />
          — Traiter et livrer votre commande<br />
          — Envoyer les confirmations et codes par email<br />
          — Assurer le support client<br />
          — Prévenir la fraude<br />
          — Respecter nos obligations légales
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>4. Base légale</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Le traitement est fondé sur l'exécution du contrat (Article 6.1.b du RGPD) pour les données
          nécessaires à la commande, et sur notre intérêt légitime pour la prévention de la fraude.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>5. Conservation des données</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Vos données de commande sont conservées pendant 5 ans à compter de la date d'achat,
          conformément aux obligations légales comptables et fiscales.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>6. Partage des données</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Vos données peuvent être partagées avec :<br />
          — Nos fournisseurs de déblocage (IMEI uniquement, pour traiter la commande)<br />
          — Stripe (données de paiement)<br />
          — Resend (email de livraison uniquement)<br />
          Aucune donnée n'est vendue à des tiers.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>7. Vos droits</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Conformément au RGPD, vous disposez des droits suivants :<br />
          — Droit d'accès à vos données<br />
          — Droit de rectification<br />
          — Droit à l'effacement ("droit à l'oubli")<br />
          — Droit à la portabilité<br />
          — Droit d'opposition<br /><br />
          Pour exercer ces droits : support@unlockpro.fr
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>8. Cookies</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement (session utilisateur).
          Aucun cookie publicitaire ou de tracking n'est utilisé.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>9. Réclamation</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Vous pouvez introduire une réclamation auprès de l'Autorité de protection des données (APD) belge :
          autoriteprotectiondonnees.be
        </p>

        <p style={{ color: '#555', fontSize: '13px', marginTop: '48px' }}>Dernière mise à jour : mars 2026</p>
      </div>
    </div>
  )
}
