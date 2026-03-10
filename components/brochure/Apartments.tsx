import { apartments } from '@/lib/apartments'
import { ApartmentCard } from './ApartmentCard'
import type { AllPhotos } from '@/lib/photos-db'

export function Apartments({ allPhotos }: { allPhotos: AllPhotos }) {
  return (
    <section id="appartamenti" className="py-16 px-4 bg-ivory">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Disponibilità</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">I Nostri Appartamenti</h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto text-base">
            Due appartamenti indipendenti, affittati per intero. Scegli quello che fa per te.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {apartments.map((apt, i) => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              coverPhoto={(allPhotos[apt.heroSection] ?? [])[0]}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
