'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, Calendar, Users, Settings, Home, Video, DollarSign, UserPlus, User } from 'lucide-react'
import EventsManager from '@/components/panel/EventsManager'
import MembersManager from '@/components/panel/MembersManager'
import MinistriesManager from '@/components/panel/MinistriesManager'
import StreamsManager from '@/components/panel/StreamsManager'
import DonationsManager from '@/components/panel/DonationsManager'
import VisitorsManager from '@/components/panel/VisitorsManager'
import PastoralVisitsManager from '@/components/panel/PastoralVisitsManager'
import BirthdaysList from '@/components/panel/BirthdaysList'
import FollowUpWidget from '@/components/panel/FollowUpWidget'
import Image from 'next/image'
import { useDashboardStats } from '@/lib/queries/dashboard'

export default function PanelPage() {
  const { profile, signOut, loading } = useAuth()
  const { data: stats, isLoading: loadingStats } = useDashboardStats()
  const [activeSection, setActiveSection] = useState('dashboard')
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'events', name: 'Eventos', icon: Calendar },
    { id: 'streams', name: 'Transmisiones', icon: Video },
    { id: 'donations', name: 'Donaciones', icon: DollarSign },
    { id: 'members', name: 'Miembros', icon: Users },
    { id: 'visitors', name: 'Visitantes', icon: UserPlus },
    { id: 'pastoral-visits', name: 'Visitas Pastorales', icon: User },
    { id: 'ministries', name: 'Ministerios', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <EventsManager />
      case 'streams':
        return <StreamsManager />
      case 'donations':
        return <DonationsManager />
      case 'members':
        return <MembersManager />
      case 'visitors':
        return <VisitorsManager />
      case 'pastoral-visits':
        return <PastoralVisitsManager />
      case 'ministries':
        return <MinistriesManager />
      default:
        return (
          <div className="space-y-6">
            {/* Widget de Seguimiento - OBRIGATÓRIO */}
            <FollowUpWidget />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-church-blue-dark">Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-church-gold">
                    {loadingStats ? '...' : stats?.eventsThisMonth || 0}
                  </p>
                  <p className="text-gray-600">Eventos este mes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-church-blue-dark">Miembros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-church-gold">
                    {loadingStats ? '...' : stats?.activeMembers || 0}
                  </p>
                  <p className="text-gray-600">Miembros registrados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-church-blue-dark">Visitantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-church-gold">
                    {loadingStats ? '...' : stats?.visitorsThisMonth || 0}
                  </p>
                  <p className="text-gray-600">Visitantes este mes</p>
                </CardContent>
              </Card>
            </div>
            <BirthdaysList />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
                <Image 
                  src="/favicon.svg"
                  alt="Centro Cristiano Casa de Provisión"
                  width={32} height={32}
                  className="h-8 w-auto"
                  priority
                />
              <h1 className="text-xl font-semibold text-church-blue-dark">
                Panel Administrativo
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Bienvenido, {profile?.name} ({profile?.role})
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-church-blue text-church-blue hover:bg-church-blue hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeSection === section.id 
                      ? 'bg-church-gold text-white hover:bg-church-gold-dark' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.name}
                </Button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
