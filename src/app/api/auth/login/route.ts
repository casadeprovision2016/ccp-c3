import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const db = await getDB()
  const user = await db
    .prepare('SELECT id, email, name, role, password_hash FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string; email: string; name: string; role: 'admin' | 'leader' | 'member'; password_hash: string }>()

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
}
