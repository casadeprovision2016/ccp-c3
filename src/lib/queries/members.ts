'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Member = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  address: string | null
  birth_date: string | null
  baptism_date: string | null
  membership_date: string | null
  status: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type MemberInsert = Omit<Member, 'id' | 'created_at' | 'updated_at'>
export type MemberUpdate = Partial<MemberInsert>

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await fetch('/api/members')
      if (!res.ok) throw new Error('Failed to fetch members')
      return res.json() as Promise<Member[]>
    },
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (member: MemberInsert) => {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      })
      if (!res.ok) throw new Error('Failed to create member')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MemberUpdate }) => {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update member')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete member')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}
