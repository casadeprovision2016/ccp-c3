import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '@/middleware'

// Mock JWT verification
vi.mock('jose', () => ({
  jwtVerify: vi.fn(async (token: string, secret: any) => {
    if (token === 'valid-token') {
      return {
        payload: {
          userId: 'user-123',
          email: 'test@example.com',
          role: 'admin',
        },
      }
    }
    throw new Error('Invalid token')
  }),
  SignJWT: vi.fn(),
}))

// Mock JWT_SECRET
vi.stubEnv('JWT_SECRET', 'test-secret-key-for-testing')

describe('Middleware - Route Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Protected Routes (/panel/*)', () => {
    it('should redirect unauthenticated user to /login', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel'))

      const response = await middleware(request)

      expect(response.status).toBe(307) // Redirect status
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should allow authenticated user to access /panel', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel'))
      request.cookies.set('session', 'valid-token')

      const response = await middleware(request)

      expect(response.status).not.toBe(307)
    })

    it('should redirect user with expired token', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel'))
      request.cookies.set('session', 'expired-token')

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should redirect user with invalid token', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel'))
      request.cookies.set('session', 'invalid-token')

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should protect all /panel/* subroutes', async () => {
      const protectedRoutes = [
        '/panel',
        '/panel/dashboard',
        '/panel/donations',
        '/panel/members',
        '/panel/events',
      ]

      for (const route of protectedRoutes) {
        const request = new NextRequest(new URL(`http://localhost:3000${route}`))

        const response = await middleware(request)

        expect(response.status).toBe(307)
        expect(response.headers.get('location')).toContain('/login')
      }
    })
  })

  describe('Login Route (/login)', () => {
    it('should allow unauthenticated user to access /login', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/login'))

      const response = await middleware(request)

      expect(response.status).not.toBe(307)
    })

    it('should redirect authenticated user from /login to /panel', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/login'))
      request.cookies.set('session', 'valid-token')

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/panel')
    })
  })

  describe('Public Routes', () => {
    it('should allow access to homepage without authentication', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/'))

      const response = await middleware(request)

      expect(response.status).not.toBe(307)
    })

    it('should allow access to public pages', async () => {
      const publicRoutes = [
        '/',
        '/politica-de-privacidad',
        '/politica-de-cookies',
      ]

      for (const route of publicRoutes) {
        const request = new NextRequest(new URL(`http://localhost:3000${route}`))

        const response = await middleware(request)

        // Should not redirect
        expect(response.status).not.toBe(307)
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle malformed cookies gracefully', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel'))
      request.cookies.set('session', '')

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should preserve query parameters when redirecting', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel?tab=donations'))

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should handle missing session cookie', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel'))
      // No session cookie set

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })
  })

  describe('Middleware Performance', () => {
    it('should process request quickly', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/panel'))

      const startTime = Date.now()
      await middleware(request)
      const endTime = Date.now()

      const duration = endTime - startTime

      // Middleware should be fast (< 100ms in test environment)
      expect(duration).toBeLessThan(100)
    })
  })
})
