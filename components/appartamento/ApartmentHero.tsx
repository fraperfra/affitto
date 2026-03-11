'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import type { PhotoConfig } from '@/lib/photos'

export function ApartmentHero({ photos, name }: { photos: PhotoConfig[]; name: string }) {
  const [current, setCurrent] = useState(0)
  const total = photos.length

  if (total === 0) return (
    <div className="h-[50vh] bg-stone-200 flex items-center justify-center">
      <p className="text-stone-400 font-sans">Foto in arrivo</p>
    </div>
  )

  return (
    <div className="relative h-[60vh] overflow-hidden bg-anthracite">
      <Image src={photos[current].src} alt={photos[current].alt} fill className="object-cover opacity-90" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-anthracite/40 to-transparent" />

      <Link
        href="/#appartamenti"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/90 font-sans text-sm bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-black/50 transition-colors"
      >
        <ArrowLeft size={14} /> Tutti gli appartamenti
      </Link>

      <div className="absolute bottom-6 left-6">
        <p className="font-sans text-gold uppercase tracking-widest text-xs mb-1">Vicolo Folletto</p>
        <h1 className="font-serif text-white text-3xl md:text-4xl">{name}</h1>
      </div>

      {total > 1 && (
        <>
          <button onClick={() => setCurrent(p => (p - 1 + total) % total)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrent(p => (p + 1) % total)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
