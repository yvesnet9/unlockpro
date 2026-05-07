'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router     = useRouter()
  const params     = useSearchParams()
  const redirect   = params.get('redirect') ?? '/dashboard'
  const errorParam = params.get('error')

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(
    errorParam === 'forbidden' ? 'Accès non autorisé.' : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push(data.user.role === 'reseller' ? '/resellers/dashboard' : redirect)
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#0f0f0f', border: '1px solid #2a2a2a',
    borderRadius: '8px', padding: '13px 16px', color: '#f0ede8',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <a href="/" style={{ fontSize: '24px', fontWeight: 800, textDecoration: 'none', color: '#f0ede8' }}>
            Unlock<span style={{ color: '#a3ff6b' }}>Pro</span>
          </a>
          <p style={{ color: '#444', fontSize: '14px', margin: '8px 0 0' }}>Espace administration</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.04em' }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@unlockpro.fr" autoComplete="email"
              style={inp} required />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.04em' }}>MOT DE PASSE</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password"
              style={inp} required />
          </div>
          {error && (
            <div style={{ background: '#1a0808', border: '1px solid #3a1010', borderRadius: '8px', padding: '12px 14px', color: '#ff6b6b', fontSize: '13px' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ background: loading ? '#1a1a1a' : '#a3ff6b', color: loading ? '#444' : '#0a0a0a', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer', marginTop: '8px' }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #1a1a1a', paddingTop: '24px' }}>
          <a href="/resellers/register" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
            Vous êtes revendeur ? <span style={{ color: '#a3ff6b' }}>Créer un compte →</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
