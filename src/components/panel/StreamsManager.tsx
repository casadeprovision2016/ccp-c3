'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Plus, Edit, Trash2, Video, Loader2, ExternalLink } from 'lucide-react'
import { useStreams, useCreateStream, useUpdateStream, useDeleteStream, type Stream } from '@/lib/queries/streams'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

const StreamsManager = () => {
  const { data: streams, isLoading } = useStreams()
  const createStream = useCreateStream()
  const updateStream = useUpdateStream()
  const deleteStream = useDeleteStream()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingStreamId, setEditingStreamId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stream_url: '',
    platform: 'youtube',
    scheduled_date: '',
    status: 'scheduled' as 'scheduled' | 'live' | 'completed',
    thumbnail_url: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const scheduledDateTime = new Date(formData.scheduled_date).toISOString()

      const streamData = {
        title: formData.title,
        description: formData.description || null,
        stream_url: formData.stream_url,
        platform: formData.platform,
        scheduled_date: scheduledDateTime,
        status: formData.status,
        thumbnail_url: formData.thumbnail_url || null,
        created_by: null,
      }
      
      if (editingStreamId) {
        await updateStream.mutateAsync({ id: editingStreamId, updates: streamData })
        toast({ title: 'Transmisión actualizada con éxito' })
        setEditingStreamId(null)
      } else {
        await createStream.mutateAsync(streamData)
        toast({ title: 'Transmisión creada con éxito' })
      }

      resetForm()
      setShowForm(false)
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la transmisión',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      stream_url: '',
      platform: 'youtube',
      scheduled_date: '',
      status: 'scheduled',
      thumbnail_url: '',
    })
  }

  const handleEdit = (stream: Stream) => {
    setEditingStreamId(stream.id)
    
    const scheduledDate = new Date(stream.scheduled_date)
    
    setFormData({
      title: stream.title,
      description: stream.description || '',
      stream_url: stream.stream_url,
      platform: stream.platform || 'youtube',
      scheduled_date: scheduledDate.toISOString().slice(0, 16),
      status: (stream.status as 'scheduled' | 'live' | 'completed') || 'scheduled',
      thumbnail_url: stream.thumbnail_url || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta transmisión?')) {
      try {
        await deleteStream.mutateAsync(id)
        toast({ title: 'Transmisión eliminada con éxito' })
      } catch {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la transmisión',
          variant: 'destructive',
        })
      }
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return '🎥 YouTube'
      case 'facebook': return '👥 Facebook'
      case 'instagram': return '📷 Instagram'
      case 'zoom': return '💻 Zoom'
      case 'other': return '📡 Otra plataforma'
      default: return platform
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-600'
      case 'scheduled': return 'bg-church-gold'
      case 'completed': return 'bg-gray-600'
      case 'cancelled': return 'bg-gray-400'
      default: return 'bg-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'En vivo'
      case 'scheduled': return 'Programado'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
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
        <h2 className="text-2xl font-bold text-church-blue-dark">Gestión de Transmisiones</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingStreamId(null)
            resetForm()
          }}
          className="bg-church-gold hover:bg-church-gold-dark text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Transmisión
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingStreamId ? 'Editar Transmisión' : 'Nueva Transmisión'}
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
                  <Label htmlFor="platform">Plataforma</Label>
                  <select
                    id="platform"
                    title="Plataforma de transmisión"
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="zoom">Zoom</option>
                    <option value="other">Otra</option>
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
                  <Label htmlFor="stream_url">URL de Transmisión</Label>
                  <Input
                    id="stream_url"
                    type="url"
                    value={formData.stream_url}
                    onChange={(e) => setFormData({...formData, stream_url: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">URL Miniatura (Opcional)</Label>
                  <Input
                    id="thumbnail_url"
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Fecha y Hora Programada</Label>
                  <Input
                    id="scheduled_date"
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    title="Estado de la transmisión"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'scheduled' | 'live' | 'completed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="live">En vivo</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-church-gold hover:bg-church-gold-dark text-white"
                  disabled={createStream.isPending || updateStream.isPending}
                >
                  {(createStream.isPending || updateStream.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingStreamId ? 'Actualizar' : 'Crear'} Transmisión
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingStreamId(null)
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
        {streams && streams.length > 0 ? (
          streams.map((stream) => {
            const scheduledDate = new Date(stream.scheduled_date)
            
            return (
              <Card key={stream.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`inline-block px-2 py-1 rounded text-xs text-white ${getStatusColor(stream.status || 'scheduled')}`}>
                          {getStatusLabel(stream.status || 'scheduled')}
                        </div>
                        {stream.status === 'live' && (
                          <span className="animate-pulse">🔴</span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{stream.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(stream)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(stream.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={deleteStream.isPending}
                      >
                        {deleteStream.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {stream.thumbnail_url && (
                    <Image 
                      src={stream.thumbnail_url} 
                      alt={stream.title}
                      width={320}
                      height={180}
                      className="rounded-lg mb-3"
                    />
                  )}
                  {stream.description && (
                    <p className="text-gray-600 text-sm mb-3">{stream.description}</p>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-church-gold" />
                      <span>{getPlatformIcon(stream.platform || 'other')}</span>
                    </div>
                    <div className="text-gray-600">
                      📅 {scheduledDate.toLocaleDateString('es-EC', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                      {' '}
                      {scheduledDate.toLocaleTimeString('es-EC', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <a 
                      href={stream.stream_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-church-blue hover:text-church-blue-dark"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver transmisión
                    </a>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay transmisiones registradas. Crea una nueva para comenzar.
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamsManager;
