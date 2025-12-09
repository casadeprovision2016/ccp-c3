'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Donation = {
  id: string
  donor_name: string | null
  amount: number
  donation_type: string | null
  payment_method: string | null
  donation_date: string
  notes: string | null
  receipt_number: string | null
  follow_up_needed: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export type DonationInsert = Omit<Donation, 'id' | 'created_at' | 'updated_at'>
export type DonationUpdate = Partial<DonationInsert>

export function useDonations() {
  return useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const res = await fetch('/api/donations')
      if (!res.ok) throw new Error('Failed to fetch donations')
      return res.json() as Promise<Donation[]>
    },
  })
}

export function useCreateDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (donation: DonationInsert) => {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation),
      })
      if (!res.ok) throw new Error('Failed to create donation')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}

export function useUpdateDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DonationUpdate }) => {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update donation')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}

export function useDeleteDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete donation')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}
