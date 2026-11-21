import type { Metadata } from 'next'
import './globals.css'
import { Instrument_Serif, Inter } from 'next/font/google'
import { OG_IMAGE, SITE, SITE_DESCRIPTION, SITE_NAME, jsonLdScript, siteJsonLd } from '@/lib/seo'

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-heading',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'CF LLC — Websites for small businesses, live in a week', template: '%s' },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'CF LLC — Websites for small businesses, live in a week',
    description: SITE_DESCRIPTION,
    url: SITE,
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary',
    title: 'CF LLC — Websites for small businesses, live in a week',
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6809503981674593"
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd()) }} />
        {children}
        {/* Cloudflare Web Analytics */}
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "5da4746aa37e402492c3dca880f56c35"}'></script>
      </body>
    </html>
  )
}
