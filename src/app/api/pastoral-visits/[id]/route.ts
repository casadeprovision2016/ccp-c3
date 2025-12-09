import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

type PastoralVisitUpdatePayload = {
  member_id?: string | null
  visitor_id?: string | null
  visit_date?: string
  visit_type?: string | null
  pastor_id?: string | null
  notes?: string | null
  follow_up_needed?: boolean
  status?: string | null
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
  const data = (await request.json()) as PastoralVisitUpdatePayload
  const db = await getDB()

  const updates: string[] = []
  const values: unknown[] = []

  if (data.member_id !== undefined) {
    updates.push('member_id = ?')
    values.push(data.member_id)
  }
  if (data.visitor_id !== undefined) {
    updates.push('visitor_id = ?')
    values.push(data.visitor_id)
  }
  if (data.visit_date !== undefined) {
    updates.push('visit_date = ?')
    values.push(data.visit_date)
  }
  if (data.visit_type !== undefined) {
    updates.push('visit_type = ?')
    values.push(data.visit_type)
  }
  if (data.pastor_id !== undefined) {
    updates.push('pastor_id = ?')
    values.push(data.pastor_id)
  }
  if (data.notes !== undefined) {
    updates.push('notes = ?')
    values.push(data.notes)
  }
  if (data.follow_up_needed !== undefined) {
    updates.push('follow_up_needed = ?')
    values.push(data.follow_up_needed ? 1 : 0)
  }
  if (data.status !== undefined) {
    updates.push('status = ?')
    values.push(data.status)
  }

  updates.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  await db
    .prepare(`UPDATE pastoral_visits SET ${updates.join(', ')} WHERE id = ?`)
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

  await db.prepare('DELETE FROM pastoral_visits WHERE id = ?').bind(id).run()

  return NextResponse.json({ success: true })
}
