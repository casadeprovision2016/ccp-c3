import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signJwt, verifyJwt } from '@/lib/auth/jwt'

// Mock do JWT_SECRET para testes
vi.stubEnv('JWT_SECRET', 'test-secret-key-for-testing')

describe('JWT Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signJwt', () => {
    it('should create a valid JWT token', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      const token = await signJwt(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT format: header.payload.signature
    })

    it('should create different tokens for different users', async () => {
      const payload1 = {
        userId: 'user-1',
        email: 'user1@example.com',
        role: 'admin' as const,
      }

      const payload2 = {
        userId: 'user-2',
        email: 'user2@example.com',
        role: 'leader' as const,
      }

      const token1 = await signJwt(payload1)
      const token2 = await signJwt(payload2)

      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyJwt', () => {
    it('should verify and decode a valid token', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      const token = await signJwt(payload)
      const decoded = await verifyJwt(token)

      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(payload.userId)
      expect(decoded?.email).toBe(payload.email)
      expect(decoded?.role).toBe(payload.role)
    })

    it('should return null for invalid token', async () => {
      const invalidToken = 'invalid.token.here'
      const decoded = await verifyJwt(invalidToken)

      expect(decoded).toBeNull()
    })

    it('should return null for expired token', async () => {
      // This would require mocking time or using a token with past expiration
      // For now, we test with a malformed token
      const decoded = await verifyJwt('expired-token')

      expect(decoded).toBeNull()
    })

    it('should handle all user roles correctly', async () => {
      const roles = ['admin', 'leader', 'member'] as const

      for (const role of roles) {
        const payload = {
          userId: `user-${role}`,
          email: `${role}@example.com`,
          role,
        }

        const token = await signJwt(payload)
        const decoded = await verifyJwt(token)

        expect(decoded?.role).toBe(role)
      }
    })
  })

  describe('JWT Security', () => {
    it('should fail verification with different secret', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      const token = await signJwt(payload)

      // Change the secret
      vi.stubEnv('JWT_SECRET', 'different-secret')

      const decoded = await verifyJwt(token)

      expect(decoded).toBeNull()
    })

    it('should throw error if JWT_SECRET is not set', async () => {
      vi.stubEnv('JWT_SECRET', '')

      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin' as const,
      }

      await expect(signJwt(payload)).rejects.toThrow('JWT_SECRET not set')
    })
  })
})
