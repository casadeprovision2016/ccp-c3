import { NextResponse } from 'next/server'
import { getDB } from '@/lib/db/client'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await getDB()
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Count events this month
  const eventsResult = await db
    .prepare(`
      SELECT COUNT(*) as count FROM events 
      WHERE event_date >= ? AND event_date <= ?
    `)
    .bind(firstDayOfMonth.toISOString(), lastDayOfMonth.toISOString())
    .first<{ count: number }>()

  // Count active members
  const membersResult = await db
    .prepare(`SELECT COUNT(*) as count FROM members WHERE status = 'active'`)
    .first<{ count: number }>()

  // Count visitors this month
  const visitorsResult = await db
    .prepare(`
      SELECT COUNT(*) as count FROM visitors 
      WHERE visit_date >= ? AND visit_date <= ?
    `)
    .bind(
      firstDayOfMonth.toISOString().split('T')[0],
      lastDayOfMonth.toISOString().split('T')[0]
    )
    .first<{ count: number }>()

  return NextResponse.json({
    eventsThisMonth: eventsResult?.count || 0,
    activeMembers: membersResult?.count || 0,
    visitorsThisMonth: visitorsResult?.count || 0,
  })
}
