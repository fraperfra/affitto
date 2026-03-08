'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { PhotoConfig } from '@/lib/photos'

interface Props {
  photos: PhotoConfig[]
  roomName: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PhotoCarousel({ photos, roomName: _roomName }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-stone-100 rounded-t-xl flex flex-col items-center justify-center gap-2 text-stone-400">
        <Camera size={32} strokeWidth={1} />
        <span className="text-sm font-sans">Foto in arrivo</span>
      </div>
    )
  }

  const prev = () => setCurrent(c => (c - 1 + photos.length) % photos.length)
  const next = () => setCurrent(c => (c + 1) % photos.length)

  return (
    <>
      <div
        data-protected
        className="relative w-full aspect-[4/3] overflow-hidden rounded-t-xl group cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={photos[current].src}
          alt={photos[current].alt}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto precedente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto successiva"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setCurrent(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
                  aria-label={`Vai a foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={current}
        slides={photos.map(p => ({ src: p.src, alt: p.alt }))}
      />
    </>
  )
}
