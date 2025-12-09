'use client'

import { useState } from 'react';
import { Button } from '@/components/button';
import { Menu, X, Heart, Calendar, Users, Phone, Play, DollarSign, Settings, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '#inicio', icon: Heart },
    { name: 'Quiénes Somos', href: '#quienes-somos', icon: Users },
    { name: 'Calendario', href: '#calendario', icon: Calendar },
    { name: 'Transmisiones', href: '#transmisiones', icon: Play },
    { name: 'Donaciones', href: '#donaciones', icon: DollarSign },
    { name: 'Contacto', href: '#contacto', icon: Phone },
    { name: 'Misiones', href: '#misiones', icon: Globe },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src="/favicon.svg" 
                alt="Centro Cristiano Casa de Provisión" 
                width={64} height={64}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-church-gold px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </a>
            ))}
            <Link
              href="/login"
              className="text-gray-700 hover:text-church-gold px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 ml-4 border-l border-gray-200 pl-4"
            >
              <Settings className="h-4 w-4" />
              Panel
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-church-gold"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-church-gold block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </a>
              ))}
              <Link
                href="/login"
                className="text-gray-700 hover:text-church-gold block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center gap-2 border-t border-gray-200 mt-2 pt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Panel Administrativo
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
