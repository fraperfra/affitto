import { Header } from '@/components/brochure/Header'
import { Hero } from '@/components/brochure/Hero'
import { Overview } from '@/components/brochure/Overview'
import { Apartments } from '@/components/brochure/Apartments'
import { Gallery } from '@/components/brochure/Gallery'
import { ContractInfo } from '@/components/brochure/ContractInfo'
import { Rules } from '@/components/brochure/Rules'
import { ApplicationForm } from '@/components/brochure/ApplicationForm'
import { getPhotosFromDB } from '@/lib/photos-db'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'

export default async function HomePage() {
  const allPhotos = await getPhotosFromDB()

  return (
    <>
      <Header />
      <main>
        <Hero photos={allPhotos['appartamento'] ?? []} />
        <Overview />
        <Apartments allPhotos={allPhotos} />
        <Gallery photos={allPhotos['galleria'] ?? []} />
        <ContractInfo />
        <Rules />
        <ApplicationForm />
      </main>

      <footer className="bg-anthracite text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col items-center gap-8">
          <Image
            src="/images/Logo Diba Nero.png"
            alt="Immobiliare Diba"
            width={130}
            height={48}
            className="object-contain brightness-0 invert opacity-80 h-12 w-auto"
          />

          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm font-sans text-white/60">
            <a
              href="https://maps.google.com/?q=Via+Vittorio+Veneto+3/d,+42121+Reggio+Emilia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white/90 transition-colors"
            >
              <MapPin size={14} className="text-gold shrink-0" />
              Via Vittorio Veneto 3/d, 42121 Reggio Emilia
            </a>
            <a
              href="tel:+393274911031"
              className="flex items-center gap-2 hover:text-white/90 transition-colors"
            >
              <Phone size={14} className="text-gold shrink-0" />
              327 491 1031
            </a>
            <a
              href="mailto:segreteria@immobiliarediba.it"
              className="flex items-center gap-2 hover:text-white/90 transition-colors"
            >
              <Mail size={14} className="text-gold shrink-0" />
              segreteria@immobiliarediba.it
            </a>
          </div>

          <div className="w-full border-t border-white/10 pt-6 text-center">
            <p className="font-sans text-xs text-white/30">
              © {new Date().getFullYear()} Immobiliare Diba · Appartamento di Pregio, Centro Storico Reggio Emilia
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
