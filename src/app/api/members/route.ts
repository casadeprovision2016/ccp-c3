import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'
import { nanoid } from 'nanoid'

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await getDB()
  const { results } = await db
    .prepare('SELECT * FROM members ORDER BY full_name ASC')
    .all()

  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const db = await getDB()

  const id = nanoid()
  const now = new Date().toISOString()

  await db
    .prepare(`
      INSERT INTO members (
        id, full_name, email, phone, address, birth_date, 
        baptism_date, membership_date, status, notes, 
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      data.full_name,
      data.email || null,
      data.phone || null,
      data.address || null,
      data.birth_date || null,
      data.baptism_date || null,
      data.membership_date || null,
      data.status || 'active',
      data.notes || null,
      now,
      now
    )
    .run()

  return NextResponse.json({ id })
}
