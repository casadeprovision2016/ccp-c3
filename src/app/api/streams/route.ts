import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { nanoid } from 'nanoid'

// Public endpoint - no auth required
export async function GET() {
  const db = await getDB()
  const { results } = await db
    .prepare(`
      SELECT * FROM streams
      ORDER BY scheduled_date ASC
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
      INSERT INTO streams (
        id, title, description, stream_url, platform, 
        scheduled_date, status, thumbnail_url, created_by, 
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      data.title,
      data.description || null,
      data.stream_url,
      data.platform || null,
      data.scheduled_date,
      data.status || 'scheduled',
      data.thumbnail_url || null,
      data.created_by || null,
      now,
      now
    )
    .run()

  return NextResponse.json({ id })
}
