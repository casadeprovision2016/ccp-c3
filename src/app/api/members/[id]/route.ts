import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

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
    .prepare('SELECT * FROM members WHERE id = ?')
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
  const data = await request.json()
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
  if (data.address !== undefined) {
    updates.push('address = ?')
    values.push(data.address)
  }
  if (data.birth_date !== undefined) {
    updates.push('birth_date = ?')
    values.push(data.birth_date)
  }
  if (data.baptism_date !== undefined) {
    updates.push('baptism_date = ?')
    values.push(data.baptism_date)
  }
  if (data.membership_date !== undefined) {
    updates.push('membership_date = ?')
    values.push(data.membership_date)
  }
  if (data.status !== undefined) {
    updates.push('status = ?')
    values.push(data.status)
  }
  if (data.notes !== undefined) {
    updates.push('notes = ?')
    values.push(data.notes)
  }

  updates.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  await db
    .prepare(`UPDATE members SET ${updates.join(', ')} WHERE id = ?`)
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

  await db.prepare('DELETE FROM members WHERE id = ?').bind(id).run()

  return NextResponse.json({ success: true })
}
