import { RoomCard } from './RoomCard'
import type { AllPhotos } from '@/lib/photos-db'

export function Rooms({ allPhotos }: { allPhotos: AllPhotos }) {
  return (
    <section id="stanze" className="py-16 px-4 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Disponibilità</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Le Stanze</h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto text-base">
            Tre camere indipendenti, ognuna con carattere e dotazioni proprie. Tocca una camera per vedere tutte le foto e i dettagli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoomCard
            name="Camera 1 + Bagno Privato"
            bathType="privato-esterno"
            rent={500}
            expenses={40}
            photos={allPhotos['camera-1'] ?? []}
            description="Camera matrimoniale/singola con bagno privato esclusivo, esterno alla camera. La soluzione ideale per chi cerca massima privacy e comfort. Ampia e luminosa, consegnata completa di arredo."
          />
          <RoomCard
            name="Camera 2"
            bathType="condiviso"
            sharedWith="Camera 3"
            rent={420}
            expenses={40}
            photos={allPhotos['camera-2'] ?? []}
            description="Camera versatile, adatta sia a uso singolo che doppio. Condivide il bagno esclusivamente con la Camera 3. Luminosa e ben proporzionata, consegnata completa di arredo."
          />
          <RoomCard
            name="Camera 3"
            bathType="condiviso"
            sharedWith="Camera 2"
            rent={420}
            expenses={40}
            photos={allPhotos['camera-3'] ?? []}
            description="Camera versatile, adatta sia a uso singolo che doppio. Condivide il bagno esclusivamente con la Camera 2. Luminosa e ben proporzionata, consegnata completa di arredo."
          />
        </div>
      </div>
    </section>
  )
}
