'use client'

import { Card, CardContent } from '@/components/card'
import { Button } from '@/components/button'
import { Play, Video, Youtube } from 'lucide-react'

interface Stream {
  id: string
  title: string
  description: string | null
  stream_url: string
  platform: string | null
  scheduled_date: string
  status: string | null
}

interface LiveStreamSectionProps {
  streams: Stream[]
}

export default function LiveStreamSection({ streams }: LiveStreamSectionProps) {
  // TODO: Implementar exibição dinâmica quando houver transmissões
  // const liveStream = streams.find(s => s.status === 'live')
  // const upcomingStreams = streams.filter(s => s.status === 'scheduled').slice(0, 3)

  // Evita warning de variável não usada
  void streams

  return (
    <section id="transmisiones" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-church-blue-dark mb-6">
            Transmisiones en Vivo
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Conecta con nosotros desde cualquier lugar y mantente en comunión
          </p>
        </div>

        {/* Live Stream Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-church-blue to-church-blue-dark text-white shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-200 font-semibold">EN VIVO</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Culto Dominical
                  </h3>
                  <p className="text-xl text-blue-100 mb-6">
                    Únete a nuestro culto dominical en vivo cada domingo a las 9:00 AM
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="bg-church-gold hover:bg-church-gold-dark text-white font-semibold"
                      onClick={() => window.open('https://www.youtube.com/channel/UCiZGj9wHkU6X4XBjZZ5VoFg', '_blank')}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Ver Transmisión
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-church-blue"
                      onClick={() => window.open('https://www.youtube.com/@cc.casadeprovision', '_blank')}
                    >
                      <Youtube className="mr-2 h-5 w-5" />
                      Canal de YouTube
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-black/20 rounded-lg p-8 text-center">
                    <Video className="h-20 w-20 mx-auto mb-4 text-church-gold" />
                    <p className="text-lg">Transmisión comenzará pronto...</p>
                    <p className="text-blue-200">Domingos 9:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Previous Recordings - TODO: Implement when recordings table is ready */}
      </div>
    </section>
  );
}
