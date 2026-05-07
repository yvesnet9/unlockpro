# UnlockPro 🔓

Plateforme de déblocage de téléphones type DoctorSIM — Next.js 14, PostgreSQL, Stripe.

---

## Stack

| Couche      | Techno             |
|-------------|-------------------|
| Frontend    | Next.js 14 App Router |
| Styling     | CSS-in-JS (inline) |
| Backend     | API Routes Next.js |
| BDD         | PostgreSQL (pg)    |
| Paiement    | Stripe Checkout    |
| Email       | Resend             |
| Fournisseurs| DoctorUnlock, GSMFusion, UnlockBase |

---

## Installation rapide

```bash
# 1. Cloner et installer
git clone ... && cd unlockpro
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# → Remplir DATABASE_URL, STRIPE_SECRET_KEY, RESEND_API_KEY...

# 3. Créer la base de données
createdb unlockpro
npm run db:migrate

# 4. Lancer en dev
npm run dev
```

---

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── order/page.tsx        # Formulaire de commande
│   ├── dashboard/page.tsx    # Admin dashboard
│   └── api/
│       ├── orders/route.ts   # Créer commande + GET statut
│       ├── webhook/route.ts  # Webhook Stripe
│       └── providers/route.ts# Liste services dispo
├── lib/
│   ├── db/index.ts           # Pool PostgreSQL
│   ├── providers/index.ts    # Abstraction fournisseurs + routeur
│   └── email/index.ts        # Emails transactionnels (Resend)
schema.sql                    # Schéma BDD complet
```

---

## Flux de paiement

```
Client → POST /api/orders → Stripe Checkout
                                  ↓
                         Stripe Webhook (paiement OK)
                                  ↓
                         Soumission fournisseur API
                                  ↓
                         Code stocké + email envoyé
```

---

## Fournisseurs

L'abstraction dans `src/lib/providers/index.ts` permet d'ajouter
n'importe quel fournisseur en implémentant l'interface `ProviderAdapter` :

```typescript
interface ProviderAdapter {
  name: string
  submit(req: UnlockRequest, apiKey: string, apiUrl: string): Promise<UnlockResponse>
  poll(providerOrderId: string, apiKey: string, apiUrl: string): Promise<UnlockResponse>
}
```

Le routeur essaie automatiquement dans l'ordre de priorité et bascule en cas d'échec.

---

## Polling des commandes

Les commandes "processing" doivent être relancées régulièrement.
Configurer un cron (Vercel Cron Jobs ou cron Linux) :

```
# Toutes les 5 minutes
*/5 * * * * curl -X POST https://tonsite.fr/api/cron/poll
```

---

## Déploiement

**Vercel (recommandé)**
```bash
npm i -g vercel
vercel --prod
# Ajouter les env vars dans le dashboard Vercel
```

**VPS (Railway / Render / DigitalOcean)**
```bash
npm run build
npm start
# + PostgreSQL managé (Railway DB ou Supabase)
```

---

## TODO prioritaire

- [ ] Page de suivi de commande (`/order/success`)
- [ ] Cron de polling (`/api/cron/poll`)
- [ ] Route admin orders (`/api/admin/orders`)
- [ ] Auth admin (middleware NextAuth ou simple token)
- [ ] Pages SEO générées dynamiquement par marque/opérateur
- [ ] Programme revendeurs B2B

---

## Licence

Projet propriétaire — usage commercial.
