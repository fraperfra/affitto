'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Room } from '@/lib/apartments'
import type { AllPhotos } from '@/lib/photos-db'

export function ApartmentRooms({ rooms, allPhotos }: { rooms: Room[]; allPhotos: AllPhotos }) {
  return (
    <section className="py-12 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Spazi</p>
        <h2 className="font-serif text-3xl text-anthracite mb-8">Suddivisione degli ambienti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rooms.map((room, i) => {
            const cover = (allPhotos[room.photoSection] ?? [])[0]
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm"
              >
                <div className="relative h-40 bg-stone-100">
                  {cover
                    ? <Image src={cover.src} alt={cover.alt} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">{room.icon}</div>
                  }
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{room.icon}</span>
                    <h3 className="font-serif text-anthracite text-base">{room.name}</h3>
                  </div>
                  <p className="font-sans text-sm text-stone-500">{room.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
