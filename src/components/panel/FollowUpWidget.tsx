'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { useEvents } from '@/lib/queries/events'
import { useDonations } from '@/lib/queries/donations'
import { useVisitors } from '@/lib/queries/visitors'
import { usePastoralVisits } from '@/lib/queries/pastoral-visits'
import { Calendar, DollarSign, UserPlus, User, Loader2 } from 'lucide-react'

export default function FollowUpWidget() {
  const { data: events, isLoading: eventsLoading } = useEvents()
  const { data: donations, isLoading: donationsLoading } = useDonations()
  const { data: visitors, isLoading: visitorsLoading } = useVisitors()
  const { data: pastoralVisits, isLoading: visitsLoading } = usePastoralVisits()

  // Filtrar items con seguimiento pendiente
  const pendingEvents = events?.filter(e => e.follow_up_needed) || []
  const pendingDonations = donations?.filter(d => d.follow_up_needed) || []
  const pendingVisitors = visitors?.filter(v => v.follow_up_needed) || []
  const pendingVisits = pastoralVisits?.filter(pv => pv.follow_up_needed) || []

  const totalPending = pendingEvents.length + pendingDonations.length + 
                       pendingVisitors.length + pendingVisits.length

  const isLoading = eventsLoading || donationsLoading || visitorsLoading || visitsLoading

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-church-blue-dark flex items-center gap-2">
            ⚠️ Pendientes de Seguimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-church-gold" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-yellow-400">
      <CardHeader>
        <CardTitle className="text-church-blue-dark flex items-center gap-2">
          ⚠️ Pendientes de Seguimiento
          {totalPending > 0 && (
            <span className="inline-block px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-300">
              {totalPending}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalPending === 0 ? (
          <p className="text-gray-500 text-sm">
            ✅ No hay items pendientes de seguimiento
          </p>
        ) : (
          <div className="space-y-4">
            {/* Eventos */}
            {pendingEvents.length > 0 && (
              <div className="border-l-2 border-yellow-400 pl-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar className="h-4 w-4 text-church-gold" />
                  <span>Eventos ({pendingEvents.length})</span>
                </div>
                <div className="space-y-1">
                  {pendingEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="text-xs text-gray-600">
                      • {event.title}
                      <span className="text-gray-400 ml-1">
                        ({new Date(event.event_date).toLocaleDateString('es-EC')})
                      </span>
                    </div>
                  ))}
                  {pendingEvents.length > 3 && (
                    <div className="text-xs text-gray-400">
                      + {pendingEvents.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Donaciones */}
            {pendingDonations.length > 0 && (
              <div className="border-l-2 border-yellow-400 pl-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <DollarSign className="h-4 w-4 text-church-gold" />
                  <span>Donaciones ({pendingDonations.length})</span>
                </div>
                <div className="space-y-1">
                  {pendingDonations.slice(0, 3).map(donation => (
                    <div key={donation.id} className="text-xs text-gray-600">
                      • ${Number(donation.amount).toFixed(2)}
                      {donation.donor_name && (
                        <span className="text-gray-400 ml-1">
                          - {donation.donor_name}
                        </span>
                      )}
                    </div>
                  ))}
                  {pendingDonations.length > 3 && (
                    <div className="text-xs text-gray-400">
                      + {pendingDonations.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visitantes */}
            {pendingVisitors.length > 0 && (
              <div className="border-l-2 border-yellow-400 pl-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <UserPlus className="h-4 w-4 text-church-gold" />
                  <span>Visitantes ({pendingVisitors.length})</span>
                </div>
                <div className="space-y-1">
                  {pendingVisitors.slice(0, 3).map(visitor => (
                    <div key={visitor.id} className="text-xs text-gray-600">
                      • {visitor.full_name}
                      <span className="text-gray-400 ml-1">
                        ({new Date(visitor.visit_date).toLocaleDateString('es-EC')})
                      </span>
                    </div>
                  ))}
                  {pendingVisitors.length > 3 && (
                    <div className="text-xs text-gray-400">
                      + {pendingVisitors.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visitas Pastorales */}
            {pendingVisits.length > 0 && (
              <div className="border-l-2 border-yellow-400 pl-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <User className="h-4 w-4 text-church-gold" />
                  <span>Visitas Pastorales ({pendingVisits.length})</span>
                </div>
                <div className="space-y-1">
                  {pendingVisits.slice(0, 3).map(visit => (
                    <div key={visit.id} className="text-xs text-gray-600">
                      • Visita
                      <span className="text-gray-400 ml-1">
                        ({new Date(visit.visit_date).toLocaleDateString('es-EC')})
                      </span>
                    </div>
                  ))}
                  {pendingVisits.length > 3 && (
                    <div className="text-xs text-gray-400">
                      + {pendingVisits.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
