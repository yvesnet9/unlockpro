import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { query, queryOne } from '@/lib/db'
import { submitUnlockOrder } from '@/lib/providers'
import { sendOrderConfirmationEmail, sendAdminAlert } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2020-03-02' })
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.orderId
  if (!orderId) return NextResponse.json({ received: true })

  await query(
    `UPDATE orders SET status = 'paid', stripe_pi = $1 WHERE id = $2 AND status = 'pending'`,
    [session.payment_intent, orderId]
  )

  const order = await queryOne<any>(
    `SELECT o.imei, o.service_id, s.brand, s.carrier, s.country, s.cost
     FROM orders o JOIN services s ON s.id = o.service_id
     WHERE o.id = $1`,
    [orderId]
  )
  if (!order) return NextResponse.json({ received: true })

  console.log('[webhook] envoi email confirmation pour', orderId)
  try {
    await sendOrderConfirmationEmail(orderId)
    console.log('[webhook] email confirmation envoyé ✓')
  } catch (err: any) {
    console.error('[webhook] erreur email:', err.message)
  }

  try {
    await query(`UPDATE orders SET status = 'processing' WHERE id = $1`, [orderId])
    const result = await submitUnlockOrder({
      imei: order.imei,
      brand: order.brand,
      carrier: order.carrier,
      country: order.country,
      serviceId: order.service_id,
    })
    await query(
      `UPDATE orders SET provider_id=$1, provider_order_id=$2, cost=$3, unlock_code=$4,
       status=CASE WHEN $4 IS NOT NULL THEN 'completed' ELSE 'processing' END WHERE id=$5`,
      [result.providerId, result.providerOrderId, order.cost, result.code ?? null, orderId]
    )
    if (result.code) {
      await import('@/lib/email').then(m => m.sendCodeEmail(orderId)).catch(console.error)
    }
  } catch (err: any) {
    await query(`UPDATE orders SET status='failed', error_msg=$1 WHERE id=$2`, [err.message, orderId])
    await sendAdminAlert(orderId, `Échec fournisseur : ${err.message}`).catch(console.error)
  }

  return NextResponse.json({ received: true })
}