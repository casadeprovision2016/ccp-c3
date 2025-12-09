import Link from 'next/link'
import { Button } from '@/components/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-church-blue-light to-church-cream">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-9xl font-bold text-church-gold">404</h1>
        <h2 className="text-3xl font-semibold text-church-blue-dark">
          Página no encontrada
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button className="bg-church-gold hover:bg-church-gold-dark text-white">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}
