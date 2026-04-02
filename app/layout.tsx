import type { Metadata } from 'next'
import './globals.css'
import { Manrope, Sora } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-heading'
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body'
})

export const metadata: Metadata = {
  title: 'Cooper Featherstone LLC',
  description: 'Boutique software, automation, and digital execution for teams that need sharp delivery.',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6809503981674593"
          crossOrigin="anonymous"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}