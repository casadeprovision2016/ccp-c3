import { NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }

  const db = await getDB()
  const user = await db
    .prepare('SELECT id, email, name, role FROM users WHERE id = ?')
    .bind(session.userId)
    .first<{ id: string; email: string; name: string; role: 'admin' | 'leader' | 'member' }>()

  return NextResponse.json({ user: user ?? null })
}
