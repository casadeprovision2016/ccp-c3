'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type PastoralVisit = {
  id: string
  member_id: string | null
  visitor_id: string | null
  visit_date: string
  visit_type: string | null
  pastor_id: string | null
  notes: string | null
  follow_up_needed: boolean
  status: string | null
  created_at: string
  updated_at: string
}

export type PastoralVisitInsert = Omit<PastoralVisit, 'id' | 'created_at' | 'updated_at'>
export type PastoralVisitUpdate = Partial<PastoralVisitInsert>
type PastoralVisitRow = PastoralVisit & { follow_up_needed?: number | boolean }

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || 'Request failed')
  }
  return res.json() as Promise<T>
}

function normalizeVisit(row: PastoralVisitRow): PastoralVisit {
  return {
    ...row,
    follow_up_needed: Boolean(row.follow_up_needed),
  }
}

export function usePastoralVisits() {
  return useQuery({
    queryKey: ['pastoral-visits'],
    queryFn: async () => {
      const res = await fetch('/api/pastoral-visits')
      const data = await handleJson<PastoralVisit[]>(res)
      return data.map(normalizeVisit)
    },
  })
}

export function useCreatePastoralVisit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (visit: PastoralVisitInsert) => {
      const res = await fetch('/api/pastoral-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visit),
      })
      return handleJson<{ id: string }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastoral-visits'] })
    },
  })
}

export function useUpdatePastoralVisit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PastoralVisitUpdate }) => {
      const res = await fetch(`/api/pastoral-visits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastoral-visits'] })
    },
  })
}

export function useDeletePastoralVisit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/pastoral-visits/${id}`, { method: 'DELETE' })
      await handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastoral-visits'] })
    },
  })
}
