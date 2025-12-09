import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { Globe, Heart, Users, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const MisionesSection = () => {
  const missions = [
    {
      id: 1,
      title: "Misiones en Senegal",
      location: "África Occidental",
      description: "Apoyo activo en misiones humanitarias y espirituales, llevando esperanza y el evangelio a comunidades necesitadas.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      activities: [
        "Evangelismo y discipulado",
        "Programas humanitarios",
        "Construcción de pozos de agua",
        "Educación y alfabetización"
      ],
      color: "bg-orange-600"
    },
    {
      id: 2,
      title: "Norte de España",
      location: "País Vasco y Cantabria",
      description: "Evangelismo y discipulado en el norte de España, fortaleciendo iglesias locales y alcanzando nuevas comunidades.",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop",
      activities: [
        "Plantación de iglesias",
        "Formación de líderes",
        "Evangelismo urbano",
        "Ministerio juvenil"
      ],
      color: "bg-blue-600"
    }
  ];

  return (
    <section id="misiones" className="py-20 bg-church-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-blue-dark mb-6">
            Nuestras Misiones
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Llevamos el amor de Cristo más allá de nuestras fronteras, apoyando activamente 
            misiones que transforman vidas y comunidades
          </p>
        </div>

        {/* Mission Vision */}
        <div className="text-center mb-16">
          <Card className="bg-gradient-to-r from-church-blue to-church-blue-dark text-white shadow-xl inline-block">
            <CardContent className="p-8">
              <Globe className="h-16 w-16 mx-auto mb-4 text-church-gold" />
              <h3 className="text-2xl font-bold mb-4">Visión Misionera</h3>
              <p className="text-lg text-blue-100 max-w-2xl">
                &ldquo;Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre 
                del Padre, y del Hijo, y del Espíritu Santo&rdquo; - Mateo 28:19
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Missions Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {missions.map((mission) => (
            <Card key={mission.id} className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative">
                <Image 
                  src={mission.image} 
                  alt={mission.title}
                  width={600} height={256}
                  className="w-full h-64 object-cover rounded-t-lg"
                  priority
                />
                <div className="absolute inset-0 bg-black/30 rounded-t-lg"></div>
                <div className={`absolute top-4 left-4 ${mission.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {mission.location}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl text-church-blue-dark">{mission.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                
                <div>
                  <h4 className="font-semibold text-church-blue-dark mb-3 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-church-gold" />
                    Actividades Principales
                  </h4>
                  <ul className="space-y-2">
                    {mission.activities.map((activity, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <ArrowRight className="h-4 w-4 mr-2 text-church-gold flex-shrink-0" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full bg-church-gold hover:bg-church-gold-dark text-white font-semibold"
                  size="lg"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Conoce Más
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-church-cream border-church-gold border-2">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-church-blue-dark mb-4">
                ¡Únete a Nuestras Misiones!
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Si sientes el llamado a participar en la obra misionera, ya sea a través de 
                oración, apoyo financiero o participación directa, contáctanos para conocer 
                cómo puedes formar parte de estos proyectos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-church-gold hover:bg-church-gold-dark text-white font-semibold"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Apoyar Misiones
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-church-blue text-church-blue hover:bg-church-blue hover:text-white"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Más Información
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MisionesSection;
