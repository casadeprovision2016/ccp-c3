import { vi } from 'vitest'
import { createMockCookieStore } from './cookies'
import type { JwtPayload } from '@/lib/auth/jwt'

/**
 * Mock session with different roles for testing
 */
export function createMockSession(role: 'admin' | 'leader' | 'member' = 'admin'): JwtPayload {
  return {
    userId: `user-${role}-123`,
    email: `${role}@example.com`,
    role,
  }
}

/**
 * Mock authenticated session in cookies
 */
export async function mockAuthenticatedSession(
  role: 'admin' | 'leader' | 'member' = 'admin'
) {
  const cookieStore = createMockCookieStore()
  const session = createMockSession(role)
  
  // Mock JWT token (in real implementation this would be signed)
  const mockToken = `mock-jwt-token-${role}`
  
  cookieStore.set('session', mockToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return {
    cookieStore,
    session,
    token: mockToken,
  }
}

/**
 * Mock unauthenticated session (no cookie)
 */
export function mockUnauthenticatedSession() {
  const cookieStore = createMockCookieStore()
  
  return {
    cookieStore,
    session: null,
    token: null,
  }
}
