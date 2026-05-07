export default function CGV() {
  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', padding: '80px 48px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <a href="/" style={{ color: '#a3ff6b', textDecoration: 'none', fontSize: '14px' }}>← Retour</a>
        <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', margin: '32px 0 48px' }}>Conditions Générales de Vente</h1>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>1. Parties</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Les présentes CGV régissent les relations entre <strong style={{ color: '#f0ede8' }}>L.I.S</strong> (BE0784.397.032),
          Alsembergsesteenweg 897, 1180 Ukkel, Belgique — ci-après "UnlockPro" — et tout client passant commande sur unlockpro.fr ou lusinga.ch.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>2. Services proposés</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          UnlockPro propose des services de déblocage réseau de téléphones mobiles. Le client fournit son numéro IMEI
          et son opérateur actuel. UnlockPro transmet la demande à ses fournisseurs partenaires et livre un code de
          déblocage par email dans le délai indiqué lors de la commande.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>3. Prix et paiement</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne par carte bancaire ou PayPal via Stripe,
          plateforme sécurisée PCI-DSS niveau 1. Aucune donnée bancaire n'est stockée sur nos serveurs.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>4. Délai de livraison</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Le délai de livraison estimé est indiqué pour chaque service. Il est donné à titre indicatif et peut varier
          selon les fournisseurs et les opérateurs. En cas de dépassement significatif, le client sera informé par email.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>5. Garantie et remboursement</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          UnlockPro garantit le fonctionnement du code de déblocage. En cas d'échec avéré et confirmé,
          le client est remboursé intégralement dans un délai de 3 à 5 jours ouvrés sur le moyen de paiement utilisé.
          Aucune demande de remboursement ne sera acceptée si le code a été utilisé avec succès.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>6. Droit de rétractation</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas
          aux services pleinement exécutés avant la fin du délai de rétractation, avec l'accord exprès du consommateur.
          En passant commande, le client accepte que le service commence immédiatement et renonce à son droit de rétractation.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>7. Responsabilité</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          UnlockPro ne pourra être tenu responsable des dommages indirects liés à l'utilisation du service.
          Le client certifie être le propriétaire légitime du téléphone ou agir avec l'autorisation du propriétaire.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>8. Droit applicable</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Les présentes CGV sont soumises au droit belge. En cas de litige, les tribunaux de Bruxelles seront compétents.
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '40px 0 16px', color: '#a3ff6b' }}>9. Contact</h2>
        <p style={{ color: '#888', lineHeight: 1.8 }}>
          Pour toute réclamation : support@unlockpro.fr<br />
          L.I.S — Alsembergsesteenweg 897, 1180 Ukkel, Belgique
        </p>

        <p style={{ color: '#555', fontSize: '13px', marginTop: '48px' }}>Dernière mise à jour : mars 2026</p>
      </div>
    </div>
  )
}
