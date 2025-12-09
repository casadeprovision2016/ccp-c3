import { vi } from 'vitest'

export interface Cookie {
  name: string
  value: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  maxAge?: number
  path?: string
}

export interface CookieStore {
  get(name: string): { value: string } | undefined
  set(name: string, value: string, options?: Omit<Cookie, 'name' | 'value'>): void
  delete(name: string): void
  getAll(): Cookie[]
}

/**
 * Creates a mock cookie store for testing
 */
export function createMockCookieStore(): CookieStore {
  const cookies = new Map<string, Cookie>()

  return {
    get(name: string) {
      const cookie = cookies.get(name)
      return cookie ? { value: cookie.value } : undefined
    },

    set(name: string, value: string, options = {}) {
      cookies.set(name, {
        name,
        value,
        ...options,
      })
    },

    delete(name: string) {
      cookies.delete(name)
    },

    getAll() {
      return Array.from(cookies.values())
    },
  }
}

/**
 * Mock for Next.js cookies() function
 */
export function createMockNextCookies() {
  const store = createMockCookieStore()
  
  return vi.fn(async () => ({
    get: (name: string) => store.get(name),
    set: (name: string, value: string, options?: any) => store.set(name, value, options),
    delete: (name: string) => store.delete(name),
    getAll: () => store.getAll(),
  }))
}
