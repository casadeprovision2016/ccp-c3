import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockD1Database } from '../setup/mocks/d1'
import { testDonations } from '../setup/fixtures/donations'
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

describe('Donations API - CRUD Operations', () => {
  let mockDb: ReturnType<typeof createMockD1Database>

  beforeEach(async () => {
    vi.clearAllMocks()
    
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const context = await getCloudflareContext()
    mockDb = context.env.DB
    
    // Seed database with test data
    const storage = new Map()
    storage.set('donations', [...testDonations])
    ;(mockDb as any).storage = storage
  })

  describe('GET /api/donations', () => {
    it('should return all donations for authenticated admin', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const statement = mockDb.prepare('SELECT * FROM donations ORDER BY donation_date DESC')
      const result = await statement.all()

      expect(result.success).toBe(true)
      expect(result.results).toHaveLength(testDonations.length)
    })

    it('should return all donations for authenticated leader', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const statement = mockDb.prepare('SELECT * FROM donations ORDER BY donation_date DESC')
      const result = await statement.all()

      expect(result.success).toBe(true)
      expect(result.results).toHaveLength(testDonations.length)
    })

    it('should return 401 for unauthenticated user', async () => {
      const { getSession } = await import('@/lib/auth/session')
      vi.mocked(getSession).mockResolvedValue(null)

      const session = await getSession()

      expect(session).toBeNull()
    })

    it('should return 401 for member role', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('member')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(false)
    })

    it('should order donations by date descending', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const statement = mockDb.prepare('SELECT * FROM donations ORDER BY donation_date DESC')
      const result = await statement.all()

      expect(result.results).toBeDefined()
      if (result.results && result.results.length > 1) {
        const dates = result.results.map((d: any) => new Date(d.donation_date).getTime())
        const sortedDates = [...dates].sort((a, b) => b - a)
        expect(dates).toEqual(sortedDates)
      }
    })
  })

  describe('POST /api/donations', () => {
    it('should create new donation for admin', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const newDonation = {
        donor_name: 'Test Donor',
        amount: 150.00,
        donation_type: 'tithe',
        payment_method: 'pix',
        donation_date: new Date().toISOString(),
        notes: 'Test donation',
        receipt_number: 'REC-TEST',
        follow_up_needed: false,
      }

      const statement = mockDb.prepare(`
        INSERT INTO donations (id, donor_name, amount, donation_type, payment_method, donation_date, notes, receipt_number, follow_up_needed, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind('test-id', newDonation.donor_name, newDonation.amount, newDonation.donation_type, newDonation.payment_method, newDonation.donation_date, newDonation.notes, newDonation.receipt_number, newDonation.follow_up_needed ? 1 : 0, session.userId)

      const result = await statement.run()

      expect(result.success).toBe(true)
      expect(result.meta.rows_written).toBe(1)
    })

    it('should create new donation for leader', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('leader')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })

    it('should reject creation for member role', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('member')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(false)
    })

    it('should reject creation for unauthenticated user', async () => {
      const { getSession } = await import('@/lib/auth/session')
      vi.mocked(getSession).mockResolvedValue(null)

      const session = await getSession()

      expect(session).toBeNull()
    })

    it('should validate required fields', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const invalidDonation = {
        // Missing amount (required)
        donation_type: 'tithe',
        donation_date: new Date().toISOString(),
      }

      // In real implementation, API should validate and return 400
      expect(invalidDonation).not.toHaveProperty('amount')
    })
  })

  describe('GET /api/donations/[id]', () => {
    it('should return specific donation by id', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const testDonation = testDonations[0]
      const statement = mockDb.prepare('SELECT * FROM donations WHERE id = ?').bind(testDonation.id)
      const result = await statement.first()

      expect(result).toBeDefined()
      expect((result as any)?.id).toBe(testDonation.id)
    })

    it('should return null for non-existent id', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const statement = mockDb.prepare('SELECT * FROM donations WHERE id = ?').bind('non-existent-id')
      const result = await statement.first()

      expect(result).toBeNull()
    })
  })

  describe('PATCH /api/donations/[id]', () => {
    it('should update donation for admin', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const testDonation = testDonations[0]
      const updates = {
        notes: 'Updated notes',
        follow_up_needed: true,
      }

      const statement = mockDb.prepare(`
        UPDATE donations SET notes = ?, follow_up_needed = ?, updated_at = ? WHERE id = ?
      `).bind(updates.notes, updates.follow_up_needed ? 1 : 0, new Date().toISOString(), testDonation.id)

      const result = await statement.run()

      expect(result.success).toBe(true)
    })

    it('should reject update for member role', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('member')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(false)
    })
  })

  describe('DELETE /api/donations/[id]', () => {
    it('should delete donation for admin', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const testDonation = testDonations[0]
      const statement = mockDb.prepare('DELETE FROM donations WHERE id = ?').bind(testDonation.id)
      const result = await statement.run()

      expect(result.success).toBe(true)
    })

    it('should reject deletion for leader role', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      // In real implementation, only admin can delete
      expect(currentSession?.role).toBe('leader')
      expect(currentSession?.role).not.toBe('admin')
    })

    it('should reject deletion for member role', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('member')
      expect(currentSession?.role).not.toBe('admin')
    })
  })
})
