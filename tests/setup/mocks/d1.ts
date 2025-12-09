import { vi } from 'vitest'

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run<T = unknown>(): Promise<D1Result<T>>
  all<T = unknown>(): Promise<D1Result<T>>
  raw<T = unknown[]>(): Promise<T[]>
}

export interface D1Result<T = unknown> {
  results?: T[]
  success: boolean
  error?: string
  meta: {
    duration: number
    rows_read: number
    rows_written: number
  }
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement
  dump(): Promise<ArrayBuffer>
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
  exec(query: string): Promise<D1Result>
}

/**
 * Creates a mock D1 database with in-memory storage
 */
export function createMockD1Database(): D1Database {
  const storage = new Map<string, any[]>()

  const createPreparedStatement = (query: string): D1PreparedStatement => {
    let boundValues: unknown[] = []

    const statement: D1PreparedStatement = {
      bind(...values: unknown[]) {
        boundValues = values
        return statement
      },

      async first<T = unknown>(colName?: string): Promise<T | null> {
        const result = await statement.all<T>()
        if (!result.results || result.results.length === 0) {
          return null
        }
        
        if (colName) {
          return (result.results[0] as any)[colName] ?? null
        }
        
        return result.results[0]
      },

      async run<T = unknown>(): Promise<D1Result<T>> {
        // Mock implementation for INSERT, UPDATE, DELETE
        return {
          success: true,
          meta: {
            duration: 1,
            rows_read: 0,
            rows_written: 1,
          },
        }
      },

      async all<T = unknown>(): Promise<D1Result<T>> {
        // Mock implementation for SELECT
        const tableName = extractTableName(query)
        const data = storage.get(tableName) || []
        
        return {
          results: data as T[],
          success: true,
          meta: {
            duration: 1,
            rows_read: data.length,
            rows_written: 0,
          },
        }
      },

      async raw<T = unknown[]>(): Promise<T[]> {
        const result = await statement.all()
        return (result.results || []) as T[]
      },
    }

    return statement
  }

  const db: D1Database = {
    prepare: vi.fn(createPreparedStatement),
    
    async dump(): Promise<ArrayBuffer> {
      return new ArrayBuffer(0)
    },
    
    async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      const results = await Promise.all(statements.map(stmt => stmt.run<T>()))
      return results
    },
    
    async exec(query: string): Promise<D1Result> {
      return {
        success: true,
        meta: {
          duration: 1,
          rows_read: 0,
          rows_written: 0,
        },
      }
    },
  }

  // expose internal storage so tests can seed data via (db as any).storage
  ;(db as any).storage = storage

  return db
}

/**
 * Helper to extract table name from SQL query (simple implementation)
 */
function extractTableName(query: string): string {
  const match = query.match(/FROM\s+(\w+)/i) || query.match(/INTO\s+(\w+)/i)
  return match ? match[1] : 'unknown'
}

/**
 * Helper to seed mock database with data
 */
export function seedMockD1(db: D1Database, tableName: string, data: any[]) {
  const storage = (db as any).storage || new Map()
  storage.set(tableName, data)
  ;(db as any).storage = storage
}
