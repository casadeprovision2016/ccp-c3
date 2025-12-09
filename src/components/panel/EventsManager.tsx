'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Plus, Edit, Trash2, Calendar, Loader2 } from 'lucide-react'
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, type Event } from '@/lib/queries/events'
import { useToast } from '@/hooks/use-toast'

const EventsManager = () => {
  const { data: events, isLoading, isError, error } = useEvents()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [showOnlyFollowUp, setShowOnlyFollowUp] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    event_type: 'service',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
    follow_up_needed: false,
  })

  // Filtrar eventos según el toggle
  const filteredEvents = showOnlyFollowUp 
    ? events?.filter(event => event.follow_up_needed)
    : events

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Combinar fecha y hora para crear timestamp
      const eventDateTime = new Date(formData.event_date).toISOString()
      const endDateTime = formData.end_date ? new Date(formData.end_date).toISOString() : null

      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: eventDateTime,
        end_date: endDateTime,
        location: formData.location,
        event_type: formData.event_type,
        status: formData.status,
        follow_up_needed: formData.follow_up_needed,
        image_url: null,
        created_by: null,
      }
      
      if (editingEventId) {
        await updateEvent.mutateAsync({ id: editingEventId, updates: eventData })
        toast({ title: 'Evento actualizado con éxito' })
        setEditingEventId(null)
      } else {
        await createEvent.mutateAsync(eventData)
        toast({ title: 'Evento creado con éxito' })
      }

      resetForm()
      setShowForm(false)
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el evento',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      end_date: '',
      location: '',
      event_type: 'service',
      status: 'scheduled',
      follow_up_needed: false,
    })
  }

  const handleEdit = (event: Event) => {
    setEditingEventId(event.id)
    
    // Convertir timestamp a formato de input date-time-local
    const eventDate = new Date(event.event_date)
    const endDate = event.end_date ? new Date(event.end_date) : null
    
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: eventDate.toISOString().slice(0, 16),
      end_date: endDate ? endDate.toISOString().slice(0, 16) : '',
      location: event.location || '',
      event_type: event.event_type || 'service',
      status: event.status as 'scheduled' | 'completed' | 'cancelled',
      follow_up_needed: event.follow_up_needed || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await deleteEvent.mutateAsync(id)
        toast({ title: 'Evento eliminado con éxito' })
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el evento',
          variant: 'destructive',
        })
      }
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-church-gold'
      case 'conference': return 'bg-church-blue'
      case 'outreach': return 'bg-green-600'
      case 'meeting': return 'bg-purple-600'
      case 'other': return 'bg-gray-600'
      default: return 'bg-gray-600'
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Culto'
      case 'conference': return 'Conferencia'
      case 'outreach': return 'Alcance'
      case 'meeting': return 'Reunión'
      case 'other': return 'Otro'
      default: return type
    }
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Error al cargar eventos</p>
          <p className="text-gray-600 text-sm mt-2">{error?.message || 'Error desconocido'}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          Recargar página
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-church-gold" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Eventos</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingEventId(null)
            resetForm()
          }}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingEventId ? 'Editar Evento' : 'Nuevo Evento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_type">Tipo</Label>
                  <select
                    id="event_type"
                    title="Tipo de evento"
                    value={formData.event_type}
                    onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="service">Culto</option>
                    <option value="conference">Conferencia</option>
                    <option value="outreach">Alcance</option>
                    <option value="meeting">Reunión</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Fecha y Hora de Inicio</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Fecha y Hora de Fin (Opcional)</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    title="Estado del evento"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'scheduled' | 'completed' | 'cancelled'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="ongoing">En curso</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="follow_up_needed"
                  title="Requiere seguimiento"
                  checked={formData.follow_up_needed}
                  onChange={(e) => setFormData({...formData, follow_up_needed: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="follow_up_needed" className="cursor-pointer font-normal">
                  ⚠️ Requiere seguimiento
                </Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-church-gold hover:bg-church-gold-dark text-white"
                  disabled={createEvent.isPending || updateEvent.isPending}
                >
                  {(createEvent.isPending || updateEvent.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingEventId ? 'Actualizar' : 'Crear'} Evento
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingEventId(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtro de seguimiento */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="filter_follow_up"
          title="Mostrar solo eventos con seguimiento"
          checked={showOnlyFollowUp}
          onChange={(e) => setShowOnlyFollowUp(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="filter_follow_up" className="cursor-pointer font-normal text-sm">
          Mostrar solo eventos con seguimiento ⚠️
        </Label>
        {showOnlyFollowUp && filteredEvents && (
          <span className="text-xs text-gray-500">
            ({filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''})
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const eventDate = new Date(event.event_date)
            const endDate = event.end_date ? new Date(event.end_date) : null
            
            return (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`inline-block px-2 py-1 rounded text-xs text-white ${getEventTypeColor(event.event_type || 'other')}`}>
                          {getEventTypeLabel(event.event_type || 'other')}
                        </div>
                        {event.status === 'ongoing' && (
                          <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            En vivo
                          </span>
                        )}
                        {event.follow_up_needed && (
                          <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-300">
                            ⚠️ Seguimiento
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={deleteEvent.isPending}
                      >
                        {deleteEvent.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-church-gold" />
                      <span>
                        {eventDate.toLocaleDateString('es-EC', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                        {' '}
                        {eventDate.toLocaleTimeString('es-EC', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    {endDate && (
                      <div className="text-xs text-gray-500">
                        Hasta: {endDate.toLocaleDateString('es-EC')} {endDate.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    {event.location && (
                      <div className="text-gray-600">📍 {event.location}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {showOnlyFollowUp 
              ? 'No hay eventos con seguimiento pendiente.' 
              : 'No hay eventos registrados. Crea uno nuevo para comenzar.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManager;
