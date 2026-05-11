import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { query } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { email, phone, country, product_id, product_name, operator_name, amount_eur, amount_destination, unit } = await req.json()

    if (!email || !phone || !product_id || !amount_eur) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO recharge_orders (email, phone, operator_id, operator_name, product_id, product_name, amount_destination, unit, amount_eur, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending') RETURNING id`,
      [email, phone, 0, operator_name, product_id, product_name, amount_destination, unit, amount_eur]
    )
    const orderId = result[0].id

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(Number(amount_eur) * 100),
          product_data: {
            name: `Recharge ${operator_name} — ${phone}`,
            description: `${amount_destination} ${unit} vers ${phone} (${country})`,
          },
        },
        quantity: 1,
      }],
      metadata: { orderId, type: 'recharge' },
      success_url: `${process.env.NEXT_PUBLIC_URL}/order/recharge/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/order/recharge`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
