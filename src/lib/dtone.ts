const DTONE_BASE = 'https://dvs-api.dtone.com/v1'
const DTONE_KEY = process.env.DTONE_LOGIN!
const DTONE_SECRET = process.env.DTONE_API_KEY!

function authHeader() {
  const token = Buffer.from(`${DTONE_KEY}:${DTONE_SECRET}`).toString('base64')
  return { 'Authorization': `Basic ${token}`, 'Content-Type': 'application/json' }
}

const COUNTRY_MAP: Record<string, string> = {
  CI: 'CIV', CM: 'CMR', SN: 'SEN', CD: 'COD',
  ML: 'MLI', GN: 'GIN', BJ: 'BEN', TG: 'TGO'
}

export async function getProducts(countryCode: string) {
  const iso3 = COUNTRY_MAP[countryCode] ?? countryCode
  const res = await fetch(
    `${DTONE_BASE}/products?country_iso_code=${iso3}&per_page=50`,
    { headers: authHeader() }
  )
  if (!res.ok) throw new Error(`DT One error: ${res.status}`)
  return res.json()
}

export async function getOperators(countryCode: string) {
  const res = await fetch(
    `${DTONE_BASE}/operators?country_iso_code=${countryCode}&per_page=50`,
    { headers: authHeader() }
  )
  if (!res.ok) throw new Error(`DT One error: ${res.status}`)
  return res.json()
}

export async function createTransaction(data: {
  product_id: number
  credit_party_mobile_number: string
  auto_confirm: boolean
  external_id: string
}) {
  const res = await fetch(`${DTONE_BASE}/transactions`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(JSON.stringify(err))
  }
  return res.json()
}

export async function confirmTransaction(transactionId: number) {
  const res = await fetch(`${DTONE_BASE}/transactions/${transactionId}/confirm`, {
    method: 'POST',
    headers: authHeader()
  })
  if (!res.ok) throw new Error(`DT One confirm error: ${res.status}`)
  return res.json()
}
