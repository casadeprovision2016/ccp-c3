import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { nanoid } from 'nanoid'

// Public endpoint - no auth required
export async function GET() {
  const db = await getDB()
  const { results } = await db
    .prepare(`
      SELECT * FROM events
      ORDER BY event_date ASC
    `)
    .all()

  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const db = await getDB()

  const id = nanoid()
  const now = new Date().toISOString()

  await db
    .prepare(`
      INSERT INTO events (
        id, title, description, event_date, end_date, location, 
        event_type, image_url, status, follow_up_needed, 
        created_by, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      data.title,
      data.description || null,
      data.event_date,
      data.end_date || null,
      data.location || null,
      data.event_type || null,
      data.image_url || null,
      data.status || 'scheduled',
      data.follow_up_needed ? 1 : 0,
      data.created_by || null,
      now,
      now
    )
    .run()

  return NextResponse.json({ id })
}
