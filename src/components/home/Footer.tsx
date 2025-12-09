import { Heart, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CookieSettingsTrigger from '@/components/CookieSettingsTrigger'

const Footer = () => {
  return (
    <footer className="bg-church-blue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Image 
                src="/favicon.svg" 
                alt="Centro Cristiano Casa de Provisión" 
                width={48} height={48}
                className="h-12 w-auto mr-4 bg-white p-2 rounded"
                priority
              />
              <div>
                <h3 className="text-xl font-bold">Centro Cristiano</h3>
                <p className="text-church-blue-light">Casa de Provisión</p>
              </div>
            </div>
            <p className="text-church-blue-light mb-6 leading-relaxed">
              Una iglesia comprometida con llevar el amor de Dios a nuestra comunidad, 
              fortaleciendo la fe y construyendo un futuro lleno de esperanza.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61567892185318" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook oficial de Centro Cristiano Casa de Provisión"
                className="bg-church-blue hover:bg-church-gold p-3 rounded-full transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/cc.casadeprovision/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram oficial de Centro Cristiano Casa de Provisión"
                className="bg-church-blue hover:bg-church-gold p-3 rounded-full transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@cc.casadeprovision" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Canal de YouTube de Centro Cristiano Casa de Provisión"
                className="bg-church-blue hover:bg-church-gold p-3 rounded-full transition-colors duration-200"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#inicio" className="text-church-blue-light hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#quienes-somos" className="text-church-blue-light hover:text-white transition-colors">Quiénes Somos</a></li>
              <li><a href="#eventos" className="text-church-blue-light hover:text-white transition-colors">Eventos</a></li>
              <li><a href="#calendario" className="text-church-blue-light hover:text-white transition-colors">Calendario</a></li>
              <li><a href="#transmisiones" className="text-church-blue-light hover:text-white transition-colors">Transmisiones</a></li>
              <li><a href="#donaciones" className="text-church-blue-light hover:text-white transition-colors">Donaciones</a></li>
              <li><a href="#misiones" className="text-church-blue-light hover:text-white transition-colors">Misiones</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-church-gold mt-1 flex-shrink-0" />
                <div className="text-church-blue-light">
                  <p>Calle Arana, 28</p>
                  <p>Vitoria-Gasteiz, Álava</p>
                  <p>España, 01002</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-church-gold" />
                <span className="text-church-blue-light">+34 627 10 87 30</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-church-gold" />
                <span className="text-church-blue-light">pastor@casadeprovision.es</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-church-blue mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-church-blue-light text-center md:text-left">
              © 2024 Centro Cristiano Casa de Provisión. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-church-blue-light">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 text-church-gold" />
              <span>para la gloria de Dios</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-church-blue-light">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/politica-de-privacidad" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <span className="hidden sm:inline text-church-blue">•</span>
              <Link href="/politica-de-cookies" className="hover:text-white transition-colors">
                Política de Cookies
              </Link>
              <span className="hidden sm:inline text-church-blue">•</span>
              <CookieSettingsTrigger />
            </div>
            <p className="text-xs text-church-blue-light/80">
              Última revisión legal: noviembre 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
