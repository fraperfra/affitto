'use client'
import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PhotoConfig } from '@/lib/photos'

export function Gallery({ photos }: { photos: PhotoConfig[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, photos.length - 1))
    setCurrent(clamped)
    trackRef.current?.children[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [photos.length])

  const openLightbox = (i: number) => {
    setLightboxIndex(i)
    setLightboxOpen(true)
  }

  return (
    <section id="galleria" className="py-8 px-4 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">L&apos;appartamento</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Galleria Fotografica</h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto text-base">
            Esplora gli spazi dell&apos;appartamento attraverso la nostra selezione di immagini.
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="w-full h-64 bg-stone-100 rounded-2xl flex flex-col items-center justify-center gap-3 text-stone-400">
            <Camera size={40} strokeWidth={1} />
            <span className="font-sans text-sm">Foto in arrivo</span>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel track */}
            <div
              ref={trackRef}
              className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-3 rounded-2xl"
              onScroll={e => {
                const el = e.currentTarget
                const idx = Math.round(el.scrollLeft / el.clientWidth)
                setCurrent(idx)
              }}
            >
              {photos.map((photo, i) => (
                <div
                  key={i}
                  data-protected
                  className="relative shrink-0 w-full snap-center aspect-[16/9] overflow-hidden rounded-2xl cursor-pointer group"
                  onClick={() => openLightbox(i)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 1152px"
                    priority={i === 0}
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-sm px-6 py-4 font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Prev / Next arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => goTo(current - 1)}
                  disabled={current === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-30 text-anthracite rounded-full p-2.5 shadow-md transition-all z-10"
                  aria-label="Foto precedente"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => goTo(current + 1)}
                  disabled={current === photos.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-30 text-anthracite rounded-full p-2.5 shadow-md transition-all z-10"
                  aria-label="Foto successiva"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dots */}
            {photos.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-6 h-2 bg-gold'
                        : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Vai alla foto ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            <p className="text-center font-sans text-xs text-stone-400 mt-2">
              {current + 1} / {photos.length}
            </p>
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={photos.map(p => ({ src: p.src, alt: p.alt }))}
      />
    </section>
  )
}
