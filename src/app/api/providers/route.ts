import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const brand   = req.nextUrl.searchParams.get('brand')
  const carrier = req.nextUrl.searchParams.get('carrier')
  const country = req.nextUrl.searchParams.get('country') ?? 'FR'

  const params: unknown[] = [country]
  const conditions = ['s.active = TRUE', 's.country = $1']
  let p = 2

  if (brand)   { conditions.push(`s.brand = $${p++}`);   params.push(brand) }
  if (carrier) { conditions.push(`s.carrier = $${p++}`); params.push(carrier) }

  const services = await query<any>(`
    SELECT s.id, s.name, s.price, s.eta_hours, s.brand, s.carrier
    FROM services s
    WHERE ${conditions.join(' AND ')}
    ORDER BY s.price ASC
  `, params)

  return NextResponse.json(services)
}
