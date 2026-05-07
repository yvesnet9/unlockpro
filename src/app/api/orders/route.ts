import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { query, queryOne } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2020-03-02' })

// Validation IMEI (algorithme de Luhn)
function isValidIMEI(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) return false
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let d = parseInt(imei[i])
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return (sum * 9) % 10 === parseInt(imei[14])
}

const schema = z.object({
  serviceId: z.number().int().positive(),
  imei: z.string().length(15),
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  // 1. Validation
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 })
  }
  const { serviceId, imei, email } = parsed.data

  if (!isValidIMEI(imei)) {
    return NextResponse.json({ error: 'IMEI invalide. Vérifiez les 15 chiffres.' }, { status: 400 })
  }

  // 2. Récupère le service
  const service = await queryOne<any>(
    `SELECT * FROM services WHERE id = $1 AND active = TRUE`,
    [serviceId]
  )
  if (!service) {
    return NextResponse.json({ error: 'Service introuvable.' }, { status: 404 })
  }

  // 3. Crée la commande en BDD avec statut 'pending'
  const [order] = await query<any>(
    `INSERT INTO orders (service_id, imei, email, amount, status)
     VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
    [serviceId, imei, email, service.price]
  )

  // 4. Crée un Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(Number(service.price) * 100),
        product_data: {
          name: service.name,
          description: `IMEI : ${imei}`,
        },
      },
      quantity: 1,
    }],
    metadata: { orderId: order.id },
    success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?id=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/order?cancelled=1`,
  })

  // Sauvegarde le PaymentIntent ID
  await query(
    `UPDATE orders SET stripe_pi = $1 WHERE id = $2`,
    [session.payment_intent, order.id]
  )

  return NextResponse.json({ checkoutUrl: session.url, orderId: order.id })
}

// GET /api/orders/:id — statut d'une commande
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

  const order = await queryOne<any>(
    `SELECT o.id, o.status, o.unlock_code, o.imei, o.created_at, o.updated_at,
            s.name as service_name, s.eta_hours
     FROM orders o JOIN services s ON s.id = o.service_id
     WHERE o.id = $1`,
    [id]
  )

  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })

  // Ne retourne le code que si completé
  return NextResponse.json({
    id: order.id,
    status: order.status,
    serviceName: order.service_name,
    imei: order.imei,
    unlockCode: order.status === 'completed' ? order.unlock_code : null,
    etaHours: order.eta_hours,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  })
}
