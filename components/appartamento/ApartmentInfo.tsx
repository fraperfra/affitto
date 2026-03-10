import type { Apartment } from '@/lib/apartments'

export function ApartmentInfo({ apartment }: { apartment: Apartment }) {
  return (
    <section className="py-12 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Descrizione</p>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-2xl">
            {apartment.longDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-4">Dettagli</p>
            <div className="space-y-2">
              {apartment.details.map(d => (
                <div key={d.label} className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="font-sans text-sm text-stone-500">{d.label}</span>
                  <span className="font-sans text-sm font-medium text-anthracite">{d.value}</span>
                </div>
              ))}
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="font-sans text-sm text-stone-500">Affitto mensile</span>
                <span className="font-serif text-lg font-medium text-anthracite">€ {apartment.price.toLocaleString('it-IT')}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-4">Dotazioni</p>
            <ul className="space-y-2">
              {apartment.amenities.map(a => (
                <li key={a} className="flex items-center gap-2 font-sans text-sm text-stone-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
