'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { Heart, CreditCard, Building, Shield, Gift, Copy } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const DonationsSection = () => {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <section id="donaciones" className="py-20 bg-church-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-blue-dark mb-6">
            Donaciones
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Tu generosidad nos permite continuar con la obra de Dios y bendecir a nuestra comunidad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-church-blue-dark mb-6">
              ¿Por qué donamos?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Heart className="h-6 w-6 text-church-gold mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-church-blue-dark mb-2">Por amor a Dios</h4>
                  <p className="text-gray-600">Expresamos nuestra gratitud y amor hacia Dios a través de la ofrenda voluntaria.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Gift className="h-6 w-6 text-church-gold mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-church-blue-dark mb-2">Para la obra del Reino</h4>
                  <p className="text-gray-600">Apoyamos los ministerios, programas sociales y el crecimiento de nuestra iglesia.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-church-gold mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-church-blue-dark mb-2">Con responsabilidad</h4>
                  <p className="text-gray-600">Manejamos cada donación con transparencia y responsabilidad ante Dios y la congregación.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image 
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop" 
              alt="Manos dando"
              width={600} height={400}
              className="rounded-lg shadow-xl"
              priority
            />
            <div className="absolute inset-0 bg-church-blue/20 rounded-lg"></div>
          </div>
        </div>

        {/* Donation Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white shadow-xl border-t-4 border-church-gold">
            <CardHeader className="text-center">
              <Building className="h-12 w-12 text-church-gold mx-auto mb-4" />
              <CardTitle className="text-2xl text-church-blue-dark">Transferencia Bancaria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-700">IBAN:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('ES1021001419020200597614', 'iban')}
                      className="p-1"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-mono text-lg text-church-blue-dark break-all">
                    ES1021001419020200597614
                  </p>
                  {copied === 'iban' && <p className="text-green-600 text-sm mt-1">¡Copiado!</p>}
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-700">BIC/SWIFT:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('CAIXESBBXXX', 'bic')}
                      className="p-1"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-mono text-lg text-church-blue-dark">
                    CAIXESBBXXX
                  </p>
                  {copied === 'bic' && <p className="text-green-600 text-sm mt-1">¡Copiado!</p>}
                </div>

                <div className="text-center">
                  <p className="font-semibold text-gray-700">Titular:</p>
                  <p className="text-church-blue-dark">Centro Cristiano Casa de Provisión</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-t-4 border-church-blue">
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 text-church-blue mx-auto mb-4" />
              <CardTitle className="text-2xl text-church-blue-dark">Bizum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Método de pago rápido y seguro</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold">En construcción</p>
                  <p className="text-yellow-600 text-sm mt-1">Pronto disponible</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Transacción segura</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Método instantáneo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-church-cream border-church-gold border-2 inline-block">
            <CardContent className="p-6">
              <p className="text-church-blue-dark font-semibold text-lg">
                &ldquo;Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, 
                porque Dios ama al dador alegre.&rdquo;
              </p>
              <p className="text-church-gold font-semibold mt-2">2 Corintios 9:7</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DonationsSection;
