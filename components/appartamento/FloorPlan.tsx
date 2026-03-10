'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { PhotoConfig } from '@/lib/photos'

export function FloorPlan({ photos }: { photos: PhotoConfig[] }) {
  const [zoomed, setZoomed] = useState(false)
  if (photos.length === 0) return null
  const photo = photos[0]

  return (
    <section className="py-12 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Planimetria</p>
        <h2 className="font-serif text-3xl text-anthracite mb-8">Pianta dell&apos;appartamento</h2>
        <div className="relative cursor-zoom-in rounded-xl overflow-hidden border border-stone-200 bg-stone-50 min-h-[300px]" onClick={() => setZoomed(true)}>
          <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="w-full h-auto object-contain" />
          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-stone-500 font-sans text-xs px-2 py-1 rounded-full">
            Clicca per ingrandire
          </div>
        </div>
        {zoomed && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoomed(false)}>
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
    </section>
  )
}
