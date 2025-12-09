
import { Button } from '@/components/button';
import { Play, Calendar, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="inicio" className="relative bg-gradient-to-br from-church-blue-light via-church-cream to-church-gold-light min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-church-blue-dark mb-6">
              Bienvenidos a
              <span className="block text-church-gold">Casa de Provisión</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Un lugar donde la fe crece, la comunidad se fortalece y el amor de Dios transforma vidas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-church-gold hover:bg-church-gold-dark text-white font-semibold px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Transmisión en Vivo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-church-blue text-church-blue hover:bg-church-blue hover:text-white font-semibold px-8 py-4 text-lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Próximos Eventos
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-church-blue-dark mb-6 text-center">
                Próximos Cultos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-church-cream rounded-lg">
                  <div>
                    <h4 className="font-semibold text-church-blue-dark">Culto Dominical</h4>
                    <p className="text-gray-600">Domingo 11:00 AM</p>
                  </div>
                  <Users className="h-6 w-6 text-church-gold" />
                </div>
                <div className="flex items-center justify-between p-4 bg-church-cream rounded-lg">
                  <div>
                    <h4 className="font-semibold text-church-blue-dark">Reunión de Jóvenes</h4>
                    <p className="text-gray-600">Viernes 7:00 PM</p>
                  </div>
                  <Users className="h-6 w-6 text-church-gold" />
                </div>
                <div className="flex items-center justify-between p-4 bg-church-cream rounded-lg">
                  <div>
                    <h4 className="font-semibold text-church-blue-dark">Estudio Bíblico</h4>
                    <p className="text-gray-600">Miércoles 7:30 PM</p>
                  </div>
                  <Users className="h-6 w-6 text-church-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
