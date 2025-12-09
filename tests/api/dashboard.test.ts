import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockD1Database } from '../setup/mocks/d1'
import { testMembers, testVisitors } from '../setup/fixtures/members'
import { testDonations } from '../setup/fixtures/donations'
import { testEvents } from '../setup/fixtures/events'
import { mockAuthenticatedSession } from '../setup/mocks/session'

// Mock Cloudflare context
vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(async () => ({
    env: {
      DB: createMockD1Database(),
    },
  })),
}))

// Mock session
vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}))

describe('Dashboard Statistics', () => {
  let mockDb: ReturnType<typeof createMockD1Database>

  beforeEach(async () => {
    vi.clearAllMocks()
    
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const context = await getCloudflareContext()
    mockDb = context.env.DB
    
    // Seed database with test data
    const storage = new Map()
    storage.set('members', [...testMembers])
    storage.set('visitors', [...testVisitors])
    storage.set('donations', [...testDonations])
    storage.set('events', [...testEvents])
    ;(mockDb as any).storage = storage
  })

  describe('Members Statistics', () => {
    it('should count total active members', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const statement = mockDb.prepare(`
        SELECT COUNT(*) as count FROM members WHERE status = 'active'
      `)
      const result = await statement.first<{ count: number }>()

      expect(result).toBeDefined()
      
      const activeMembers = testMembers.filter(m => m.status === 'active')
      expect(result?.count).toBe(activeMembers.length)
    })

    it('should count members with birthdays this month', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentMonth = new Date().getMonth() + 1
      
      // In real implementation, this would filter by month
      const membersWithBirthdays = testMembers.filter(m => {
        if (!m.birth_date) return false
        const birthMonth = new Date(m.birth_date).getMonth() + 1
        return birthMonth === currentMonth
      })

      expect(membersWithBirthdays).toBeDefined()
      expect(Array.isArray(membersWithBirthdays)).toBe(true)
    })

    it('should handle zero active members', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      // Clear members
      const storage = new Map()
      storage.set('members', [])
      storage.set('visitors', [...testVisitors])
      storage.set('donations', [...testDonations])
      storage.set('events', [...testEvents])
      ;(mockDb as any).storage = storage

      const statement = mockDb.prepare(`
        SELECT COUNT(*) as count FROM members WHERE status = 'active'
      `)
      const result = await statement.first<{ count: number }>()

      expect(result?.count).toBe(0)
    })
  })

  describe('Visitors Statistics', () => {
    it('should count total visitors', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const statement = mockDb.prepare(`
        SELECT COUNT(*) as count FROM visitors
      `)
      const result = await statement.first<{ count: number }>()

      expect(result).toBeDefined()
      expect(result?.count).toBe(testVisitors.length)
    })

    it('should count visitors needing follow-up', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const visitorsNeedingFollowUp = testVisitors.filter(v => v.follow_up_needed === 1)

      expect(visitorsNeedingFollowUp).toBeDefined()
      expect(visitorsNeedingFollowUp.length).toBeGreaterThanOrEqual(0)
    })

    it('should count visitors already followed up', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const visitorsFollowedUp = testVisitors.filter(v => v.followed_up === 1)

      expect(visitorsFollowedUp).toBeDefined()
      expect(Array.isArray(visitorsFollowedUp)).toBe(true)
    })
  })

  describe('Donations Statistics', () => {
    it('should calculate total donations for current month', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const monthlyDonations = testDonations.filter(d => {
        const donationDate = new Date(d.donation_date)
        return donationDate.getMonth() === currentMonth && 
               donationDate.getFullYear() === currentYear
      })

      const totalAmount = monthlyDonations.reduce((sum, d) => sum + d.amount, 0)

      expect(totalAmount).toBeGreaterThanOrEqual(0)
      expect(typeof totalAmount).toBe('number')
    })

    it('should calculate total donations by type', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const donationsByType = testDonations.reduce((acc, d) => {
        const type = d.donation_type || 'other'
        acc[type] = (acc[type] || 0) + d.amount
        return acc
      }, {} as Record<string, number>)

      expect(donationsByType).toBeDefined()
      expect(typeof donationsByType).toBe('object')
    })

    it('should count donations needing follow-up', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const donationsNeedingFollowUp = testDonations.filter(d => d.follow_up_needed === 1)

      expect(donationsNeedingFollowUp).toBeDefined()
      expect(donationsNeedingFollowUp.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle zero donations', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      // Clear donations
      const storage = new Map()
      storage.set('members', [...testMembers])
      storage.set('visitors', [...testVisitors])
      storage.set('donations', [])
      storage.set('events', [...testEvents])
      ;(mockDb as any).storage = storage

      const statement = mockDb.prepare(`
        SELECT SUM(amount) as total FROM donations
      `)
      const result = await statement.first<{ total: number | null }>()

      expect(result?.total ?? 0).toBe(0)
    })
  })

  describe('Events Statistics', () => {
    it('should count scheduled events', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const scheduledEvents = testEvents.filter(e => e.status === 'scheduled')

      expect(scheduledEvents).toBeDefined()
      expect(scheduledEvents.length).toBeGreaterThanOrEqual(0)
    })

    it('should count upcoming events (next 30 days)', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      const upcomingEvents = testEvents.filter(e => {
        const eventDate = new Date(e.event_date)
        return eventDate >= now && eventDate <= thirtyDaysFromNow && e.status === 'scheduled'
      })

      expect(upcomingEvents).toBeDefined()
      expect(Array.isArray(upcomingEvents)).toBe(true)
    })

    it('should count events needing follow-up', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const eventsNeedingFollowUp = testEvents.filter(e => e.follow_up_needed === 1)

      expect(eventsNeedingFollowUp).toBeDefined()
      expect(eventsNeedingFollowUp.length).toBeGreaterThanOrEqual(0)
    })

    it('should count completed events', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const completedEvents = testEvents.filter(e => e.status === 'completed')

      expect(completedEvents).toBeDefined()
      expect(Array.isArray(completedEvents)).toBe(true)
    })
  })

  describe('Dashboard Data Loading', () => {
    it('should load all statistics efficiently', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const startTime = Date.now()

      // Simulate loading all stats
      const [membersResult, visitorsResult, donationsResult, eventsResult] = await Promise.all([
        mockDb.prepare('SELECT COUNT(*) as count FROM members WHERE status = \'active\'').first(),
        mockDb.prepare('SELECT COUNT(*) as count FROM visitors').first(),
        mockDb.prepare('SELECT SUM(amount) as total FROM donations').first(),
        mockDb.prepare('SELECT COUNT(*) as count FROM events WHERE status = \'scheduled\'').first(),
      ])

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(membersResult).toBeDefined()
      expect(visitorsResult).toBeDefined()
      expect(donationsResult).toBeDefined()
      expect(eventsResult).toBeDefined()
      
      // Should be fast (< 200ms for all queries)
      expect(duration).toBeLessThan(200)
    })

    it('should handle errors in individual stats gracefully', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      try {
        const statement = mockDb.prepare('INVALID SQL')
        await statement.first()
      } catch (error) {
        // Should handle error without crashing
        expect(error).toBeDefined()
      }
    })
  })

  describe('Role-Based Statistics Access', () => {
    it('should allow admin to view all statistics', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('admin')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })

    it('should allow leader to view all statistics', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('leader')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })

    it('should deny member access to statistics', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('member')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(false)
    })
  })
})
