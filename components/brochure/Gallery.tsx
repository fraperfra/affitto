'use client'
import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Camera } from 'lucide-react'
import type { PhotoConfig } from '@/lib/photos'

export function Gallery({ photos }: { photos: PhotoConfig[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  return (
    <section id="galleria" className="py-24 px-4 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
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
          <>
            {/* Grid masonry-like a 3 colonne */}
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  data-protected
                  className="relative overflow-hidden rounded-xl cursor-pointer group break-inside-avoid"
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={800}
                    height={600}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity font-sans">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={lightboxIndex}
              slides={photos.map(p => ({ src: p.src, alt: p.alt }))}
            />
          </>
        )}
      </div>
    </section>
  )
}
