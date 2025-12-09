import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/auth/password'

describe('Password Hashing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'MySecurePassword123!'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash).not.toBe(password)
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true)
    })

    it('should create different hashes for the same password', async () => {
      const password = 'SamePassword123!'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })

    it('should handle empty password', async () => {
      const password = ''
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('should handle long passwords', async () => {
      const password = 'A'.repeat(100) + '123!'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'CorrectPassword123!'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'CorrectPassword123!'
      const wrongPassword = 'WrongPassword123!'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(wrongPassword, hash)

      expect(isValid).toBe(false)
    })

    it('should reject password with different case', async () => {
      const password = 'Password123!'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword('password123!', hash)

      expect(isValid).toBe(false)
    })

    it('should handle special characters in password', async () => {
      const password = 'P@ssw0rd!#$%&*()'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject against invalid hash', async () => {
      const password = 'Password123!'
      const invalidHash = 'not-a-valid-bcrypt-hash'

      const isValid = await verifyPassword(password, invalidHash)

      expect(isValid).toBe(false)
    })
  })

  describe('Password Security', () => {
    it('should use sufficient cost factor (rounds)', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)

      // Extract cost factor from hash
      const match = hash.match(/^\$2[ab]\$(\d+)\$/)
      const rounds = match ? parseInt(match[1], 10) : 0

      expect(rounds).toBeGreaterThanOrEqual(10) // bcrypt recommends at least 10
    })

    it('should be slow enough to prevent brute force', async () => {
      const password = 'SlowHash123!'
      
      const startTime = Date.now()
      await hashPassword(password)
      const endTime = Date.now()

      const duration = endTime - startTime

      // Should take at least some milliseconds (not instant)
      expect(duration).toBeGreaterThan(10)
    })
  })
})
