import { getDB } from '@/lib/db/client'
import Header from '@/components/home/Header'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import CalendarSection from '@/components/home/CalendarSection'
import LiveStreamSection from '@/components/home/LiveStreamSection'
import DonationsSection from '@/components/home/DonationsSection'
import ContactSection from '@/components/home/ContactSection'
import MisionesSection from '@/components/home/MisionesSection'
import Footer from '@/components/home/Footer'

export const dynamic = 'force-dynamic'

type PublicEvent = {
  id: string
  title: string
  description: string | null
  event_date: string
  end_date: string | null
  location: string | null
  event_type: string | null
  status: string
}

type PublicStream = {
  id: string
  title: string
  description: string | null
  stream_url: string
  platform: string | null
  scheduled_date: string
  status: string | null
}

export default async function Home() {
  const db = await getDB()

  let events: PublicEvent[] = []
  let streams: PublicStream[] = []

  try {
    // Buscar próximos eventos (scheduled ou ongoing)
    const ev = await db
      .prepare(`
        SELECT * FROM events 
        WHERE status IN ('scheduled', 'ongoing')
        ORDER BY event_date ASC
        LIMIT 6
      `)
      .all<PublicEvent>()
    events = ev?.results ?? []

    // Buscar próximas transmisiones (scheduled ou live)
    const st = await db
      .prepare(`
        SELECT * FROM streams 
        WHERE status IN ('scheduled', 'live')
        ORDER BY scheduled_date ASC
        LIMIT 3
      `)
      .all<PublicStream>()
    streams = st?.results ?? []
  } catch (err) {
    // Falha ao acessar D1 (ex.: tabela ausente) — log e fallback vazio para evitar erro de prerender
    // eslint-disable-next-line no-console
    console.error('DB access failed during prerender:', err)
    events = []
    streams = []
  }

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <CalendarSection events={events || []} />
      <LiveStreamSection streams={streams || []} />
      <DonationsSection />
      <ContactSection />
      <MisionesSection />
      <Footer />
    </div>
  )
}
