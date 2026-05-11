import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/dtone'

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get('country') ?? 'CI'
  try {
    const data = await getProducts(country)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
