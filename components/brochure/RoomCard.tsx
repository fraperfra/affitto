'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Bath, Euro, ChevronRight, Camera } from 'lucide-react'
import { PhotoGallery } from './PhotoGallery'
import { DetailModal } from './DetailModal'
import type { PhotoConfig } from '@/lib/photos'

interface Props {
  name: string
  bathType: 'privato' | 'privato-esterno' | 'condiviso'
  sharedWith?: string
  rent: number
  expenses: number
  photos: PhotoConfig[]
  description?: string
  delay?: number
}

export function RoomCard({ name, bathType, sharedWith, rent, expenses, photos, description, delay = 0 }: Props) {
  const [open, setOpen] = useState(false)
  const total = rent + expenses

  const bathLabel =
    bathType === 'privato' ? 'Bagno privato en-suite' :
    bathType === 'privato-esterno' ? 'Bagno privato esclusivo (esterno alla camera)' :
    `Bagno condiviso${sharedWith ? ` con ${sharedWith}` : ''}`

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden cursor-pointer group"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(true)}
        aria-label={`Apri dettagli ${name}`}
      >
        {/* Foto preview */}
        {photos.length === 0 ? (
          <div className="w-full aspect-[4/3] bg-stone-100 flex flex-col items-center justify-center gap-2 text-stone-400">
            <Camera size={32} strokeWidth={1} />
            <span className="text-sm font-sans">Foto in arrivo</span>
          </div>
        ) : (
          <>
            {/* Mobile: carosello orizzontale a scorrimento */}
            <div
              className="md:hidden flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onClick={e => e.stopPropagation()}
            >
              {photos.map((photo, i) => (
                <div
                  key={i}
                  data-protected
                  className="relative aspect-[4/3] w-full shrink-0 snap-center overflow-hidden"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>

            {/* Desktop: prima foto + badge */}
            <div data-protected className="relative aspect-[4/3] overflow-hidden hidden md:block">
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {photos.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white font-sans text-xs px-2.5 py-1 rounded-full">
                  +{photos.length - 1} foto
                </div>
              )}
            </div>
          </>
        )}

        {/* Info card */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-serif text-xl text-anthracite">{name}</h3>
            <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              <ChevronRight size={18} />
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm font-sans text-text-secondary mb-5">
            <Bath size={16} className="text-gold shrink-0" strokeWidth={1.5} />
            {bathType === 'privato' ? (
              <span>Bagno <strong className="text-anthracite">privato en-suite</strong></span>
            ) : bathType === 'privato-esterno' ? (
              <span>Bagno <strong className="text-anthracite">privato</strong> esclusivo (esterno)</span>
            ) : (
              <span>Bagno <strong className="text-anthracite">condiviso</strong>{sharedWith && ` con ${sharedWith}`}</span>
            )}
          </div>

          <div className="border-t border-stone-100 pt-4">
            <div className="flex justify-between text-sm font-sans text-text-secondary mb-1">
              <span>Affitto mensile</span>
              <span>€{rent}/mese</span>
            </div>
            <div className="flex justify-between text-sm font-sans text-text-secondary mb-3">
              <span>Spese condominiali</span>
              <span>€{expenses}/mese</span>
            </div>
            <div className="flex justify-between items-center font-sans font-semibold text-anthracite bg-stone-50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <Euro size={16} className="text-gold" strokeWidth={2} />
                <span>Totale mensile</span>
              </div>
              <span className="text-gold text-lg">€{total}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-sans text-text-secondary">
            <span>Tocca per vedere tutti i dettagli</span>
            <ChevronRight size={13} />
          </div>
        </div>
      </div>

      {/* Modal dettaglio */}
      <DetailModal open={open} onClose={() => setOpen(false)} title={name}>
        <div className="px-6 py-5 space-y-6">
          <PhotoGallery photos={photos} columns={2} />

          <div>
            <h3 className="font-serif text-xl text-anthracite mb-3">{name}</h3>
            {description && (
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">{description}</p>
            )}

            <div className="flex items-center gap-2.5 text-sm font-sans text-text-secondary mb-4 bg-stone-50 rounded-lg p-3">
              <Bath size={16} className="text-gold shrink-0" strokeWidth={1.5} />
              <span>{bathLabel}</span>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm font-sans text-text-secondary">
                <span>Affitto mensile</span>
                <span>€{rent}/mese</span>
              </div>
              <div className="flex justify-between text-sm font-sans text-text-secondary">
                <span>Spese condominiali</span>
                <span>€{expenses}/mese</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between items-center font-sans font-semibold text-anthracite">
                <div className="flex items-center gap-1.5">
                  <Euro size={15} className="text-gold" strokeWidth={2} />
                  <span>Totale mensile</span>
                </div>
                <span className="text-gold text-xl">€{total}</span>
              </div>
            </div>
          </div>

          <a
            href="#candidatura"
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-gold hover:bg-gold/90 text-white font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            Richiedi questa camera — €{total}/mese
          </a>
        </div>
      </DetailModal>
    </>
  )
}
