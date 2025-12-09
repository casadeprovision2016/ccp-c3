import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'
import { nanoid } from 'nanoid'

type VisitorInsertPayload = {
  full_name?: string
  email?: string | null
  phone?: string | null
  visit_date?: string
  source?: string | null
  interested_in?: string[] | null
  notes?: string | null
  followed_up?: boolean
  follow_up_needed?: boolean
}

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await getDB()
  const { results } = await db
    .prepare('SELECT * FROM visitors ORDER BY visit_date DESC')
    .all()

  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = (await request.json()) as VisitorInsertPayload
  const db = await getDB()

  const id = nanoid()
  const now = new Date().toISOString()

  await db
    .prepare(`
      INSERT INTO visitors (
        id, full_name, email, phone, visit_date, source, 
        interested_in, notes, followed_up, follow_up_needed, 
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      data.full_name,
      data.email || null,
      data.phone || null,
      data.visit_date,
      data.source || null,
      data.interested_in ? JSON.stringify(data.interested_in) : null,
      data.notes || null,
      data.followed_up ? 1 : 0,
      data.follow_up_needed ? 1 : 0,
      now,
      now
    )
    .run()

  return NextResponse.json({ id })
}
