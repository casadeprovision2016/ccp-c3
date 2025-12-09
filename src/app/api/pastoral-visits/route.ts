import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'
import { nanoid } from 'nanoid'

type PastoralVisitInsertPayload = {
  member_id?: string | null
  visitor_id?: string | null
  visit_date?: string
  visit_type?: string | null
  pastor_id?: string | null
  notes?: string | null
  follow_up_needed?: boolean
  status?: string | null
}

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await getDB()
  const { results } = await db
    .prepare('SELECT * FROM pastoral_visits ORDER BY visit_date DESC')
    .all()

  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = (await request.json()) as PastoralVisitInsertPayload
  const db = await getDB()

  const id = nanoid()
  const now = new Date().toISOString()

  await db
    .prepare(`
      INSERT INTO pastoral_visits (
        id, member_id, visitor_id, visit_date, visit_type, 
        pastor_id, notes, follow_up_needed, status, 
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      data.member_id || null,
      data.visitor_id || null,
      data.visit_date,
      data.visit_type || null,
      data.pastor_id || session.userId,
      data.notes || null,
      data.follow_up_needed ? 1 : 0,
      data.status || 'scheduled',
      now,
      now
    )
    .run()

  return NextResponse.json({ id })
}
