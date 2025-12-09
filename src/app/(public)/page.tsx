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

  // Buscar próximos eventos (scheduled ou ongoing)
  const { results: events } = await db
    .prepare(`
      SELECT * FROM events 
      WHERE status IN ('scheduled', 'ongoing')
      ORDER BY event_date ASC
      LIMIT 6
    `)
    .all<PublicEvent>()

  // Buscar próximas transmisiones (scheduled o live)
  const { results: streams } = await db
    .prepare(`
      SELECT * FROM streams 
      WHERE status IN ('scheduled', 'live')
      ORDER BY scheduled_date ASC
      LIMIT 3
    `)
    .all<PublicStream>()

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
