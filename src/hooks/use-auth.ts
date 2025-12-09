'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'leader' | 'member'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      return { error: 'Invalid credentials' }
    }

    await loadUser()
    return { error: null }
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    profile: user, // compatibility
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLeader: user?.role === 'leader',
  }
}
