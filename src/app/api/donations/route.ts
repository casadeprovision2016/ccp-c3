import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'
import { nanoid } from 'nanoid'

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await getDB()
  const { results } = await db
    .prepare('SELECT * FROM donations ORDER BY donation_date DESC')
    .all()

  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const db = await getDB()

  const id = nanoid()
  const now = new Date().toISOString()
  
  await db
    .prepare(`
      INSERT INTO donations (
        id, donor_name, amount, donation_type, payment_method, 
        donation_date, notes, receipt_number, follow_up_needed, 
        created_by, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      data.donor_name || null,
      data.amount,
      data.donation_type || null,
      data.payment_method || null,
      data.donation_date,
      data.notes || null,
      data.receipt_number || null,
      data.follow_up_needed ? 1 : 0,
      session.userId,
      now,
      now
    )
    .run()

  return NextResponse.json({ id })
}
