import { Resend } from 'resend'
import { queryOne } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'UnlockPro <noreply@unlockpro.fr>'

export async function sendCodeEmail(orderId: string) {
  const order = await queryOne<any>(
    `SELECT o.email, o.unlock_code, o.imei, s.name as service_name
     FROM orders o JOIN services s ON s.id = o.service_id
     WHERE o.id = $1`,
    [orderId]
  )
  if (!order || !order.unlock_code) return

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: '🔓 Votre code de déblocage est prêt !',
    html: emailTemplate({
      title: 'Votre code est arrivé',
      body: `
        <p>Bonjour,</p>
        <p>Votre commande <strong>${order.service_name}</strong> est terminée.</p>
        <div style="background:#f4f4f0;border-radius:8px;padding:20px;text-align:center;margin:24px 0">
          <p style="color:#666;font-size:14px;margin:0 0 8px">Code de déblocage</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:4px;color:#111;margin:0">${order.unlock_code}</p>
        </div>
        <p style="color:#666;font-size:14px">IMEI : ${order.imei}</p>
        <p>Entrez ce code sur votre téléphone quand il vous le demande après insertion d'une SIM d'un autre opérateur.</p>
      `,
    }),
  })
}

export async function sendOrderConfirmationEmail(orderId: string) {
  const order = await queryOne<any>(
    `SELECT o.email, o.id, o.amount, o.imei, s.name as service_name, s.eta_hours
     FROM orders o JOIN services s ON s.id = o.service_id
     WHERE o.id = $1`,
    [orderId]
  )
  if (!order) return

  const shortId = order.id.split('-')[0].toUpperCase()

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Commande confirmée #${shortId} — ${order.service_name}`,
    html: emailTemplate({
      title: 'Commande confirmée',
      body: `
        <p>Merci pour votre commande !</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Référence</td><td style="font-weight:600">#${shortId}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Service</td><td>${order.service_name}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">IMEI</td><td>${order.imei}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Montant</td><td>${Number(order.amount).toFixed(2)} €</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Délai estimé</td><td>${order.eta_hours}h maximum</td></tr>
        </table>
        <p>Vous recevrez votre code dès qu'il sera prêt.</p>
      `,
    }),
  })
}

export async function sendAdminAlert(orderId: string, message: string) {
  await resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL!,
    subject: `⚠️ Alerte commande ${orderId}`,
    html: emailTemplate({
      title: 'Alerte admin',
      body: `<p>Commande : <strong>${orderId}</strong></p><p>${message}</p>`,
    }),
  })
}

function emailTemplate({ title, body }: { title: string; body: string }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>body{font-family:sans-serif;color:#111;margin:0;background:#f9f9f7}
.wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden}
.header{background:#111;color:#fff;padding:28px 32px}
.header h1{margin:0;font-size:20px;font-weight:600}
.content{padding:32px}
.footer{padding:20px 32px;background:#f4f4f0;color:#888;font-size:12px}
</style></head>
<body><div class="wrap">
  <div class="header"><h1>UnlockPro — ${title}</h1></div>
  <div class="content">${body}</div>
  <div class="footer">
    UnlockPro · unlockpro.fr · Support : support@unlockpro.fr<br>
    Ce message est automatique, merci de ne pas y répondre directement.
  </div>
</div></body></html>`
}
