'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Plus, Edit, Trash2, User, Mail, Phone, Loader2 } from 'lucide-react'
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember, type Member } from '@/lib/queries/members'
import { useToast } from '@/hooks/use-toast'

export default function MembersManager() {
  const { data: members, isLoading } = useMembers()
  const createMember = useCreateMember()
  const updateMember = useUpdateMember()
  const deleteMember = useDeleteMember()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    baptism_date: '',
    membership_date: '',
    status: 'active' as 'active' | 'inactive',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const memberData = {
        full_name: formData.full_name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        birth_date: formData.birth_date || null,
        baptism_date: formData.baptism_date || null,
        membership_date: formData.membership_date || null,
        status: formData.status,
        notes: formData.notes || null,
      }
      
      if (editingMemberId) {
        await updateMember.mutateAsync({ id: editingMemberId, updates: memberData })
        toast({ title: 'Miembro actualizado con éxito' })
        setEditingMemberId(null)
      } else {
        await createMember.mutateAsync(memberData)
        toast({ title: 'Miembro creado con éxito' })
      }

      resetForm()
      setShowForm(false)
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el miembro',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      birth_date: '',
      baptism_date: '',
      membership_date: '',
      status: 'active',
      notes: '',
    })
  }

  const handleEdit = (member: Member) => {
    setEditingMemberId(member.id)
    setFormData({
      full_name: member.full_name,
      email: member.email || '',
      phone: member.phone || '',
      address: member.address || '',
      birth_date: member.birth_date || '',
      baptism_date: member.baptism_date || '',
      membership_date: member.membership_date || '',
      status: (member.status as 'active' | 'inactive') || 'active',
      notes: member.notes || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
      try {
        await deleteMember.mutateAsync(id)
        toast({ title: 'Miembro eliminado con éxito' })
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el miembro',
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
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Miembros</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingMemberId(null)
            resetForm()
          }}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Miembro
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingMemberId ? 'Editar Miembro' : 'Nuevo Miembro'}</CardTitle>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    title="Estado"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="transferred">Transferido</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baptism_date">Fecha de Bautismo</Label>
                  <Input
                    id="baptism_date"
                    type="date"
                    value={formData.baptism_date}
                    onChange={(e) => setFormData({...formData, baptism_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membership_date">Fecha de Membresía</Label>
                  <Input
                    id="membership_date"
                    type="date"
                    value={formData.membership_date}
                    onChange={(e) => setFormData({...formData, membership_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-church-gold hover:bg-church-gold-dark text-white"
                  disabled={createMember.isPending || updateMember.isPending}
                >
                  {(createMember.isPending || updateMember.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingMemberId ? 'Actualizar' : 'Crear'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingMemberId(null)
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
        {members && members.length > 0 ? (
          members.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {member.full_name}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      {member.status === 'active' ? '✓ Activo' : '○ Inactivo'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={deleteMember.isPending}
                    >
                      {deleteMember.isPending ? (
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
                  {member.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.birth_date && (
                    <div className="text-xs text-gray-500">
                      🎂 {new Date(member.birth_date).toLocaleDateString('es-EC')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay miembros registrados. Crea uno nuevo para comenzar.
          </div>
        )}
      </div>
    </div>
  )
}
