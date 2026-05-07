import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: 'UnlockPro <onboarding@resend.dev>',
  to: 'yvesnet9@gmail.com',
  subject: 'Test UnlockPro',
  html: '<p>Test email fonctionne !</p>',
})

console.log('data:', data)
console.log('error:', error)
