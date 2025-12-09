'use client'

import { useCallback, useEffect, useState } from 'react'

interface CookieSettingsTriggerProps {
  variant?: 'link' | 'button'
  className?: string
}

export default function CookieSettingsTrigger({ variant = 'link', className }: CookieSettingsTriggerProps) {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkAvailability = () => {
      setAvailable(typeof window.__ccpOpenCookieSettings === 'function')
    }

    checkAvailability()
    const handleInitialized = () => checkAvailability()
    window.addEventListener('ccp-consent-initialized', handleInitialized)

    return () => {
      window.removeEventListener('ccp-consent-initialized', handleInitialized)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') return

    if (typeof window.__ccpOpenCookieSettings === 'function') {
      window.__ccpOpenCookieSettings()
    } else {
      window.location.href = '/politica-de-cookies#gestionar-consentimiento'
    }
  }, [])

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={className ?? 'text-sm font-medium text-church-blue underline hover:text-church-gold transition'}
      >
        Configurar cookies
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        'text-church-blue-light hover:text-white transition-colors underline decoration-dotted text-sm'
      }
      aria-label="Abrir el panel de configuración de cookies"
    >
      {available ? 'Configurar cookies' : 'Gestionar cookies'}
    </button>
  )
}
