import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

type VisitorUpdatePayload = {
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = await getDB()
  const result = await db
    .prepare('SELECT * FROM visitors WHERE id = ?')
    .bind(id)
    .first()

  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(result)
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
  const data = (await request.json()) as VisitorUpdatePayload
  const db = await getDB()

  const updates: string[] = []
  const values: unknown[] = []

  if (data.full_name !== undefined) {
    updates.push('full_name = ?')
    values.push(data.full_name)
  }
  if (data.email !== undefined) {
    updates.push('email = ?')
    values.push(data.email)
  }
  if (data.phone !== undefined) {
    updates.push('phone = ?')
    values.push(data.phone)
  }
  if (data.visit_date !== undefined) {
    updates.push('visit_date = ?')
    values.push(data.visit_date)
  }
  if (data.source !== undefined) {
    updates.push('source = ?')
    values.push(data.source)
  }
  if (data.interested_in !== undefined) {
    updates.push('interested_in = ?')
    values.push(JSON.stringify(data.interested_in))
  }
  if (data.notes !== undefined) {
    updates.push('notes = ?')
    values.push(data.notes)
  }
  if (data.followed_up !== undefined) {
    updates.push('followed_up = ?')
    values.push(data.followed_up ? 1 : 0)
  }
  if (data.follow_up_needed !== undefined) {
    updates.push('follow_up_needed = ?')
    values.push(data.follow_up_needed ? 1 : 0)
  }

  updates.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  await db
    .prepare(`UPDATE visitors SET ${updates.join(', ')} WHERE id = ?`)
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

  await db.prepare('DELETE FROM visitors WHERE id = ?').bind(id).run()

  return NextResponse.json({ success: true })
}
