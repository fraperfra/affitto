import { RoomCard } from './RoomCard'
import { photos } from '@/lib/photos'

export function Rooms() {
  return (
    <section id="stanze" className="py-24 px-4 bg-stone-50">
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
            name="Suite Privata"
            bathType="privato-esterno"
            rent={500}
            expenses={40}
            photos={photos['camera-1']}
            description="Camera matrimoniale/singola con bagno privato esclusivo, esterno alla camera. La soluzione ideale per chi cerca massima privacy e comfort. Ampia e luminosa, arredata con cura."
            delay={0}
          />
          <RoomCard
            name="Camera Doppia/Singola (A)"
            bathType="condiviso"
            sharedWith="Camera B"
            rent={420}
            expenses={40}
            photos={photos['camera-2']}
            description="Camera versatile, adatta sia a uso singolo che doppio. Condivide il bagno esclusivamente con la Camera B. Arredata con gusto, luminosa e ben proporzionata."
            delay={0.1}
          />
          <RoomCard
            name="Camera Doppia/Singola (B)"
            bathType="condiviso"
            sharedWith="Camera A"
            rent={420}
            expenses={40}
            photos={photos['camera-3']}
            description="Camera versatile, adatta sia a uso singolo che doppio. Condivide il bagno esclusivamente con la Camera A. Arredata con gusto, luminosa e ben proporzionata."
            delay={0.2}
          />
        </div>
      </div>
    </section>
  )
}
