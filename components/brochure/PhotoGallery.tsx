'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { PhotoConfig } from '@/lib/photos'

interface Props {
  photos: PhotoConfig[]
  columns?: 2 | 3
}

export function PhotoGallery({ photos, columns = 3 }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="w-full h-48 bg-stone-100 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400">
        <Camera size={32} strokeWidth={1} />
        <span className="text-sm font-sans">Foto in arrivo</span>
      </div>
    )
  }

  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'

  return (
    <>
      <div className={`grid ${gridCols} gap-2`}>
        {photos.map((photo, i) => (
          <div
            key={i}
            data-protected
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {photo.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity font-sans">
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
  )
}
