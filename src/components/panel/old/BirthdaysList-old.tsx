import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Calendar, User } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  birthDate: string;
  email?: string;
  phone?: string;
}

const BirthdaysList = () => {
  const [weeklyBirthdays] = useState<Member[]>(() => {
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    
    // Obtener fecha actual y rango de la semana
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado

    // Filtrar miembros con cumpleaños esta semana
    const birthdaysThisWeek = members.filter((member: Member) => {
      if (!member.birthDate) return false;
      
      const birthDate = new Date(member.birthDate);
      const currentYear = today.getFullYear();
      
      // Crear fecha de cumpleaños para el año actual
      const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
      
      return birthdayThisYear >= startOfWeek && birthdayThisYear <= endOfWeek;
    });

    // Ordenar por fecha de cumpleaños
    birthdaysThisWeek.sort((a: Member, b: Member) => {
      const dateA = new Date(a.birthDate);
      const dateB = new Date(b.birthDate);
      return dateA.getDate() - dateB.getDate();
    });

    return birthdaysThisWeek;
  });

  const formatBirthday = (birthDate: string) => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    return `${day} de ${month}`;
  };

  if (weeklyBirthdays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-church-gold" />
            Cumpleaños de la Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No hay cumpleaños esta semana.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-church-gold" />
          Cumpleaños de la Semana ({weeklyBirthdays.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weeklyBirthdays.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-8 w-8 text-church-gold" />
              <div className="flex-1">
                <h4 className="font-medium text-church-blue-dark">{member.name}</h4>
                <p className="text-sm text-gray-600">{formatBirthday(member.birthDate)}</p>
              </div>
              {member.phone && (
                <div className="text-sm text-gray-600">
                  📞 {member.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthdaysList;
