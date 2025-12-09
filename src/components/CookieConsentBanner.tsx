'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'ccp-cookie-consent'
const CONSENT_VERSION = '2025-11-18'

export type ConsentPreferences = {
  version: string
  timestamp: string
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

type PreferenceToggle = 'functional' | 'analytics' | 'marketing'

declare global {
  interface Window {
    __ccpOpenCookieSettings?: () => void
  }
}

const defaultPreferences: ConsentPreferences = {
  version: CONSENT_VERSION,
  timestamp: new Date(0).toISOString(),
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
}

function parseStoredPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      ...defaultPreferences,
      ...parsed,
      version: parsed.version ?? CONSENT_VERSION,
      timestamp: parsed.timestamp ?? new Date().toISOString(),
      necessary: true,
    }
  } catch (error) {
    console.warn('[cookies] No se pudo leer el consentimiento almacenado', error)
    return null
  }
}

export default function CookieConsentBanner() {
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultPreferences)
  const [showBanner, setShowBanner] = useState(false)
  const [showManager, setShowManager] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = parseStoredPreferences()
    if (stored) {
      setPreferences(stored)
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }

    window.__ccpOpenCookieSettings = () => {
      setShowManager(true)
      setShowBanner(false)
    }

    window.dispatchEvent(new Event('ccp-consent-initialized'))
    setReady(true)

    return () => {
      delete window.__ccpOpenCookieSettings
    }
  }, [])

  const categories = useMemo(
    () => [
      {
        key: 'functional' as PreferenceToggle,
        title: 'Funcionales',
        description: 'Recuerdan ajustes opcionales como idioma o accesibilidad.'
      },
      {
        key: 'analytics' as PreferenceToggle,
        title: 'Analíticas',
        description: 'Ayudan a medir el uso del sitio para mejorar la experiencia.'
      },
      {
        key: 'marketing' as PreferenceToggle,
        title: 'Marketing / Terceros',
        description: 'Activa contenidos embebidos (YouTube, mapas) y personalización.'
      }
    ],
    []
  )

  const persistPreferences = useCallback(
    (next: ConsentPreferences) => {
      if (typeof window === 'undefined') return
      const payload: ConsentPreferences = {
        ...next,
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      setPreferences(payload)
      window.dispatchEvent(new CustomEvent('ccp-consent-updated', { detail: payload }))
    },
    []
  )

  const handleAcceptAll = () => {
    persistPreferences({
      ...preferences,
      functional: true,
      analytics: true,
      marketing: true,
    })
    setShowBanner(false)
    setShowManager(false)
  }

  const handleRejectNonEssential = () => {
    persistPreferences({
      ...preferences,
      functional: false,
      analytics: false,
      marketing: false,
    })
    setShowBanner(false)
    setShowManager(false)
  }

  const handleSave = () => {
    persistPreferences(preferences)
    setShowManager(false)
    setShowBanner(false)
  }

  const toggleCategory = (key: PreferenceToggle) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!ready) {
    return null
  }

  return (
    <>
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-church-blue/20 shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4 text-slate-800">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-church-blue">Cookies y privacidad</p>
              <p className="mt-2 text-base">
                Utilizamos cookies propias y de terceros para garantizar el funcionamiento seguro del sitio,
                mejorar tu experiencia y mostrar contenido integrado. Puedes aceptar todas, rechazar las no esenciales
                o configurar tus preferencias por categorías.
              </p>
              <p className="text-sm mt-2 text-slate-600">
                Consulta la{' '}
                <Link href="/politica-de-cookies" className="text-church-blue underline font-medium">
                  Política de Cookies
                </Link>{' '}
                y la{' '}
                <Link href="/politica-de-privacidad" className="text-church-blue underline font-medium">
                  Política de Privacidad
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto border border-church-blue text-church-blue px-4 py-2 rounded-lg font-medium hover:bg-church-blue hover:text-white transition"
              >
                Rechazar no esenciales
              </button>
              <button
                type="button"
                onClick={() => setShowManager(true)}
                className="w-full sm:w-auto border border-church-gold text-church-gold px-4 py-2 rounded-lg font-medium hover:bg-church-gold hover:text-white transition"
              >
                Configurar cookies
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto bg-church-gold hover:bg-church-gold-dark text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      )}

      {showManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 space-y-6">
            <header className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-church-blue">Preferencias personalizadas</p>
              <h3 className="text-2xl font-semibold text-church-blue-dark">Gestiona tus categorías</h3>
              <p className="text-sm text-slate-600">
                Activamos cada categoría solo después de tu consentimiento. Puedes cambiar de opinión en cualquier momento
                desde este panel o desde el enlace “Configurar cookies” disponible en el pie de página.
              </p>
            </header>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Necesarias</p>
                    <p className="text-sm text-slate-600">Imprescindibles para iniciar sesión, mantener la seguridad y recordar tu sesión.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase text-slate-500">Siempre activas</span>
                </div>
              </div>

              {categories.map((category) => (
                <div key={category.key} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-slate-900">{category.title}</p>
                    <p className="text-sm text-slate-600">{category.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.key)}
                    className={`inline-flex items-center w-16 h-8 rounded-full transition-colors ${preferences[category.key] ? 'bg-church-gold' : 'bg-slate-300'}`}
                    aria-pressed={preferences[category.key]}
                  >
                    <span
                      className={`h-6 w-6 bg-white rounded-full shadow transform transition ${
                        preferences[category.key] ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto border border-church-blue text-church-blue px-4 py-2 rounded-lg font-medium hover:bg-church-blue hover:text-white transition"
              >
                Rechazar no esenciales
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto bg-church-gold hover:bg-church-gold-dark text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Guardar selección
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
