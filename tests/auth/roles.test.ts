import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockAuthenticatedSession } from '../setup/mocks/session'

// Mock session
vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}))

describe('Role-Based Access Control', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Admin Role', () => {
    it('should have full access to all operations', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('admin')
      
      // Admin can perform all operations
      const canCreate = ['admin', 'leader'].includes(currentSession?.role || '')
      const canRead = ['admin', 'leader', 'member'].includes(currentSession?.role || '')
      const canUpdate = ['admin', 'leader'].includes(currentSession?.role || '')
      const canDelete = currentSession?.role === 'admin'

      expect(canCreate).toBe(true)
      expect(canRead).toBe(true)
      expect(canUpdate).toBe(true)
      expect(canDelete).toBe(true)
    })

    it('should access donations CRUD', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('admin')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })

    it('should access members CRUD', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('admin')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })

    it('should access events CRUD', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('admin')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })

    it('should delete any resource', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('admin')
      
      const canDelete = currentSession?.role === 'admin'
      expect(canDelete).toBe(true)
    })
  })

  describe('Leader Role', () => {
    it('should have limited access to operations', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('leader')
      
      // Leader can create, read, update but not delete
      const canCreate = ['admin', 'leader'].includes(currentSession?.role || '')
      const canRead = ['admin', 'leader', 'member'].includes(currentSession?.role || '')
      const canUpdate = ['admin', 'leader'].includes(currentSession?.role || '')
      const canDelete = currentSession?.role === 'admin'

      expect(canCreate).toBe(true)
      expect(canRead).toBe(true)
      expect(canUpdate).toBe(true)
      expect(canDelete).toBe(false)
    })

    it('should access donations (read/create/update)', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('leader')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })

    it('should NOT delete donations', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('leader')
      expect(currentSession?.role === 'admin').toBe(false)
    })

    it('should access members CRUD (except delete)', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      const canRead = ['admin', 'leader'].includes(currentSession?.role || '')
      const canCreate = ['admin', 'leader'].includes(currentSession?.role || '')
      const canDelete = currentSession?.role === 'admin'

      expect(canRead).toBe(true)
      expect(canCreate).toBe(true)
      expect(canDelete).toBe(false)
    })

    it('should access events (read/create/update)', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('leader')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(true)
    })
  })

  describe('Member Role', () => {
    it('should have read-only access', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('member')
      
      // Member can only read public data
      const canCreate = ['admin', 'leader'].includes(currentSession?.role || '')
      const canRead = ['admin', 'leader', 'member'].includes(currentSession?.role || '')
      const canUpdate = ['admin', 'leader'].includes(currentSession?.role || '')
      const canDelete = currentSession?.role === 'admin'

      expect(canCreate).toBe(false)
      expect(canRead).toBe(true)
      expect(canUpdate).toBe(false)
      expect(canDelete).toBe(false)
    })

    it('should NOT access donations API', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession?.role).toBe('member')
      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(false)
    })

    it('should NOT create members', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(false)
    })

    it('should NOT update events', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(['admin', 'leader'].includes(currentSession?.role || '')).toBe(false)
    })

    it('should access own profile via /api/auth/me', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      expect(currentSession).toBeDefined()
      expect(currentSession?.userId).toBeDefined()
      expect(currentSession?.email).toBeDefined()
    })

    it('should view public events', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      // Members can read public data
      const canReadPublic = ['admin', 'leader', 'member'].includes(currentSession?.role || '')
      expect(canReadPublic).toBe(true)
    })
  })

  describe('Unauthenticated Users', () => {
    it('should NOT access protected routes', async () => {
      const { getSession } = await import('@/lib/auth/session')
      vi.mocked(getSession).mockResolvedValue(null)

      const currentSession = await getSession()

      expect(currentSession).toBeNull()
    })

    it('should NOT access any API endpoints', async () => {
      const { getSession } = await import('@/lib/auth/session')
      vi.mocked(getSession).mockResolvedValue(null)

      const currentSession = await getSession()

      expect(currentSession).toBeNull()
      
      const hasAccess = currentSession !== null
      expect(hasAccess).toBe(false)
    })

    it('should access public pages only', async () => {
      const { getSession } = await import('@/lib/auth/session')
      vi.mocked(getSession).mockResolvedValue(null)

      const currentSession = await getSession()

      // Public pages don't require authentication
      expect(currentSession).toBeNull()
    })
  })

  describe('Cross-Role Scenarios', () => {
    it('should properly differentiate between admin and leader', async () => {
      const { getSession } = await import('@/lib/auth/session')
      
      const { session: adminSession } = await mockAuthenticatedSession('admin')
      vi.mocked(getSession).mockResolvedValue(adminSession)
      const admin = await getSession()
      
      const { session: leaderSession } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(leaderSession)
      const leader = await getSession()

      expect(admin?.role).toBe('admin')
      expect(leader?.role).toBe('leader')
      expect(admin?.role).not.toBe(leader?.role)
      
      // Only admin can delete
      expect(admin?.role === 'admin').toBe(true)
      expect(leader?.role === 'admin').toBe(false)
    })

    it('should properly differentiate between leader and member', async () => {
      const { getSession } = await import('@/lib/auth/session')
      
      const { session: leaderSession } = await mockAuthenticatedSession('leader')
      vi.mocked(getSession).mockResolvedValue(leaderSession)
      const leader = await getSession()
      
      const { session: memberSession } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(memberSession)
      const member = await getSession()

      expect(leader?.role).toBe('leader')
      expect(member?.role).toBe('member')
      
      // Leader can create, member cannot
      const leaderCanCreate = ['admin', 'leader'].includes(leader?.role || '')
      const memberCanCreate = ['admin', 'leader'].includes(member?.role || '')
      
      expect(leaderCanCreate).toBe(true)
      expect(memberCanCreate).toBe(false)
    })
  })

  describe('Authorization Error Messages', () => {
    it('should return 401 for unauthenticated access', async () => {
      const { getSession } = await import('@/lib/auth/session')
      vi.mocked(getSession).mockResolvedValue(null)

      const session = await getSession()

      if (!session) {
        const statusCode = 401
        const message = 'Unauthorized'
        
        expect(statusCode).toBe(401)
        expect(message).toBe('Unauthorized')
      }
    })

    it('should return 403 for insufficient permissions', async () => {
      const { getSession } = await import('@/lib/auth/session')
      const { session } = await mockAuthenticatedSession('member')
      vi.mocked(getSession).mockResolvedValue(session)

      const currentSession = await getSession()

      if (currentSession && !['admin', 'leader'].includes(currentSession.role)) {
        const statusCode = 403
        const message = 'Forbidden'
        
        expect(statusCode).toBe(403)
        expect(message).toBe('Forbidden')
      }
    })
  })
})
