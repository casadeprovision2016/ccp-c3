'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Plus, Edit, Trash2, Calendar, Loader2, UserCheck, Users } from 'lucide-react'
import { usePastoralVisits, useCreatePastoralVisit, useUpdatePastoralVisit, useDeletePastoralVisit, type PastoralVisit } from '@/lib/queries/pastoral-visits'
import { useMembers } from '@/lib/queries/members'
import { useVisitors } from '@/lib/queries/visitors'
import { useToast } from '@/hooks/use-toast'

const PastoralVisitsManager = () => {
  const { data: visits, isLoading } = usePastoralVisits()
  const { data: members } = useMembers()
  const { data: visitors } = useVisitors()
  const createVisit = useCreatePastoralVisit()
  const updateVisit = useUpdatePastoralVisit()
  const deleteVisit = useDeletePastoralVisit()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    member_id: '',
    visitor_id: '',
    visit_date: '',
    visit_type: 'home',
    notes: '',
    follow_up_needed: false,
    status: 'completed' as 'pending' | 'completed' | 'cancelled',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const visitDateTime = new Date(formData.visit_date).toISOString()

      const visitData = {
        member_id: formData.member_id || null,
        visitor_id: formData.visitor_id || null,
        visit_date: visitDateTime,
        visit_type: formData.visit_type,
        pastor_id: null,
        notes: formData.notes || null,
        follow_up_needed: formData.follow_up_needed,
        status: formData.status,
      }
      
      if (editingVisitId) {
        await updateVisit.mutateAsync({ id: editingVisitId, updates: visitData })
        toast({ title: 'Visita actualizada con éxito' })
        setEditingVisitId(null)
      } else {
        await createVisit.mutateAsync(visitData)
        toast({ title: 'Visita creada con éxito' })
      }

      resetForm()
      setShowForm(false)
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la visita',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      member_id: '',
      visitor_id: '',
      visit_date: '',
      visit_type: 'home',
      notes: '',
      follow_up_needed: false,
      status: 'completed',
    })
  }

  const handleEdit = (visit: PastoralVisit) => {
    setEditingVisitId(visit.id)
    
    const visitDate = new Date(visit.visit_date)
    
    setFormData({
      member_id: visit.member_id || '',
      visitor_id: visit.visitor_id || '',
      visit_date: visitDate.toISOString().slice(0, 16),
      visit_type: visit.visit_type || 'home',
      notes: visit.notes || '',
      follow_up_needed: visit.follow_up_needed || false,
      status: (visit.status as 'pending' | 'completed' | 'cancelled') || 'completed',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta visita?')) {
      try {
        await deleteVisit.mutateAsync(id)
        toast({ title: 'Visita eliminada con éxito' })
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la visita',
          variant: 'destructive',
        })
      }
    }
  }

  const getVisitTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return '🏠 Casa'
      case 'hospital': return '🏥 Hospital'
      case 'phone': return '📞 Teléfono'
      case 'office': return '🏢 Oficina'
      case 'other': return '📍 Otro'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-church-gold'
      case 'completed': return 'bg-green-600'
      case 'cancelled': return 'bg-gray-400'
      default: return 'bg-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programado'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getMemberName = (memberId: string | null) => {
    if (!memberId) return null
    const member = members?.find(m => m.id === memberId)
    return member?.full_name
  }

  const getVisitorName = (visitorId: string | null) => {
    if (!visitorId) return null
    const visitor = visitors?.find(v => v.id === visitorId)
    return visitor?.full_name
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
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Visitas Pastorales</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingVisitId(null)
            resetForm()
          }}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Visita
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingVisitId ? 'Editar Visita' : 'Nueva Visita'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member_id">Miembro (opcional)</Label>
                  <select
                    id="member_id"
                    title="Seleccionar miembro"
                    value={formData.member_id}
                    onChange={(e) => setFormData({...formData, member_id: e.target.value, visitor_id: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Seleccionar miembro --</option>
                    {members?.map(member => (
                      <option key={member.id} value={member.id}>{member.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitor_id">Visitante (opcional)</Label>
                  <select
                    id="visitor_id"
                    title="Seleccionar visitante"
                    value={formData.visitor_id}
                    onChange={(e) => setFormData({...formData, visitor_id: e.target.value, member_id: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={!!formData.member_id}
                  >
                    <option value="">-- Seleccionar visitante --</option>
                    {visitors?.map(visitor => (
                      <option key={visitor.id} value={visitor.id}>{visitor.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visit_date">Fecha y Hora</Label>
                  <Input
                    id="visit_date"
                    type="datetime-local"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit_type">Tipo de Visita</Label>
                  <select
                    id="visit_type"
                    title="Tipo de visita"
                    value={formData.visit_type}
                    onChange={(e) => setFormData({...formData, visit_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="home">Casa</option>
                    <option value="hospital">Hospital</option>
                    <option value="phone">Teléfono</option>
                    <option value="office">Oficina</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    title="Estado de la visita"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'pending' | 'completed' | 'cancelled'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  placeholder="Observaciones, motivos, resultado de la visita..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="follow_up_needed"
                  title="Requiere seguimiento"
                  checked={formData.follow_up_needed}
                  onChange={(e) => setFormData({...formData, follow_up_needed: e.target.checked})}
                  className="w-4 h-4"
                />
                <Label htmlFor="follow_up_needed" className="cursor-pointer">
                  Requiere seguimiento
                </Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-church-gold hover:bg-church-gold-dark text-white"
                  disabled={createVisit.isPending || updateVisit.isPending}
                >
                  {(createVisit.isPending || updateVisit.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingVisitId ? 'Actualizar' : 'Crear'} Visita
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingVisitId(null)
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visits && visits.length > 0 ? (
          visits.map((visit) => {
            const visitDate = new Date(visit.visit_date)
            const memberName = getMemberName(visit.member_id)
            const visitorName = getVisitorName(visit.visitor_id)
            
            return (
              <Card key={visit.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`inline-block px-2 py-1 rounded text-xs text-white ${getStatusColor(visit.status || 'completed')}`}>
                          {getStatusLabel(visit.status || 'completed')}
                        </div>
                        {visit.follow_up_needed && (
                          <span className="inline-block px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                            ⚠️ Seguimiento
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {memberName ? (
                          <>
                            <UserCheck className="h-4 w-4 text-church-gold" />
                            {memberName}
                          </>
                        ) : visitorName ? (
                          <>
                            <Users className="h-4 w-4 text-church-blue" />
                            {visitorName}
                          </>
                        ) : (
                          <span className="text-gray-500">Sin persona asignada</span>
                        )}
                      </CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(visit)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(visit.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={deleteVisit.isPending}
                      >
                        {deleteVisit.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-church-gold" />
                      <span>
                        {visitDate.toLocaleDateString('es-EC', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                        {' '}
                        {visitDate.toLocaleTimeString('es-EC', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      {getVisitTypeLabel(visit.visit_type || 'other')}
                    </div>
                    {visit.notes && (
                      <p className="text-gray-600 mt-3 p-2 bg-gray-50 rounded text-sm">
                        {visit.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay visitas registradas. Crea una nueva para comenzar.
          </div>
        )}
      </div>
    </div>
  );
};

export default PastoralVisitsManager;
