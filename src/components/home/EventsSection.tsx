
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      title: "Culto Dominical",
      description: "Únete a nosotros cada domingo para adorar, aprender y crecer en comunidad.",
      date: "Todos los Domingos",
      time: "9:00 AM - 11:00 AM",
      location: "Santuario Principal",
      type: "Culto",
      color: "bg-church-gold"
    },
    {
      id: 2,
      title: "Estudio Bíblico",
      description: "Profundiza en la Palabra de Dios con estudio detallado y aplicación práctica.",
      date: "Miércoles",
      time: "7:30 PM - 9:00 PM",
      location: "Sala de Conferencias",
      type: "Estudio",
      color: "bg-church-blue"
    },
    {
      id: 3,
      title: "Reunión de Jóvenes",
      description: "Espacio para que los jóvenes crezcan en fe y amistad.",
      date: "Viernes",
      time: "7:00 PM - 9:30 PM",
      location: "Salón de Jóvenes",
      type: "Jóvenes",
      color: "bg-green-600"
    },
    {
      id: 4,
      title: "Ministerio de Niños",
      description: "Actividades especiales diseñadas para nuestros pequeños.",
      date: "Domingos",
      time: "9:00 AM - 11:00 AM",
      location: "Aula Infantil",
      type: "Niños",
      color: "bg-purple-600"
    },
    {
      id: 5,
      title: "Grupo de Oración",
      description: "Momento especial de intercesión y comunión espiritual.",
      date: "Martes",
      time: "6:00 AM - 7:00 AM",
      location: "Capilla",
      type: "Oración",
      color: "bg-indigo-600"
    },
    {
      id: 6,
      title: "Ministerio de Mujeres",
      description: "Encuentro mensual para fortalecer la hermandad entre mujeres.",
      date: "Primer Sábado del Mes",
      time: "10:00 AM - 12:00 PM",
      location: "Salón Social",
      type: "Ministerio",
      color: "bg-pink-600"
    }
  ];

  return (
    <section id="eventos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-blue-dark mb-6">
            Nuestros Eventos
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Descubre las actividades y reuniones que fortalecen nuestra vida en comunidad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="relative">
                <div className={`absolute top-4 right-4 ${event.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {event.type}
                </div>
                <CardTitle className="text-xl font-bold text-church-blue-dark pr-20">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="h-5 w-5 text-church-gold" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="h-5 w-5 text-church-gold" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-5 w-5 text-church-gold" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-church-gold hover:bg-church-gold-dark text-white font-semibold"
                  size="lg"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Más Información
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-church-blue text-church-blue hover:bg-church-blue hover:text-white font-semibold px-8"
          >
            Ver Todos los Eventos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
