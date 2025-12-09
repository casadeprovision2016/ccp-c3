import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';
import { Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';

interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  members: string[];
  schedule: string;
  status: 'active' | 'inactive';
}

const MinistriesManager = () => {
  const [ministries, setMinistries] = useState<Ministry[]>(() => {
    const storedMinistries = localStorage.getItem('ministries');
    if (storedMinistries) {
      return JSON.parse(storedMinistries);
    } else {
      const exampleMinistries: Ministry[] = [
        {
          id: '1',
          name: 'Ministerio de Adoración',
          description: 'Responsable de dirigir la adoración en los cultos y eventos especiales',
          leader: 'María González',
          members: ['María González', 'Juan Pérez', 'Ana López'],
          schedule: 'Domingos 8:30 AM, Ensayos Sábados 6:00 PM',
          status: 'active'
        },
        {
          id: '2',
          name: 'Ministerio de Jóvenes',
          description: 'Enfocado en el crecimiento espiritual y social de los jóvenes',
          leader: 'Carlos Rivera',
          members: ['Carlos Rivera', 'Sofía Martín', 'Diego Torres'],
          schedule: 'Viernes 7:00 PM',
          status: 'active'
        }
      ];
      localStorage.setItem('ministries', JSON.stringify(exampleMinistries));
      return exampleMinistries;
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: '',
    schedule: '',
    status: 'active' as 'active' | 'inactive'
  });

  const saveMinistries = (newMinistries: Ministry[]) => {
    setMinistries(newMinistries);
    localStorage.setItem('ministries', JSON.stringify(newMinistries));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMinistry) {
      const updatedMinistries = ministries.map(ministry => 
        ministry.id === editingMinistry.id 
          ? { ...editingMinistry, ...formData, members: editingMinistry.members }
          : ministry
      );
      saveMinistries(updatedMinistries);
      setEditingMinistry(null);
    } else {
      const newMinistry: Ministry = {
        id: Date.now().toString(),
        ...formData,
        members: []
      };
      saveMinistries([...ministries, newMinistry]);
    }

    setFormData({
      name: '',
      description: '',
      leader: '',
      schedule: '',
      status: 'active'
    });
    setShowForm(false);
  };

  const handleEdit = (ministry: Ministry) => {
    setEditingMinistry(ministry);
    setFormData({
      name: ministry.name,
      description: ministry.description,
      leader: ministry.leader,
      schedule: ministry.schedule,
      status: ministry.status
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ministerio?')) {
      const updatedMinistries = ministries.filter(ministry => ministry.id !== id);
      saveMinistries(updatedMinistries);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Ministerios</h2>
        <Button
          onClick={() => setShowForm(true)}
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
              {editingMinistry ? 'Editar Ministerio' : 'Nuevo Ministerio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Ministerio</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leader">Líder</Label>
                  <Input
                    id="leader"
                    value={formData.leader}
                    onChange={(e) => setFormData({...formData, leader: e.target.value})}
                    required
                  />
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
                  <Label htmlFor="schedule">Horario</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    placeholder="ej: Domingos 9:00 AM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-church-gold hover:bg-church-gold-dark text-white">
                  {editingMinistry ? 'Actualizar' : 'Crear'} Ministerio
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingMinistry(null);
                    setFormData({
                      name: '',
                      description: '',
                      leader: '',
                      schedule: '',
                      status: 'active'
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
        {ministries.map((ministry) => (
          <Card key={ministry.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{ministry.name}</CardTitle>
                  <div className={`inline-block px-2 py-1 rounded text-xs text-white mt-2 ${
                    ministry.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {ministry.status === 'active' ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
                <div className="flex gap-1">
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600 text-sm">{ministry.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-church-gold" />
                  <span><strong>Líder:</strong> {ministry.leader}</span>
                </div>
                
                {ministry.schedule && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-church-gold" />
                    <span>{ministry.schedule}</span>
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <strong>Miembros:</strong> {ministry.members.length}
                  {ministry.members.length > 0 && (
                    <div className="mt-1 text-xs">
                      {ministry.members.slice(0, 3).join(', ')}
                      {ministry.members.length > 3 && ` y ${ministry.members.length - 3} más`}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MinistriesManager;
