'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Visitor = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  visit_date: string
  source: string | null
  interested_in: string[] | null
  notes: string | null
  followed_up: boolean
  follow_up_needed: boolean
  created_at: string
  updated_at: string
}

export type VisitorInsert = Omit<Visitor, 'id' | 'created_at' | 'updated_at'>
export type VisitorUpdate = Partial<VisitorInsert>
type VisitorRow = Visitor & {
  interested_in?: unknown
  followed_up?: number | boolean
  follow_up_needed?: number | boolean
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || 'Request failed')
  }
  return res.json() as Promise<T>
}

function normalizeVisitor(row: VisitorRow): Visitor {
  let interestedIn: string[] | null = null
  if (row.interested_in) {
    try {
      interestedIn = Array.isArray(row.interested_in)
        ? row.interested_in
        : JSON.parse(row.interested_in)
    } catch {
      interestedIn = null
    }
  }

  return {
    ...row,
    interested_in: interestedIn,
    followed_up: Boolean(row.followed_up),
    follow_up_needed: Boolean(row.follow_up_needed),
  }
}

export function useVisitors() {
  return useQuery({
    queryKey: ['visitors'],
    queryFn: async () => {
      const res = await fetch('/api/visitors')
      const data = await handleJson<Visitor[]>(res)
      return data.map(normalizeVisitor)
    },
  })
}

export function useCreateVisitor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (visitor: VisitorInsert) => {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitor),
      })
      return handleJson<{ id: string }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
    },
  })
}

export function useUpdateVisitor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: VisitorUpdate }) => {
      const res = await fetch(`/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
    },
  })
}

export function useDeleteVisitor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/visitors/${id}`, { method: 'DELETE' })
      await handleJson<{ success: boolean }>(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
    },
  })
}
