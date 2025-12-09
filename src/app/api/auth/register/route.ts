import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { hashPassword } from '@/lib/auth/password'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  const { email, password, name, role } = await request.json()

  if (!email || !password || !name || !role) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const db = await getDB()

  // Check if user already exists
  const existing = await db
    .prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first()

  if (existing) {
    return NextResponse.json(
      { error: 'User already exists' },
      { status: 400 }
    )
  }

  const id = nanoid()
  const passwordHash = await hashPassword(password)
  const now = new Date().toISOString()

  await db
    .prepare(`
      INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(id, email, passwordHash, name, role, now, now)
    .run()

  return NextResponse.json({ 
    id,
    email,
    name,
    role
  })
}
