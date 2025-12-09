import { Card, CardContent } from '@/components/card';
import { Heart, Target, Eye, Users } from 'lucide-react';
import Image from 'next/image';

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Historia",
      description: "Fundada con el propósito de ser un refugio de esperanza y amor, donde cada persona encuentra su lugar en la familia de Dios."
    },
    {
      icon: Target,
      title: "Misión",
      description: "Llevar el mensaje de salvación a todas las personas, fortaleciendo la fe y construyendo una comunidad unida en Cristo."
    },
    {
      icon: Eye,
      title: "Visión",
      description: "Ser una iglesia que trascienda fronteras, impactando vidas a través del amor de Dios y el servicio a la comunidad."
    },
    {
      icon: Users,
      title: "Valores",
      description: "Fe, esperanza, amor, integridad, servicio y comunidad son los pilares que guían nuestro caminar cristiano."
    }
  ];

  const pastors = [
    {
      name: "Pastor Ricardo",
      position: "Pastor Principal",
      image: "/favicon.svg",
      description: "Con años de experiencia en el ministerio, guía nuestra congregación con sabiduría y amor."
    },
    {
      name: "Pastora Luzinete",
      position: "Pastora Asociada",
      image: "/favicon.svg",
      description: "Lidera el ministerio de mujeres y el trabajo con familias en nuestra comunidad."
    },
    {
      name: "Anciano Alejandro",
      position: "Líder de Ujieres",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Dedica su servicio a coordinar el ministerio de ujieres y la hospitalidad en la iglesia."
    }
  ];

  return (
    <section id="quienes-somos" className="py-20 bg-church-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-blue-dark mb-6">
            Quiénes Somos
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Somos una familia unida por la fe, comprometida con el crecimiento espiritual 
            y el servicio a nuestra comunidad.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-church-gold">
              <CardContent className="p-8 text-center">
                <value.icon className="h-12 w-12 text-church-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-church-blue-dark mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pastoral Team */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-church-blue-dark mb-4">Nuestro Equipo Pastoral</h3>
          <p className="text-lg text-gray-700">Líderes dedicados al servicio de Dios y nuestra comunidad</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pastors.map((pastor, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <Image 
                  src={pastor.image} 
                  alt={pastor.name}
                  width={128} height={128}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-church-gold"
                  priority
                />
                <h4 className="text-xl font-bold text-church-blue-dark mb-2">{pastor.name}</h4>
                <p className="text-church-gold font-semibold mb-4">{pastor.position}</p>
                <p className="text-gray-600 leading-relaxed">{pastor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
