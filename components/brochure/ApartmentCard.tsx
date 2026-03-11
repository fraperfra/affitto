import Link from 'next/link'
import Image from 'next/image'
import { BedDouble, Bath, ArrowRight } from 'lucide-react'
import type { Apartment } from '@/lib/apartments'
import type { PhotoConfig } from '@/lib/photos'

interface Props {
  apartment: Apartment
  coverPhoto?: PhotoConfig
}

export function ApartmentCard({ apartment, coverPhoto }: Props) {
  const bedroomCount = apartment.rooms.filter(r => r.id.startsWith('camera')).length
  const bathroomCount = apartment.rooms.filter(r => r.id.startsWith('bagno')).length

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100">
      <div className="relative h-56 overflow-hidden bg-stone-100">
        {coverPhoto ? (
          <Image
            src={coverPhoto.src}
            alt={coverPhoto.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
            <span className="text-stone-400 font-sans text-sm">Foto in arrivo</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-anthracite/80 backdrop-blur-sm text-white font-sans text-xs tracking-widest uppercase px-3 py-1 rounded-full">
            {apartment.floor}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-1">{apartment.name}</p>
        <p className="font-sans text-stone-500 text-sm mb-4 line-clamp-2">{apartment.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-full px-3 py-1 font-sans text-xs text-stone-600">
            <BedDouble size={12} /> {bedroomCount} {bedroomCount === 1 ? 'camera' : 'camere'}
          </span>
          <span className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-full px-3 py-1 font-sans text-xs text-stone-600">
            <Bath size={12} /> {bathroomCount} bagni
          </span>
          {apartment.rooms.some(r => r.id === 'terrazzo') && (
            <span className="bg-stone-50 border border-stone-200 rounded-full px-3 py-1 font-sans text-xs text-stone-600">🌿 Terrazzo</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif text-2xl text-anthracite">€ {apartment.price.toLocaleString('it-IT')}</span>
            <span className="font-sans text-stone-400 text-sm"> / mese</span>
          </div>
          <Link
            href={`/appartamento/${apartment.slug}`}
            className="flex items-center gap-2 bg-anthracite text-white font-sans text-sm px-4 py-2 rounded-xl hover:bg-anthracite/80 transition-colors"
          >
            Scopri <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
