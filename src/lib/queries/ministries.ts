'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Ministry = {
  id: string
  name: string
  description: string | null
  leader_id: string | null
  meeting_schedule: string | null
  status: string | null
  created_at: string
  updated_at: string
}

export type MinistryInsert = Omit<Ministry, 'id' | 'created_at' | 'updated_at'>
export type MinistryUpdate = Partial<MinistryInsert>

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || 'Request failed')
  }
  return res.json() as Promise<T>
}

export function useMinistries() {
  return useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      const res = await fetch('/api/ministries')
      return handleJson<Ministry[]>(res)
    },
  })
}

export function useCreateMinistry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ministry: MinistryInsert) => {
      const res = await fetch('/api/ministries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ministry),
      })
      return handleJson<{ id: string }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] })
    },
  })
}

export function useUpdateMinistry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MinistryUpdate }) => {
      const res = await fetch(`/api/ministries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] })
    },
  })
}

export function useDeleteMinistry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/ministries/${id}`, { method: 'DELETE' })
      await handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] })
    },
  })
}
