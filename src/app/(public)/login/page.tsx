'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Label } from '@/components/label'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/panel')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError('Usuario o contraseña incorrectos')
      } else {
        router.push('/panel')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Credenciales incorrectas',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-church-blue-light via-church-cream to-church-gold-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Image 
                src="/favicon.svg" 
                alt="Centro Cristiano Casa de Provisión" 
                width={64} height={64}
                className="h-16 w-auto"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-church-blue-dark">
              Panel Administrativo
            </CardTitle>
            <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="pastor@casadeprovision.es"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-church-gold hover:bg-church-gold-dark text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">Crea usuarios en Supabase Auth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
