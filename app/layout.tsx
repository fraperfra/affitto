import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { PhotoProtection } from '@/components/PhotoProtection'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Appartamento di Pregio — Centro Storico, Reggio Emilia',
  description: 'Appartamento arredato di pregio in affitto nel centro storico di Reggio Emilia. Classe energetica A++, cucina SMEG, triplo vetro.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vu2d2s0apn");`,
          }}
        />
      </head>
      <body className="bg-ivory text-anthracite antialiased">
        <PhotoProtection />
        {children}
      </body>
    </html>
  )
}
