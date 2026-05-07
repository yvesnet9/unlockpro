import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { queryOne } from '@/lib/db'
import {
  verifyPassword,
  createSession,
  deleteSession,
  getSession,
  setSessionCookie,
  clearSessionCookie,
} from '@/lib/auth'

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email ou mot de passe invalide.' }, { status: 400 })
  }
  const { email, password } = parsed.data
  const user = await queryOne<{ id: string; password: string; role: string; name: string }>(
    `SELECT id, password, role, name FROM users WHERE email = $1`,
    [email]
  )
  if (!user || !user.password || !verifyPassword(password, user.password)) {
    await new Promise(r => setTimeout(r, 300))
    return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
  }
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const ua = req.headers.get('user-agent') ?? ''
  const sessionId = await createSession(user.id, ip, ua)
  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, role: user.role },
  })
  return setSessionCookie(res, sessionId)
}

export async function DELETE() {
  await deleteSession()
  const res = NextResponse.json({ ok: true })
  return clearSessionCookie(res)
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null }, { status: 401 })
  const user = await queryOne<{ id: string; name: string; email: string; role: string }>(
    `SELECT id, name, email, role FROM users WHERE id = $1`,
    [session.userId]
  )
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user })
}
