import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { PhotoProtection } from '@/components/PhotoProtection'
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
      <body className="bg-ivory text-anthracite antialiased">
        <PhotoProtection />
        {children}
      </body>
    </html>
  )
}
