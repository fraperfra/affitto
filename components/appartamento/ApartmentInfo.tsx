import type { Apartment } from '@/lib/apartments'

const AMENITY_ICONS: Record<string, string> = {
  'Wi-Fi incluso': '📶',
  'Completamente arredato': '🛋',
  'Riscaldamento autonomo': '🌡',
  'Lavatrice': '🧺',
  'Lavatrice in lavanderia privata': '🧺',
  'Cucina equipaggiata': '🍳',
  'Terrazzo privato': '🌿',
}

export function ApartmentInfo({ apartment }: { apartment: Apartment }) {
  return (
    <section className="py-12 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        {/* Descrizione */}
        <div className="mb-10">
          <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Descrizione</p>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-2xl">
            {apartment.longDescription}
          </p>
        </div>

        {/* Dettagli */}
        <div className="mb-10">
          <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-4">Dettagli</p>
          <div className="max-w-sm space-y-2">
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

        {/* Dotazioni */}
        <div>
          <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-4">Dotazioni</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {apartment.amenities.map(a => (
              <div
                key={a}
                className="flex items-center gap-3 bg-white border border-stone-100 rounded-xl px-4 py-3 shadow-sm"
              >
                <span className="text-xl shrink-0">{AMENITY_ICONS[a] ?? '✓'}</span>
                <span className="font-sans text-sm text-anthracite leading-tight">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
