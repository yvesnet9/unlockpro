import { query, queryOne } from '@/lib/db'

export interface UnlockRequest {
  imei: string
  brand: string
  carrier: string
  country: string
  serviceId: number
}

export interface UnlockResult {
  success: boolean
  providerOrderId?: string
  code?: string
  error?: string
  providerId?: number
}

interface ProviderAdapter {
  name: string
  submit(req: UnlockRequest, apiKey: string, apiUrl: string): Promise<UnlockResult>
  poll?(providerOrderId: string, apiKey: string, apiUrl: string): Promise<{ success: boolean; code?: string; error?: string }>
}

const unlockBase: ProviderAdapter = {
  name: 'unlockbase',
  async submit({ imei, brand, carrier }, apiKey, apiUrl) {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        Action: 'PlaceOrder',
        Key: apiKey,
        IMEI: imei,
        ServiceID: '1',
      }).toString(),
    })
    const text = await res.text()
    const orderIdMatch = text.match(/<OrderID>(.*?)<\/OrderID>/)
    const errorMatch = text.match(/<Error>(.*?)<\/Error>/)
    if (errorMatch) return { success: false, error: errorMatch[1] }
    if (!orderIdMatch) return { success: false, error: 'No order ID returned' }
    return { success: true, providerOrderId: orderIdMatch[1] }
  },
  async poll(providerOrderId, apiKey, apiUrl) {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        Action: 'CheckOrder',
        Key: apiKey,
        OrderID: providerOrderId,
      }).toString(),
    })
    const text = await res.text()
    const codeMatch = text.match(/<UnlockCode>(.*?)<\/UnlockCode>/)
    const statusMatch = text.match(/<Status>(.*?)<\/Status>/)
    const errorMatch = text.match(/<Error>(.*?)<\/Error>/)
    if (errorMatch) return { success: false, error: errorMatch[1] }
    if (codeMatch) return { success: true, code: codeMatch[1] }
    if (statusMatch?.[1] === 'Failed') return { success: false, error: 'Order failed' }
    return { success: false }
  },
}

export const adapters: Record<string, ProviderAdapter> = {
  unlockbase: unlockBase,
}



interface DBProvider {
  id: number
  name: string
  api_url: string
  api_key: string
  priority: number
}

export async function submitUnlockOrder(req: UnlockRequest): Promise<{
  providerId: number
  providerOrderId: string
  code?: string
}> {
  const providers = await query<DBProvider>(
    `SELECT id, name, api_url, api_key, priority FROM providers WHERE active = TRUE ORDER BY priority ASC`
  )

  for (const provider of providers) {
    const adapter = adapters[provider.name]
    if (!adapter) continue
    try {
      const result = await adapter.submit(req, provider.api_key, provider.api_url)
      if (result.success && result.providerOrderId) {
        return {
          providerId: provider.id,
          providerOrderId: result.providerOrderId,
          code: result.code,
        }
      }
    } catch (err: any) {
      console.error(`[provider:${provider.name}] submit failed:`, err.message)
    }
  }
  throw new Error('Tous les fournisseurs ont echoue. Reessaie dans quelques minutes.')
}
