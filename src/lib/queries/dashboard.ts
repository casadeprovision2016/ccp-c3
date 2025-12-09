'use client'

import { useQuery } from '@tanstack/react-query'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats')
      if (!res.ok) throw new Error('Failed to fetch dashboard stats')
      return res.json() as Promise<{
        eventsThisMonth: number
        activeMembers: number
        visitorsThisMonth: number
      }>
    },
  })
}
