'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Plus, Edit, Trash2, Users, Loader2, Clock } from 'lucide-react'
import { useMinistries, useCreateMinistry, useUpdateMinistry, useDeleteMinistry, type Ministry } from '@/lib/queries/ministries'
import { useMembers } from '@/lib/queries/members'
import { useToast } from '@/hooks/use-toast'

const MinistriesManager = () => {
  const { data: ministries, isLoading } = useMinistries()
  const { data: members } = useMembers()
  const createMinistry = useCreateMinistry()
  const updateMinistry = useUpdateMinistry()
  const deleteMinistry = useDeleteMinistry()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingMinistryId, setEditingMinistryId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader_id: '',
    meeting_schedule: '',
    status: 'active' as 'active' | 'inactive',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const ministryData = {
        name: formData.name,
        description: formData.description || null,
        leader_id: formData.leader_id || null,
        meeting_schedule: formData.meeting_schedule || null,
        status: formData.status,
      }
      
      if (editingMinistryId) {
        await updateMinistry.mutateAsync({ id: editingMinistryId, updates: ministryData })
        toast({ title: 'Ministerio actualizado con éxito' })
        setEditingMinistryId(null)
      } else {
        await createMinistry.mutateAsync(ministryData)
        toast({ title: 'Ministerio creado con éxito' })
      }

      resetForm()
      setShowForm(false)
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el ministerio',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      leader_id: '',
      meeting_schedule: '',
      status: 'active',
    })
  }

  const handleEdit = (ministry: Ministry) => {
    setEditingMinistryId(ministry.id)
    
    setFormData({
      name: ministry.name,
      description: ministry.description || '',
      leader_id: ministry.leader_id || '',
      meeting_schedule: ministry.meeting_schedule || '',
      status: (ministry.status as 'active' | 'inactive') || 'active',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ministerio?')) {
      try {
        await deleteMinistry.mutateAsync(id)
        toast({ title: 'Ministerio eliminado con éxito' })
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el ministerio',
          variant: 'destructive',
        })
      }
    }
  }

  const getLeaderName = (leaderId: string | null) => {
    if (!leaderId) return 'Sin líder asignado'
    const leader = members?.find(m => m.id === leaderId)
    return leader?.full_name || 'Sin líder asignado'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600'
      case 'inactive': return 'bg-gray-400'
      case 'planning': return 'bg-church-gold'
      default: return 'bg-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'planning': return 'En planificación'
      default: return status
    }
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
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Ministerios</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingMinistryId(null)
            resetForm()
          }}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ministerio
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingMinistryId ? 'Editar Ministerio' : 'Nuevo Ministerio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Ministerio</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Alabanza, Intercesión, Jóvenes..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leader_id">Líder</Label>
                  <select
                    id="leader_id"
                    title="Seleccionar líder"
                    value={formData.leader_id}
                    onChange={(e) => setFormData({...formData, leader_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Seleccionar líder --</option>
                    {members?.map(member => (
                      <option key={member.id} value={member.id}>{member.full_name}</option>
                    ))}
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
                  placeholder="Propósito, actividades, alcance del ministerio..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting_schedule">Horario de Reuniones</Label>
                  <Input
                    id="meeting_schedule"
                    value={formData.meeting_schedule}
                    onChange={(e) => setFormData({...formData, meeting_schedule: e.target.value})}
                    placeholder="Ej: Jueves 7:00 PM, Domingos después del culto..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    title="Estado del ministerio"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Activo</option>
                    <option value="planning">En planificación</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-church-gold hover:bg-church-gold-dark text-white"
                  disabled={createMinistry.isPending || updateMinistry.isPending}
                >
                  {(createMinistry.isPending || updateMinistry.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingMinistryId ? 'Actualizar' : 'Crear'} Ministerio
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingMinistryId(null)
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
        {ministries && ministries.length > 0 ? (
          ministries.map((ministry) => {
            const leaderName = getLeaderName(ministry.leader_id)
            
            return (
              <Card key={ministry.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`inline-block px-2 py-1 rounded text-xs text-white ${getStatusColor(ministry.status || 'active')}`}>
                          {getStatusLabel(ministry.status || 'active')}
                        </div>
                      </div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-church-gold flex-shrink-0" />
                        <span className="line-clamp-2">{ministry.name}</span>
                      </CardTitle>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(ministry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(ministry.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={deleteMinistry.isPending}
                      >
                        {deleteMinistry.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {ministry.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{ministry.description}</p>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-church-blue">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">{leaderName}</span>
                    </div>
                    {ministry.meeting_schedule && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{ministry.meeting_schedule}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay ministerios registrados. Crea uno nuevo para comenzar.
          </div>
        )}
      </div>
    </div>
  );
};

export default MinistriesManager;
