import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.toUpperCase()
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase()

  if (!id || !email) {
    return NextResponse.redirect(new URL('/suivi?error=missing', req.url))
  }

  const orders = await query(
    `SELECT id, status, service_name, created_at, unlock_code FROM orders WHERE (id::text ILIKE $1 OR id::text ILIKE $2) AND email = $3 LIMIT 1`,
    [`${id}%`, `%${id}%`, email]
  )

  if (!orders.length) {
    return NextResponse.redirect(new URL('/suivi?error=notfound', req.url))
  }

  const order = orders[0] as any
  const statusLabel: Record<string, string> = {
    pending: 'En attente',
    processing: 'En cours de traitement',
    completed: 'Terminé',
    failed: 'Échoué',
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Suivi commande — UnlockPro</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;background:#0a0a0a;color:#f0ede8;min-height:100vh}</style>
</head>
<body>
<nav style="padding:20px 48px;border-bottom:1px solid #1e1e1e;display:flex;justify-content:space-between;align-items:center">
  <a href="/" style="font-size:20px;font-weight:700;text-decoration:none;color:#f0ede8">Unlock<span style="color:#a3ff6b">Pro</span></a>
</nav>
<div style="max-width:600px;margin:0 auto;padding:80px 48px">
  <a href="/suivi" style="color:#a3ff6b;text-decoration:none;font-size:14px">← Retour</a>
  <h1 style="font-size:36px;font-weight:800;margin:24px 0 8px">Commande #${order.id.toString().slice(0,8).toUpperCase()}</h1>
  <p style="color:#888;margin-bottom:40px">Passée le ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
  <div style="background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:32px;margin-bottom:24px">
    <div style="display:flex;justify-content:space-between;margin-bottom:16px">
      <span style="color:#888">Service</span>
      <span style="font-weight:600">${order.service_name || 'Déblocage'}</span>
    </div>
    <div style="display:flex;justify-content:space-between">
      <span style="color:#888">Statut</span>
      <span style="color:${order.status === 'completed' ? '#a3ff6b' : order.status === 'failed' ? '#ff6b6b' : '#ffd700'};font-weight:700">${statusLabel[order.status] || order.status}</span>
    </div>
    ${order.unlock_code ? `<div style="margin-top:24px;background:#111b0a;border:1px solid #2a4a00;border-radius:8px;padding:16px;text-align:center"><p style="color:#888;font-size:12px;margin-bottom:8px">VOTRE CODE DE DÉBLOCAGE</p><p style="font-size:28px;font-weight:800;color:#a3ff6b;letter-spacing:4px">${order.unlock_code}</p></div>` : ''}
  </div>
  ${order.status === 'pending' || order.status === 'processing' ? '<p style="color:#888;font-size:14px;text-align:center">⏳ Votre code sera envoyé par email dès qu\'il sera prêt.</p>' : ''}
</div>
</body></html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
