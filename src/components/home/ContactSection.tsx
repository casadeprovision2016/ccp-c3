'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      details: [
        "Calle Arana, 28",
        "Vitoria-Gasteiz, Álava",
        "España, 01002"
      ],
      color: "text-church-gold"
    },
    {
      icon: Phone,
      title: "WhatsApp",
      details: ["+34 627 10 87 30"],
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["pastor@casadeprovision.es"],
      color: "text-church-blue"
    },
    {
      icon: Clock,
      title: "Horario de Oficina",
      details: [
        "Martes y Viernes 18:30 - 19:00",
        "Domingo después del culto"
      ],
      color: "text-purple-600"
    }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre Centro Cristiano Casa de Provisión.");
    window.open(`https://wa.me/34627108730?text=${message}`, '_blank');
  };

  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-blue-dark mb-6">
            Contacto
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Estamos aquí para servirte. No dudes en contactarnos para cualquier consulta o visita
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-church-blue-dark mb-6">
              Información de Contacto
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <info.icon className={`h-6 w-6 ${info.color}`} />
                      <CardTitle className="text-lg text-church-blue-dark">{info.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 leading-relaxed">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold mb-2">¿Necesitas ayuda inmediata?</h4>
                    <p className="text-green-100">Contáctanos por WhatsApp para una respuesta rápida</p>
                  </div>
                  <Button 
                    onClick={handleWhatsApp}
                    className="bg-white text-green-600 hover:bg-green-50 font-semibold"
                    size="lg"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-church-blue-dark mb-6">
              Nuestra Ubicación
            </h3>
            
            <Card className="bg-white shadow-xl">
              <CardContent className="p-0">
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2903.8899999999994!2d-2.6723999999999997!3d42.8505555555556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4fc2b8b5b8b5b8b%3A0x5b8b5b8b5b8b5b8b!2sCalle%20Arana%2C%2028%2C%2001002%20Vitoria-Gasteiz%2C%20%C3%81lava%2C%20Spain!5e0!3m2!1sen!2ses!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Centro Cristiano Casa de Provisión"
                  ></iframe>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-church-cream border-church-gold border-2">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-church-blue-dark mb-3">
                  ¡Te esperamos!
                </h4>
                <p className="text-gray-700 mb-4">
                  Ven y forma parte de nuestra familia en Cristo. Todos son bienvenidos.
                </p>
                <Button 
                  className="bg-church-gold hover:bg-church-gold-dark text-white font-semibold"
                  onClick={handleWhatsApp}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contactar Ahora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
