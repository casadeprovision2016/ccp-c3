import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSession, getSession, destroySession } from '@/lib/auth/session'

// Mock Next.js cookies without referencing top-level imports (avoid vi.mock hoisting issues)
vi.mock('next/headers', async () => {
  const mod = await import('../setup/mocks/cookies')
  return {
    cookies: mod.createMockNextCookies(),
  }
})

// Mock JWT_SECRET
vi.stubEnv('JWT_SECRET', 'test-secret-key-for-testing')
vi.stubEnv('NODE_ENV', 'test')

describe('Session Management', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    // Ensure cookie store is cleared between tests
    const { cookies } = await import('next/headers')
    const mockCookies = await cookies()
    const all = mockCookies.getAll()
    for (const c of all) {
      mockCookies.delete(c.name)
    }
  })

  describe('createSession', () => {
    it('should create a session cookie with JWT', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)

      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      const sessionCookie = mockCookies.get('session')

      expect(sessionCookie).toBeDefined()
      expect(sessionCookie?.value).toBeDefined()
    })

    it('should set httpOnly flag on session cookie', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)

      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      const allCookies = mockCookies.getAll()
      const sessionCookie = allCookies.find(c => c.name === 'session')

      expect(sessionCookie?.httpOnly).toBe(true)
    })

    it('should set sameSite to lax', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)

      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      const allCookies = mockCookies.getAll()
      const sessionCookie = allCookies.find(c => c.name === 'session')

      expect(sessionCookie?.sameSite).toBe('lax')
    })

    it('should set maxAge to 7 days', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)

      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      const allCookies = mockCookies.getAll()
      const sessionCookie = allCookies.find(c => c.name === 'session')

      const sevenDaysInSeconds = 60 * 60 * 24 * 7
      expect(sessionCookie?.maxAge).toBe(sevenDaysInSeconds)
    })
  })

  describe('getSession', () => {
    it('should retrieve session from valid cookie', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)
      const session = await getSession()

      expect(session).toBeDefined()
      expect(session?.userId).toBe(payload.userId)
      expect(session?.email).toBe(payload.email)
      expect(session?.role).toBe(payload.role)
    })

    it('should return null when no session cookie exists', async () => {
      const session = await getSession()

      expect(session).toBeNull()
    })

    it('should return null for invalid token', async () => {
      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      mockCookies.set('session', 'invalid-token')

      const session = await getSession()

      expect(session).toBeNull()
    })
  })

  describe('destroySession', () => {
    it('should remove session cookie', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)
      
      let session = await getSession()
      expect(session).toBeDefined()

      await destroySession()

      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      const sessionCookie = mockCookies.get('session')

      expect(sessionCookie).toBeUndefined()
    })

    it('should handle destroying non-existent session', async () => {
      await expect(destroySession()).resolves.not.toThrow()
    })
  })

  describe('Session Security', () => {
    it('should not expose sensitive data in cookie value', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)

      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      const sessionCookie = mockCookies.get('session')

      // Cookie should be a JWT token, not plain text
      expect(sessionCookie?.value).not.toContain('test@example.com')
      expect(sessionCookie?.value).not.toContain('user-123')
    })

    it('should set path to root', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await createSession(payload)

      const { cookies } = await import('next/headers')
      const mockCookies = await cookies()
      const allCookies = mockCookies.getAll()
      const sessionCookie = allCookies.find(c => c.name === 'session')

      expect(sessionCookie?.path).toBe('/')
    })
  })
})
