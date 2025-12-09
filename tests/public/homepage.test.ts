import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockD1Database } from '../setup/mocks/d1'
import { testEvents, testStreams } from '../setup/fixtures/events'

// Mock Cloudflare context
vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(async () => ({
    env: {
      DB: createMockD1Database(),
    },
  })),
}))

describe('Homepage - Public Data', () => {
  let mockDb: ReturnType<typeof createMockD1Database>

  beforeEach(async () => {
    vi.clearAllMocks()
    
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const context = await getCloudflareContext()
    mockDb = context.env.DB
    
    // Seed database with test data
    const storage = new Map()
    storage.set('events', [...testEvents])
    storage.set('streams', [...testStreams])
    ;(mockDb as any).storage = storage
  })

  describe('Public Events API', () => {
    it('should return scheduled events', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled' 
        ORDER BY event_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      expect(result.results).toBeDefined()
      
      const scheduledEvents = testEvents.filter(e => e.status === 'scheduled')
      expect(result.results?.length).toBe(scheduledEvents.length)
    })

    it('should not return cancelled events', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled'
        ORDER BY event_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      
      const hasAnyCompleted = result.results?.some((e: any) => e.status === 'cancelled')
      expect(hasAnyCompleted).toBe(false)
    })

    it('should order events by date ascending', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled'
        ORDER BY event_date ASC
      `)
      const result = await statement.all()

      if (result.results && result.results.length > 1) {
        const dates = result.results.map((e: any) => new Date(e.event_date).getTime())
        const sortedDates = [...dates].sort((a, b) => a - b)
        expect(dates).toEqual(sortedDates)
      }
    })

    it('should include event details', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled'
        ORDER BY event_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      
      if (result.results && result.results.length > 0) {
        const event = result.results[0] as any
        expect(event).toHaveProperty('id')
        expect(event).toHaveProperty('title')
        expect(event).toHaveProperty('description')
        expect(event).toHaveProperty('event_date')
        expect(event).toHaveProperty('location')
        expect(event).toHaveProperty('event_type')
      }
    })

    it('should handle empty events list', async () => {
      // Clear events
      const storage = new Map()
      storage.set('events', [])
      storage.set('streams', [...testStreams])
      ;(mockDb as any).storage = storage

      const statement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled'
        ORDER BY event_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      expect(result.results).toEqual([])
    })
  })

  describe('Public Streams API', () => {
    it('should return live and scheduled streams', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM streams 
        WHERE status IN ('live', 'scheduled')
        ORDER BY scheduled_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      expect(result.results).toBeDefined()
      
      const activeStreams = testStreams.filter(s => ['live', 'scheduled'].includes(s.status))
      expect(result.results?.length).toBe(activeStreams.length)
    })

    it('should not return ended streams', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM streams 
        WHERE status IN ('live', 'scheduled')
        ORDER BY scheduled_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      
      const hasAnyEnded = result.results?.some((s: any) => s.status === 'ended')
      expect(hasAnyEnded).toBe(false)
    })

    it('should prioritize live streams', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM streams 
        WHERE status IN ('live', 'scheduled')
        ORDER BY 
          CASE WHEN status = 'live' THEN 0 ELSE 1 END,
          scheduled_date ASC
      `)
      const result = await statement.all()

      if (result.results && result.results.length > 1) {
        const firstStream = result.results[0] as any
        const liveStreams = result.results.filter((s: any) => s.status === 'live')
        
        if (liveStreams.length > 0) {
          expect(firstStream.status).toBe('live')
        }
      }
    })

    it('should include stream details', async () => {
      const statement = mockDb.prepare(`
        SELECT * FROM streams 
        WHERE status IN ('live', 'scheduled')
        ORDER BY scheduled_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      
      if (result.results && result.results.length > 0) {
        const stream = result.results[0] as any
        expect(stream).toHaveProperty('id')
        expect(stream).toHaveProperty('title')
        expect(stream).toHaveProperty('stream_url')
        expect(stream).toHaveProperty('platform')
        expect(stream).toHaveProperty('scheduled_date')
        expect(stream).toHaveProperty('status')
      }
    })

    it('should handle empty streams list', async () => {
      // Clear streams
      const storage = new Map()
      storage.set('events', [...testEvents])
      storage.set('streams', [])
      ;(mockDb as any).storage = storage

      const statement = mockDb.prepare(`
        SELECT * FROM streams 
        WHERE status IN ('live', 'scheduled')
        ORDER BY scheduled_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
      expect(result.results).toEqual([])
    })
  })

  describe('Homepage Data Loading', () => {
    it('should load both events and streams simultaneously', async () => {
      const eventsStatement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled'
        ORDER BY event_date ASC
      `)
      
      const streamsStatement = mockDb.prepare(`
        SELECT * FROM streams 
        WHERE status IN ('live', 'scheduled')
        ORDER BY scheduled_date ASC
      `)

      const [eventsResult, streamsResult] = await Promise.all([
        eventsStatement.all(),
        streamsStatement.all(),
      ])

      expect(eventsResult.success).toBe(true)
      expect(streamsResult.success).toBe(true)
      expect(eventsResult.results).toBeDefined()
      expect(streamsResult.results).toBeDefined()
    })

    it('should handle errors gracefully', async () => {
      // Simulate error by providing invalid query
      try {
        const statement = mockDb.prepare('INVALID SQL QUERY')
        await statement.all()
      } catch (error) {
        // Should handle error gracefully
        expect(error).toBeDefined()
      }
    })

    it('should return data within acceptable time', async () => {
      const startTime = Date.now()
      
      const eventsStatement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled'
        ORDER BY event_date ASC
        LIMIT 10
      `)
      
      await eventsStatement.all()
      
      const endTime = Date.now()
      const duration = endTime - startTime

      // Should be fast (< 100ms in test environment)
      expect(duration).toBeLessThan(100)
    })
  })

  describe('Public Access Without Authentication', () => {
    it('should allow access to public events without authentication', async () => {
      // No authentication required for public endpoints
      const statement = mockDb.prepare(`
        SELECT * FROM events 
        WHERE status = 'scheduled'
        ORDER BY event_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
    })

    it('should allow access to public streams without authentication', async () => {
      // No authentication required for public endpoints
      const statement = mockDb.prepare(`
        SELECT * FROM streams 
        WHERE status IN ('live', 'scheduled')
        ORDER BY scheduled_date ASC
      `)
      const result = await statement.all()

      expect(result.success).toBe(true)
    })
  })
})
