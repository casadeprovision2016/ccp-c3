'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { useMembers } from '@/lib/queries/members'
import { Loader2, Cake } from 'lucide-react'

export default function BirthdaysList() {
  const { data: members, isLoading } = useMembers()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cumpleaños del Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-church-gold" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentMonth = new Date().getMonth()
  const birthdaysThisMonth = members?.filter(member => {
    if (!member.birth_date) return false
    const birthMonth = new Date(member.birth_date).getMonth()
    return birthMonth === currentMonth
  }) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cake className="h-5 w-5 text-church-gold" />
          Cumpleaños del Mes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {birthdaysThisMonth.length > 0 ? (
          <div className="space-y-3">
            {birthdaysThisMonth.map((member) => {
              const birthDate = new Date(member.birth_date!)
              const day = birthDate.getDate()
              
              return (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0 w-10 h-10 bg-church-gold text-white rounded-full flex items-center justify-center font-bold">
                    {day}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{member.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {birthDate.toLocaleDateString('es-EC', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No hay cumpleaños este mes
          </p>
        )}
      </CardContent>
    </Card>
  )
}
