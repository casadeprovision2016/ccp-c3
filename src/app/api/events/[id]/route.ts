import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

type EventUpdatePayload = {
  title?: string
  description?: string | null
  event_date?: string
  end_date?: string | null
  location?: string | null
  event_type?: string | null
  image_url?: string | null
  status?: string
  follow_up_needed?: boolean
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const data = (await request.json()) as EventUpdatePayload
  const db = await getDB()

  const updates: string[] = []
  const values: unknown[] = []

  if (data.title !== undefined) {
    updates.push('title = ?')
    values.push(data.title)
  }
  if (data.description !== undefined) {
    updates.push('description = ?')
    values.push(data.description)
  }
  if (data.event_date !== undefined) {
    updates.push('event_date = ?')
    values.push(data.event_date)
  }
  if (data.end_date !== undefined) {
    updates.push('end_date = ?')
    values.push(data.end_date)
  }
  if (data.location !== undefined) {
    updates.push('location = ?')
    values.push(data.location)
  }
  if (data.event_type !== undefined) {
    updates.push('event_type = ?')
    values.push(data.event_type)
  }
  if (data.image_url !== undefined) {
    updates.push('image_url = ?')
    values.push(data.image_url)
  }
  if (data.status !== undefined) {
    updates.push('status = ?')
    values.push(data.status)
  }
  if (data.follow_up_needed !== undefined) {
    updates.push('follow_up_needed = ?')
    values.push(data.follow_up_needed ? 1 : 0)
  }

  updates.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  await db
    .prepare(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run()

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = await getDB()

  await db.prepare('DELETE FROM events WHERE id = ?').bind(id).run()

  return NextResponse.json({ success: true })
}
