'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Stream = {
  id: string
  title: string
  description: string | null
  stream_url: string
  platform: string | null
  scheduled_date: string
  status: string | null
  thumbnail_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type StreamInsert = Omit<Stream, 'id' | 'created_at' | 'updated_at'>
export type StreamUpdate = Partial<StreamInsert>

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || 'Request failed')
  }
  return res.json() as Promise<T>
}

export function useStreams() {
  return useQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      const res = await fetch('/api/streams')
      return handleJson<Stream[]>(res)
    },
  })
}

export function useCreateStream() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (stream: StreamInsert) => {
      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stream),
      })
      return handleJson<{ id: string }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streams'] })
    },
  })
}

export function useUpdateStream() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: StreamUpdate }) => {
      const res = await fetch(`/api/streams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streams'] })
    },
  })
}

export function useDeleteStream() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/streams/${id}`, { method: 'DELETE' })
      await handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streams'] })
    },
  })
}
