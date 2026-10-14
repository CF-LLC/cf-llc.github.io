import type { Metadata } from 'next'
import './globals.css'
import { Instrument_Serif, Inter } from 'next/font/google'

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
  title: 'CF LLC — Websites for small businesses, live in a week',
  description: 'Mobile-friendly websites for small businesses anywhere in the US. Starter Site $499 setup + $39/mo. Get a free homepage mockup.',
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
      <body>{children}</body>
    </html>
  )
}
