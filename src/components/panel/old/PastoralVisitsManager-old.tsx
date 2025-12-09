
import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import { Plus, Edit, Trash2, User, Calendar } from 'lucide-react';

interface PastoralVisit {
  id: string;
  date: string;
  visitedPerson: string;
  visitType: string;
  reason: string;
  notes: string;
  followUpNeeded: boolean;
  followUpDate?: string;
}

const PastoralVisitsManager = () => {
  const [visits, setVisits] = useState<PastoralVisit[]>(() => {
    const storedVisits = localStorage.getItem('pastoralVisits');
    return storedVisits ? JSON.parse(storedVisits) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState<PastoralVisit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    visitedPerson: '',
    visitType: 'domicilio',
    reason: '',
    notes: '',
    followUpNeeded: false,
    followUpDate: ''
  });

  const saveVisits = (newVisits: PastoralVisit[]) => {
    setVisits(newVisits);
    localStorage.setItem('pastoralVisits', JSON.stringify(newVisits));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVisit) {
      const updatedVisits = visits.map(visit => 
        visit.id === editingVisit.id 
          ? { ...editingVisit, ...formData }
          : visit
      );
      saveVisits(updatedVisits);
      setEditingVisit(null);
    } else {
      const newVisit: PastoralVisit = {
        id: Date.now().toString(),
        ...formData
      };
      saveVisits([...visits, newVisit]);
    }

    setFormData({
      date: '',
      visitedPerson: '',
      visitType: 'domicilio',
      reason: '',
      notes: '',
      followUpNeeded: false,
      followUpDate: ''
    });
    setShowForm(false);
  };

  const handleEdit = (visit: PastoralVisit) => {
    setEditingVisit(visit);
    setFormData({
      date: visit.date,
      visitedPerson: visit.visitedPerson,
      visitType: visit.visitType,
      reason: visit.reason,
      notes: visit.notes,
      followUpNeeded: visit.followUpNeeded,
      followUpDate: visit.followUpDate || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro de visita?')) {
      const updatedVisits = visits.filter(visit => visit.id !== id);
      saveVisits(updatedVisits);
    }
  };

  const filteredVisits = visits.filter(visit =>
    visit.visitedPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVisitTypeColor = (type: string) => {
    switch (type) {
      case 'domicilio': return 'bg-blue-600';
      case 'hospital': return 'bg-red-600';
      case 'oficina': return 'bg-green-600';
      case 'telefonica': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-church-blue-dark">Visitas Pastorales</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar visitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button
            onClick={() => setShowForm(true)}
            className="bg-church-gold hover:bg-church-gold-dark text-white whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Visita
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingVisit ? 'Editar Visita Pastoral' : 'Nueva Visita Pastoral'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha de la Visita</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitType">Tipo de Visita</Label>
                  <select
                    id="visitType"
                    value={formData.visitType}
                    onChange={(e) => setFormData({...formData, visitType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="domicilio">Visita a Domicilio</option>
                    <option value="hospital">Visita Hospital</option>
                    <option value="oficina">Reunión en Oficina</option>
                    <option value="telefonica">Llamada Telefónica</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitedPerson">Persona o Familia Visitada</Label>
                <Input
                  id="visitedPerson"
                  value={formData.visitedPerson}
                  onChange={(e) => setFormData({...formData, visitedPerson: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo de la Visita</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Consejería, enfermedad, celebración, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Pastorales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  placeholder="Detalles de la visita, oración realizada, necesidades identificadas..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="followUpNeeded"
                    checked={formData.followUpNeeded}
                    onChange={(e) => setFormData({...formData, followUpNeeded: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="followUpNeeded">Requiere seguimiento</Label>
                </div>
                {formData.followUpNeeded && (
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Fecha de Seguimiento</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-church-gold hover:bg-church-gold-dark text-white">
                  {editingVisit ? 'Actualizar' : 'Registrar'} Visita
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingVisit(null);
                    setFormData({
                      date: '',
                      visitedPerson: '',
                      visitType: 'domicilio',
                      reason: '',
                      notes: '',
                      followUpNeeded: false,
                      followUpDate: ''
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

      <div className="grid md:grid-cols-2 gap-4">
        {filteredVisits.map((visit) => (
          <Card key={visit.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-church-gold" />
                    {visit.visitedPerson}
                  </CardTitle>
                  <div className={`inline-block px-2 py-1 rounded text-xs text-white mt-2 ${getVisitTypeColor(visit.visitType)}`}>
                    {visit.visitType}
                  </div>
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-church-gold" />
                <span>{visit.date}</span>
              </div>
              <div className="text-sm">
                <strong>Motivo:</strong> {visit.reason}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Notas:</strong> {visit.notes}
              </div>
              {visit.followUpNeeded && (
                <div className="text-sm text-orange-600">
                  <strong>Seguimiento:</strong> {visit.followUpDate || 'Fecha pendiente'}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVisits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron visitas que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
};

export default PastoralVisitsManager;
