'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Plus, Edit, Trash2, DollarSign, Loader2 } from 'lucide-react'
import { useDonations, useCreateDonation, useUpdateDonation, useDeleteDonation, type Donation } from '@/lib/queries/donations'
import { useToast } from '@/hooks/use-toast'

export default function DonationsManager() {
  const { data: donations, isLoading } = useDonations()
  const createDonation = useCreateDonation()
  const updateDonation = useUpdateDonation()
  const deleteDonation = useDeleteDonation()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingDonationId, setEditingDonationId] = useState<string | null>(null)
  const [showOnlyFollowUp, setShowOnlyFollowUp] = useState(false)
  const [formData, setFormData] = useState({
    donor_name: '',
    amount: '',
    donation_type: 'tithe',
    payment_method: 'cash',
    donation_date: new Date().toISOString().split('T')[0],
    notes: '',
    follow_up_needed: false,
  })

  // Filtrar donaciones según el toggle
  const filteredDonations = showOnlyFollowUp 
    ? donations?.filter(donation => donation.follow_up_needed)
    : donations

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const donationData = {
        donor_name: formData.donor_name || null,
        amount: parseFloat(formData.amount),
        donation_type: formData.donation_type,
        payment_method: formData.payment_method,
        donation_date: formData.donation_date,
        notes: formData.notes || null,
        follow_up_needed: formData.follow_up_needed,
        receipt_number: null,
        created_by: null,
      }
      
      if (editingDonationId) {
        await updateDonation.mutateAsync({ id: editingDonationId, updates: donationData })
        toast({ title: 'Donación actualizada' })
        setEditingDonationId(null)
      } else {
        await createDonation.mutateAsync(donationData)
        toast({ title: 'Donación registrada' })
      }

      resetForm()
      setShowForm(false)
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la donación',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      donor_name: '',
      amount: '',
      donation_type: 'tithe',
      payment_method: 'cash',
      donation_date: new Date().toISOString().split('T')[0],
      notes: '',
      follow_up_needed: false,
    })
  }

  const handleEdit = (donation: Donation) => {
    setEditingDonationId(donation.id)
    setFormData({
      donor_name: donation.donor_name || '',
      amount: donation.amount.toString(),
      donation_type: donation.donation_type || 'tithe',
      payment_method: donation.payment_method || 'cash',
      donation_date: donation.donation_date,
      notes: donation.notes || '',
      follow_up_needed: donation.follow_up_needed || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta donación?')) {
      try {
        await deleteDonation.mutateAsync(id)
        toast({ title: 'Donación eliminada' })
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la donación',
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

  const totalAmount = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Donaciones</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: ${totalAmount.toFixed(2)}
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingDonationId(null)
            resetForm()
          }}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Donación
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDonationId ? 'Editar Donación' : 'Nueva Donación'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donor_name">Donante (Opcional)</Label>
                  <Input
                    id="donor_name"
                    value={formData.donor_name}
                    onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
                    placeholder="Anónimo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donation_type">Tipo</Label>
                  <select
                    id="donation_type"
                    title="Tipo de donación"
                    value={formData.donation_type}
                    onChange={(e) => setFormData({...formData, donation_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="tithe">Diezmo</option>
                    <option value="offering">Ofrenda</option>
                    <option value="mission">Misiones</option>
                    <option value="building">Construcción</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_method">Método de Pago</Label>
                  <select
                    id="payment_method"
                    title="Método de pago"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="transfer">Transferencia</option>
                    <option value="pix">PIX</option>
                    <option value="card">Tarjeta</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donation_date">Fecha</Label>
                  <Input
                    id="donation_date"
                    type="date"
                    value={formData.donation_date}
                    onChange={(e) => setFormData({...formData, donation_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
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
                  ⚠️ Requiere seguimiento (ej: recibo pendiente, agradecimiento)
                </Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-church-gold hover:bg-church-gold-dark text-white"
                  disabled={createDonation.isPending || updateDonation.isPending}
                >
                  {(createDonation.isPending || updateDonation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingDonationId ? 'Actualizar' : 'Registrar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingDonationId(null)
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
          title="Mostrar solo donaciones con seguimiento"
          checked={showOnlyFollowUp}
          onChange={(e) => setShowOnlyFollowUp(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="filter_follow_up" className="cursor-pointer font-normal text-sm">
          Mostrar solo donaciones con seguimiento ⚠️
        </Label>
        {showOnlyFollowUp && filteredDonations && (
          <span className="text-xs text-gray-500">
            ({filteredDonations.length} donación{filteredDonations.length !== 1 ? 'es' : ''})
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonations && filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <Card key={donation.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        ${Number(donation.amount).toFixed(2)}
                      </CardTitle>
                      {donation.follow_up_needed && (
                        <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-300">
                          ⚠️
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(donation.donation_date).toLocaleDateString('es-EC')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(donation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(donation.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={deleteDonation.isPending}
                    >
                      {deleteDonation.isPending ? (
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
                  <div className="text-gray-600">
                    {donation.donation_type === 'tithe' && 'Diezmo'}
                    {donation.donation_type === 'offering' && 'Ofrenda'}
                    {donation.donation_type === 'mission' && 'Misiones'}
                    {donation.donation_type === 'building' && 'Construcción'}
                    {donation.donation_type === 'other' && 'Otro'}
                  </div>
                  {donation.donor_name && (
                    <div className="text-xs text-gray-500">
                      De: {donation.donor_name}
                    </div>
                  )}
                  {donation.payment_method && (
                    <div className="text-xs text-gray-500">
                      Pago: {donation.payment_method}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {showOnlyFollowUp 
              ? 'No hay donaciones con seguimiento pendiente.' 
              : 'No hay donaciones registradas.'}
          </div>
        )}
      </div>
    </div>
  )
}
