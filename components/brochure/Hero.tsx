'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import type { PhotoConfig } from '@/lib/photos'

export function Hero({ photos: heroPhotos }: { photos: PhotoConfig[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (heroPhotos.length <= 1) return
    const timer = setInterval(() => setCurrent(c => (c + 1) % heroPhotos.length), 5000)
    return () => clearInterval(timer)
  }, [heroPhotos.length])

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {heroPhotos.length === 0 ? (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
      ) : (
        heroPhotos.map((photo, i) => (
          <div
            key={i}
            data-protected
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))
      )}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="font-sans text-gold uppercase tracking-[0.3em] text-sm mb-4">
          Centro Storico · Reggio Emilia
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
          Appartamenti di Pregio
        </h1>
        <p className="font-sans text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Eleganza e comfort nel cuore della città. Completamente arredati, classe energetica A++, cucine SMEG.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#appartamenti"
            className="bg-gold hover:bg-gold/90 text-white font-sans font-medium px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Scopri gli appartamenti
          </a>
          <a
            href="#candidatura"
            className="border border-white/60 hover:border-white text-white font-sans font-medium px-8 py-3.5 rounded-full transition-all hover:bg-white/10"
          >
            Invia candidatura
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60">
        <ChevronDown size={28} />
      </div>

      {heroPhotos.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2">
          {heroPhotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gold scale-125' : 'bg-white/40'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
