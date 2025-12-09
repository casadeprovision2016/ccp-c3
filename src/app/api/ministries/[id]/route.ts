import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const data = await request.json()
  const db = await getDB()

  const updates: string[] = []
  const values: unknown[] = []

  if (data.name !== undefined) {
    updates.push('name = ?')
    values.push(data.name)
  }
  if (data.description !== undefined) {
    updates.push('description = ?')
    values.push(data.description)
  }
  if (data.leader_id !== undefined) {
    updates.push('leader_id = ?')
    values.push(data.leader_id)
  }
  if (data.meeting_schedule !== undefined) {
    updates.push('meeting_schedule = ?')
    values.push(data.meeting_schedule)
  }
  if (data.status !== undefined) {
    updates.push('status = ?')
    values.push(data.status)
  }

  updates.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  await db
    .prepare(`UPDATE ministries SET ${updates.join(', ')} WHERE id = ?`)
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

  await db.prepare('DELETE FROM ministries WHERE id = ?').bind(id).run()

  return NextResponse.json({ success: true })
}
