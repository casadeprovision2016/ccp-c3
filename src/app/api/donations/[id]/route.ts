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
    .prepare('SELECT * FROM donations WHERE id = ?')
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

  if (data.donor_name !== undefined) {
    updates.push('donor_name = ?')
    values.push(data.donor_name)
  }
  if (data.amount !== undefined) {
    updates.push('amount = ?')
    values.push(data.amount)
  }
  if (data.donation_type !== undefined) {
    updates.push('donation_type = ?')
    values.push(data.donation_type)
  }
  if (data.payment_method !== undefined) {
    updates.push('payment_method = ?')
    values.push(data.payment_method)
  }
  if (data.donation_date !== undefined) {
    updates.push('donation_date = ?')
    values.push(data.donation_date)
  }
  if (data.notes !== undefined) {
    updates.push('notes = ?')
    values.push(data.notes)
  }
  if (data.receipt_number !== undefined) {
    updates.push('receipt_number = ?')
    values.push(data.receipt_number)
  }
  if (data.follow_up_needed !== undefined) {
    updates.push('follow_up_needed = ?')
    values.push(data.follow_up_needed ? 1 : 0)
  }

  updates.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  await db
    .prepare(`UPDATE donations SET ${updates.join(', ')} WHERE id = ?`)
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

  await db.prepare('DELETE FROM donations WHERE id = ?').bind(id).run()

  return NextResponse.json({ success: true })
}
