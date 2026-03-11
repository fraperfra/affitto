'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Room } from '@/lib/apartments'
import type { AllPhotos } from '@/lib/photos-db'

function RoomGallery({
  room,
  photos,
  onClose,
}: {
  room: Room
  photos: { src: string; alt: string }[]
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex(i => (i - 1 + photos.length) % photos.length)
  const next = () => setIndex(i => (i + 1) % photos.length)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{room.icon}</span>
            <h3 className="font-serif text-white text-lg">{room.name}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-800">
          <Image
            key={index}
            src={photos[index].src}
            alt={photos[index].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {photos.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-gold scale-125' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}

        <p className="text-center font-sans text-xs text-white/40 mt-2">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  )
}

export function ApartmentRooms({ rooms, allPhotos }: { rooms: Room[]; allPhotos: AllPhotos }) {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)

  const activePhotos = activeRoom ? (allPhotos[activeRoom.photoSection] ?? []) : []

  return (
    <section className="py-12 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Spazi</p>
        <h2 className="font-serif text-3xl text-anthracite mb-8">Suddivisione degli ambienti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rooms.map((room) => {
            const cover = (allPhotos[room.photoSection] ?? [])[0]
            const hasPhotos = (allPhotos[room.photoSection] ?? []).length > 0
            return (
              <div
                key={room.id}
                onClick={() => hasPhotos && setActiveRoom(room)}
                className={`bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm transition-all ${
                  hasPhotos ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
                }`}
              >
                <div className="relative h-40 bg-stone-100">
                  {cover
                    ? <Image src={cover.src} alt={cover.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">{room.icon}</div>
                  }
                  {hasPhotos && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs font-sans px-3 py-1 rounded-full">
                        Vedi foto
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{room.icon}</span>
                      <h3 className="font-serif text-anthracite text-base">{room.name}</h3>
                    </div>
                    {hasPhotos && (
                      <span className="font-sans text-xs text-gold">
                        {(allPhotos[room.photoSection] ?? []).length} foto →
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-stone-500">{room.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {activeRoom && activePhotos.length > 0 && (
        <RoomGallery
          room={activeRoom}
          photos={activePhotos}
          onClose={() => setActiveRoom(null)}
        />
      )}
    </section>
  )
}
