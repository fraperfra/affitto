'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenziali non valide. Riprova.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-anthracite mb-1">Area Riservata</h1>
          <p className="font-sans text-sm text-text-secondary">Dashboard Admin</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-anthracite mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            />
          </div>
          <div>
            <label className="block font-sans text-sm font-medium text-anthracite mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 font-sans text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 disabled:opacity-60 text-white font-sans font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Accesso...</>
            ) : (
              'Accedi'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
