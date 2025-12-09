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
        const storageMap = (db as any).storage ?? storage
        const data = (storageMap.get(tableName) || []) as any[]

        // Simple aggregation and filtering support for tests
        const queryStr = query.trim()

        // Handle COUNT(*) with optional WHERE <field> = '<value>' or WHERE <field> = ? (bound)
        if (/COUNT\s*\(/i.test(queryStr)) {
          let rows = data
          const whereMatch = queryStr.match(/WHERE\s+(\w+)\s*=\s*'([^']+)'/i)
          if (whereMatch) {
            const field = whereMatch[1]
            const value = whereMatch[2]
            rows = rows.filter(r => String((r as any)[field]) === value)
          } else if (/WHERE\s+\w+\s*=\s*\?/i.test(queryStr) && boundValues.length > 0) {
            const bMatch = queryStr.match(/WHERE\s+(\w+)\s*=\s*\?/i)
            if (bMatch) {
              const field = bMatch[1]
              const value = boundValues[0]
              rows = rows.filter(r => String((r as any)[field]) === String(value))
            }
          }

          return {
            results: [{ count: rows.length }] as unknown as T[],
            success: true,
            meta: { duration: 1, rows_read: rows.length, rows_written: 0 },
          }
        }

        // Handle SUM(column) aggregation
        const sumMatch = queryStr.match(/SUM\((\w+)\)\s+as\s+(\w+)/i)
        if (sumMatch) {
          const col = sumMatch[1]
          const sum = data.reduce((s, r) => s + Number((r as any)[col] || 0), 0)
          return {
            results: [{ [sumMatch[2]]: sum }] as unknown as T[],
            success: true,
            meta: { duration: 1, rows_read: data.length, rows_written: 0 },
          }
        }

        // Handle WHERE clauses with bound parameter (e.g., WHERE id = ?)
        const whereParamMatch = queryStr.match(/WHERE\s+(\w+)\s*=\s*\?/i)
        if (whereParamMatch && boundValues.length > 0) {
          const field = whereParamMatch[1]
          const value = boundValues[0]
          const filtered = data.filter(r => String((r as any)[field]) === String(value))
          return {
            results: filtered as T[],
            success: true,
            meta: { duration: 1, rows_read: filtered.length, rows_written: 0 },
          }
        }

        // Handle ORDER BY <col> DESC/ASC and simple CASE WHEN for prioritizing live streams
        const orderMatch = queryStr.match(/ORDER\s+BY\s+(\w+)\s+(DESC|ASC)/i)
        let finalData = data

        // CASE WHEN status = 'live' THEN 0 ELSE 1 END,
        if (/CASE\s+WHEN\s+status\s*=\s*'live'/i.test(queryStr)) {
          finalData = [...data].sort((a: any, b: any) => {
            const aPriority = a.status === 'live' ? 0 : 1
            const bPriority = b.status === 'live' ? 0 : 1
            if (aPriority !== bPriority) return aPriority - bPriority
            // fallback to scheduled_date asc
            const A = new Date(a.scheduled_date || 0).getTime()
            const B = new Date(b.scheduled_date || 0).getTime()
            return A - B
          })
        } else if (orderMatch) {
          const col = orderMatch[1]
          const dir = orderMatch[2].toUpperCase()
          finalData = [...data].sort((a: any, b: any) => {
            const A = a[col]
            const B = b[col]
            if (A === B) return 0
            if (dir === 'DESC') return A > B ? -1 : 1
            return A < B ? -1 : 1
          })
        }
        
        return {
          results: finalData as T[],
          success: true,
          meta: {
            duration: 1,
            rows_read: finalData.length,
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
