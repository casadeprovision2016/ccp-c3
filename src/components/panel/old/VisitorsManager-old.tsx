
import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import { Plus, Edit, Trash2, UserPlus, Phone, Mail } from 'lucide-react';

interface Visitor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  visitDate: string;
  reason: string;
  notes?: string;
  followUpDate?: string;
  contacted: boolean;
}

const VisitorsManager = () => {
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const storedVisitors = localStorage.getItem('visitors');
    return storedVisitors ? JSON.parse(storedVisitors) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visitDate: '',
    reason: '',
    notes: '',
    followUpDate: '',
    contacted: false
  });

  const saveVisitors = (newVisitors: Visitor[]) => {
    setVisitors(newVisitors);
    localStorage.setItem('visitors', JSON.stringify(newVisitors));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVisitor) {
      const updatedVisitors = visitors.map(visitor => 
        visitor.id === editingVisitor.id 
          ? { ...editingVisitor, ...formData }
          : visitor
      );
      saveVisitors(updatedVisitors);
      setEditingVisitor(null);
    } else {
      const newVisitor: Visitor = {
        id: Date.now().toString(),
        ...formData
      };
      saveVisitors([...visitors, newVisitor]);
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      visitDate: '',
      reason: '',
      notes: '',
      followUpDate: '',
      contacted: false
    });
    setShowForm(false);
  };

  const handleEdit = (visitor: Visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      name: visitor.name,
      email: visitor.email || '',
      phone: visitor.phone || '',
      visitDate: visitor.visitDate,
      reason: visitor.reason,
      notes: visitor.notes || '',
      followUpDate: visitor.followUpDate || '',
      contacted: visitor.contacted
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este visitante?')) {
      const updatedVisitors = visitors.filter(visitor => visitor.id !== id);
      saveVisitors(updatedVisitors);
    }
  };

  const filteredVisitors = visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Visitantes</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar visitantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button
            onClick={() => setShowForm(true)}
            className="bg-church-gold hover:bg-church-gold-dark text-white whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Visitante
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingVisitor ? 'Editar Visitante' : 'Nuevo Visitante'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Fecha de Visita</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo de la Visita</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Primera visita, invitación de un amigo, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  placeholder="Información adicional sobre el visitante..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Fecha de Seguimiento</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="contacted"
                    checked={formData.contacted}
                    onChange={(e) => setFormData({...formData, contacted: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="contacted">Ya fue contactado</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-church-gold hover:bg-church-gold-dark text-white">
                  {editingVisitor ? 'Actualizar' : 'Registrar'} Visitante
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingVisitor(null);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      visitDate: '',
                      reason: '',
                      notes: '',
                      followUpDate: '',
                      contacted: false
                    });
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
        {filteredVisitors.map((visitor) => (
          <Card key={visitor.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-church-gold" />
                  <CardTitle className="text-lg">{visitor.name}</CardTitle>
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className={`inline-block px-2 py-1 rounded text-xs text-white ${
                visitor.contacted ? 'bg-green-600' : 'bg-yellow-600'
              }`}>
                {visitor.contacted ? 'Contactado' : 'Pendiente contacto'}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Fecha de visita:</strong> {visitor.visitDate}
              </div>
              <div className="text-sm">
                <strong>Motivo:</strong> {visitor.reason}
              </div>
              {visitor.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-church-gold" />
                  <span className="truncate">{visitor.email}</span>
                </div>
              )}
              {visitor.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-church-gold" />
                  <span>{visitor.phone}</span>
                </div>
              )}
              {visitor.followUpDate && (
                <div className="text-sm text-gray-600">
                  <strong>Seguimiento:</strong> {visitor.followUpDate}
                </div>
              )}
              {visitor.notes && (
                <div className="text-sm text-gray-600">
                  <strong>Notas:</strong> {visitor.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVisitors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron visitantes que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
};

export default VisitorsManager;
