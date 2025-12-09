'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Plus, Edit, Trash2, UserPlus, Mail, Phone, Loader2 } from 'lucide-react'
import { useVisitors, useCreateVisitor, useUpdateVisitor, useDeleteVisitor, type Visitor } from '@/lib/queries/visitors'
import { useToast } from '@/hooks/use-toast'

export default function VisitorsManager() {
  const { data: visitors, isLoading } = useVisitors()
  const createVisitor = useCreateVisitor()
  const updateVisitor = useUpdateVisitor()
  const deleteVisitor = useDeleteVisitor()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingVisitorId, setEditingVisitorId] = useState<string | null>(null)
  const [showOnlyFollowUp, setShowOnlyFollowUp] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    visit_date: new Date().toISOString().split('T')[0],
    source: '',
    notes: '',
    followed_up: false,
    follow_up_needed: false,
  })

  // Filtrar visitantes según el toggle
  const filteredVisitors = showOnlyFollowUp 
    ? visitors?.filter(visitor => visitor.follow_up_needed)
    : visitors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const visitorData = {
        full_name: formData.full_name,
        email: formData.email || null,
        phone: formData.phone || null,
        visit_date: formData.visit_date,
        source: formData.source || null,
        interested_in: null,
        notes: formData.notes || null,
        followed_up: formData.followed_up,
        follow_up_needed: formData.follow_up_needed,
      }
      
      if (editingVisitorId) {
        await updateVisitor.mutateAsync({ id: editingVisitorId, updates: visitorData })
        toast({ title: 'Visitante actualizado con éxito' })
        setEditingVisitorId(null)
      } else {
        await createVisitor.mutateAsync(visitorData)
        toast({ title: 'Visitante registrado con éxito' })
      }

      resetForm()
      setShowForm(false)
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el visitante',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      visit_date: new Date().toISOString().split('T')[0],
      source: '',
      notes: '',
      followed_up: false,
      follow_up_needed: false,
    })
  }

  const handleEdit = (visitor: Visitor) => {
    setEditingVisitorId(visitor.id)
    setFormData({
      full_name: visitor.full_name,
      email: visitor.email || '',
      phone: visitor.phone || '',
      visit_date: visitor.visit_date,
      source: visitor.source || '',
      notes: visitor.notes || '',
      followed_up: visitor.followed_up,
      follow_up_needed: visitor.follow_up_needed || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este visitante?')) {
      try {
        await deleteVisitor.mutateAsync(id)
        toast({ title: 'Visitante eliminado con éxito' })
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el visitante',
          variant: 'destructive',
        })
      }
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
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Visitantes</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingVisitorId(null)
            resetForm()
          }}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Visitante
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVisitorId ? 'Editar Visitante' : 'Nuevo Visitante'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit_date">Fecha de Visita</Label>
                  <Input
                    id="visit_date"
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">¿Cómo nos conoció?</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  placeholder="Ej: Redes sociales, Amigo, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
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
                  ⚠️ Requiere seguimiento adicional
                </Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-church-gold hover:bg-church-gold-dark text-white"
                  disabled={createVisitor.isPending || updateVisitor.isPending}
                >
                  {(createVisitor.isPending || updateVisitor.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingVisitorId ? 'Actualizar' : 'Registrar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingVisitorId(null)
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
          title="Mostrar solo visitantes con seguimiento"
          checked={showOnlyFollowUp}
          onChange={(e) => setShowOnlyFollowUp(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="filter_follow_up" className="cursor-pointer font-normal text-sm">
          Mostrar solo visitantes con seguimiento ⚠️
        </Label>
        {showOnlyFollowUp && filteredVisitors && (
          <span className="text-xs text-gray-500">
            ({filteredVisitors.length} visitante{filteredVisitors.length !== 1 ? 's' : ''})
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVisitors && filteredVisitors.length > 0 ? (
          filteredVisitors.map((visitor) => (
            <Card key={visitor.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        {visitor.full_name}
                      </CardTitle>
                      {visitor.follow_up_needed && (
                        <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-300">
                          ⚠️
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Visita: {new Date(visitor.visit_date).toLocaleDateString('es-EC')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(visitor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(visitor.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={deleteVisitor.isPending}
                    >
                      {deleteVisitor.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  {visitor.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>{visitor.email}</span>
                    </div>
                  )}
                  {visitor.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{visitor.phone}</span>
                    </div>
                  )}
                  {visitor.source && (
                    <div className="text-xs text-gray-500">
                      Fuente: {visitor.source}
                    </div>
                  )}
                  {visitor.followed_up && (
                    <div className="text-xs text-green-600">
                      ✓ Seguimiento realizado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {showOnlyFollowUp 
              ? 'No hay visitantes con seguimiento pendiente.' 
              : 'No hay visitantes registrados.'}
          </div>
        )}
      </div>
    </div>
  )
}
