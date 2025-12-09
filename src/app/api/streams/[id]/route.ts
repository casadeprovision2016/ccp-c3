import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

type StreamUpdatePayload = {
  title?: string
  description?: string | null
  stream_url?: string
  platform?: string | null
  scheduled_date?: string
  status?: string | null
  thumbnail_url?: string | null
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
  const data = (await request.json()) as StreamUpdatePayload
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
  if (data.stream_url !== undefined) {
    updates.push('stream_url = ?')
    values.push(data.stream_url)
  }
  if (data.platform !== undefined) {
    updates.push('platform = ?')
    values.push(data.platform)
  }
  if (data.scheduled_date !== undefined) {
    updates.push('scheduled_date = ?')
    values.push(data.scheduled_date)
  }
  if (data.status !== undefined) {
    updates.push('status = ?')
    values.push(data.status)
  }
  if (data.thumbnail_url !== undefined) {
    updates.push('thumbnail_url = ?')
    values.push(data.thumbnail_url)
  }

  updates.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  await db
    .prepare(`UPDATE streams SET ${updates.join(', ')} WHERE id = ?`)
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

  await db.prepare('DELETE FROM streams WHERE id = ?').bind(id).run()

  return NextResponse.json({ success: true })
}
