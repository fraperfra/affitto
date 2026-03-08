'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { PhotoGallery } from './PhotoGallery'
import { DetailModal } from './DetailModal'
import type { AllPhotos } from '@/lib/photos-db'

const spaces = [
  {
    key: 'cucina',
    title: 'La Cucina',
    description: 'Cucina su misura di generose dimensioni, dotata di elettrodomestici SMEG di alta qualità: frigorifero, forno, piano cottura e lavastoviglie. Un ambiente dove cucinare diventa un piacere.',
  },
  {
    key: 'soggiorno',
    title: 'Il Soggiorno',
    description: 'Ampio soggiorno luminoso, arredato con gusto e attenzione ai dettagli. Lo spazio ideale per rilassarsi e condividere momenti con i coinquilini.',
  },
  {
    key: 'bagno-condiviso',
    title: 'Il Bagno Condiviso',
    description: 'Bagno condiviso tra Camera A e Camera B, moderno e ben attrezzato. Accessibile comodamente da entrambe le camere.',
  },
]

function SpaceCard({ space, index, allPhotos }: { space: typeof spaces[0]; index: number; allPhotos: AllPhotos }) {
  const [open, setOpen] = useState(false)
  const spacePhotos = allPhotos[space.key] ?? []

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        {/* Testo */}
        <div className={index % 2 === 1 ? 'md:order-2' : ''}>
          <h3 className="font-serif text-2xl text-anthracite mb-3">{space.title}</h3>
          <p className="font-sans text-text-secondary leading-relaxed mb-5">{space.description}</p>
          {spacePhotos.length > 0 && (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-gold hover:text-gold/80 border border-gold/30 hover:border-gold/60 rounded-full px-5 py-2.5 transition-all hover:scale-[1.02] active:scale-95"
            >
              Vedi tutte le foto
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        {/* Foto preview */}
        <div className={index % 2 === 1 ? 'md:order-1' : ''}>
          {spacePhotos.length === 0 ? (
            <div className="w-full aspect-[4/3] bg-stone-100 rounded-xl flex items-center justify-center text-stone-400 font-sans text-sm">
              Foto in arrivo
            </div>
          ) : (
            <>
              {/* Mobile: carosello orizzontale a scorrimento */}
              <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-3">
                {spacePhotos.map((photo, i) => (
                  <div
                    key={i}
                    data-protected
                    className="relative aspect-[4/3] w-[82vw] max-w-sm shrink-0 snap-center rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="82vw"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: prima foto + badge + hover overlay */}
              <div
                data-protected
                className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group hidden md:block"
                onClick={() => setOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setOpen(true)}
                aria-label={`Apri galleria ${space.title}`}
              >
                <Image
                  src={spacePhotos[0].src}
                  alt={spacePhotos[0].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="50vw"
                  priority
                />
                {spacePhotos.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white font-sans text-xs px-2.5 py-1 rounded-full">
                    +{spacePhotos.length - 1} foto
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors rounded-xl flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-anthracite font-sans text-sm font-medium px-4 py-2 rounded-full flex items-center gap-1.5">
                    Vedi tutto <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Modal dettaglio */}
      <DetailModal open={open} onClose={() => setOpen(false)} title={space.title}>
        <div className="px-6 py-5 space-y-6">
          <PhotoGallery photos={spacePhotos} columns={2} />

          <div>
            <h3 className="font-serif text-xl text-anthracite mb-3">{space.title}</h3>
            <p className="font-sans text-text-secondary leading-relaxed">{space.description}</p>
          </div>

          <a
            href="#candidatura"
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-anthracite hover:bg-anthracite/90 text-white font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            Candidati per vivere qui
          </a>
        </div>
      </DetailModal>
    </>
  )
}

export function CommonSpaces({ allPhotos }: { allPhotos: AllPhotos }) {
  return (
    <section id="spazi-comuni" className="py-24 px-4 bg-ivory">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Vivere insieme</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Spazi Comuni</h2>
        </div>

        <div className="flex flex-col gap-20">
          {spaces.map((space, i) => (
            <SpaceCard key={space.key} space={space} index={i} allPhotos={allPhotos} />
          ))}
        </div>
      </div>
    </section>
  )
}
