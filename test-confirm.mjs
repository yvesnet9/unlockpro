import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: 'UnlockPro <onboarding@resend.dev>',
  to: 'yvesnet9@gmail.com',
  subject: 'Commande confirmée #A3D61C2B — iPhone SFR France',
  html: '<p>Commande confirmée ! Votre code arrivera sous 48h.</p>',
})

console.log('data:', data)
console.log('error:', error)
