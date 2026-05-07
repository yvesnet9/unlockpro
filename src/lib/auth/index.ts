import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { createHash, randomBytes, timingSafeEqual } from 'crypto'

const SESSION_COOKIE = 'up_session'
const SESSION_TTL    = 7 * 24 * 60 * 60 * 1000

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(salt + password).digest('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const attempt = createHash('sha256').update(salt + password).digest('hex')
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(attempt, 'hex'))
}

export async function createSession(userId: string, ip: string, userAgent: string): Promise<string> {
  const sessionId = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL)
  await query(
    `INSERT INTO sessions (id, user_id, expires_at, ip, user_agent) VALUES ($1,$2,$3,$4,$5)`,
    [sessionId, userId, expiresAt, ip, userAgent]
  )
  return sessionId
}

export async function getSession(): Promise<{ userId: string; role: string } | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionId) return null
  const session = await queryOne<{ user_id: string; expires_at: Date; role: string }>(
    `SELECT s.user_id, s.expires_at, u.role
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  )
  if (!session) return null
  return { userId: session.user_id, role: session.role }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionId) return
  await query(`DELETE FROM sessions WHERE id = $1`, [sessionId])
}

export function setSessionCookie(res: NextResponse, sessionId: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL / 1000,
    path: '/',
  })
  return res
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.delete(SESSION_COOKIE)
  return res
}

export async function requireAuth(
  req: NextRequest,
  role: 'admin' | 'customer' | 'reseller' = 'customer'
): Promise<{ userId: string; role: string } | NextResponse> {
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value
  if (!sessionId) return redirectToLogin(req)
  const session = await queryOne<{ user_id: string; expires_at: Date; role: string }>(
    `SELECT s.user_id, s.expires_at, u.role
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  )
  if (!session) return redirectToLogin(req)
  if (role === 'admin' && session.role !== 'admin') {
    return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
  }
  return { userId: session.user_id, role: session.role }
}

function redirectToLogin(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone()
  url.pathname = '/auth/login'
  url.searchParams.set('redirect', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}
