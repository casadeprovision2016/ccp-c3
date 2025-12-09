import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'
import { nanoid } from 'nanoid'

type MinistryInsertPayload = {
  name?: string
  description?: string | null
  leader_id?: string | null
  meeting_schedule?: string | null
  status?: string | null
}

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await getDB()
  const { results } = await db
    .prepare('SELECT * FROM ministries ORDER BY name ASC')
    .all()

  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = (await request.json()) as MinistryInsertPayload
  const db = await getDB()

  const id = nanoid()
  const now = new Date().toISOString()

  await db
    .prepare(`
      INSERT INTO ministries (
        id, name, description, leader_id, meeting_schedule, 
        status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      data.name,
      data.description || null,
      data.leader_id || null,
      data.meeting_schedule || null,
      data.status || 'active',
      now,
      now
    )
    .run()

  return NextResponse.json({ id })
}
