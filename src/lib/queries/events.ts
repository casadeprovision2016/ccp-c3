'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Event = {
  id: string
  title: string
  description: string | null
  event_date: string
  end_date: string | null
  location: string | null
  event_type: string | null
  image_url: string | null
  status: string
  follow_up_needed: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'>
export type EventUpdate = Partial<EventInsert>
type EventRow = Event & { follow_up_needed?: number | boolean }

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || 'Request failed')
  }
  return res.json() as Promise<T>
}

function normalizeEvent(row: EventRow): Event {
  return {
    ...row,
    follow_up_needed: Boolean(row.follow_up_needed),
  }
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/api/events')
      const data = await handleJson<Event[]>(res)
      return data.map(normalizeEvent)
    },
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
      return handleJson<{ id: string }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventUpdate }) => {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      await handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
