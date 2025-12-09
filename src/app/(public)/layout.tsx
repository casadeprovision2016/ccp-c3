import CookieConsentBanner from '@/components/CookieConsentBanner'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <CookieConsentBanner />
    </>
  )
}
