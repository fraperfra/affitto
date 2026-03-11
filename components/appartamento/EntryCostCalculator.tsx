export function EntryCostCalculator({ price }: { price: number }) {
  const fmt = (n: number) => `€ ${n.toLocaleString('it-IT')}`

  const rows = [
    { label: 'Cauzione', detail: '3 mesi', amount: price * 3 },
    { label: 'Primo mese di affitto', detail: 'mese corrente', amount: price },
    { label: 'Provvigione agenzia', detail: '1 mensilità', amount: price },
  ]

  const total = rows.reduce((acc, r) => acc + r.amount, 0)

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-4">Costo di ingresso</p>

        <div className="max-w-sm">
          <div className="space-y-2 mb-4">
            {rows.map(row => (
              <div key={row.label} className="flex justify-between items-baseline border-b border-stone-100 pb-2">
                <div>
                  <span className="font-sans text-sm text-anthracite">{row.label}</span>
                  <span className="font-sans text-xs text-stone-400 ml-2">({row.detail})</span>
                </div>
                <span className="font-sans text-sm text-anthracite tabular-nums">{fmt(row.amount)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-baseline pt-2">
            <span className="font-sans text-sm font-semibold text-anthracite">Totale stimato</span>
            <span className="font-serif text-2xl font-medium text-anthracite tabular-nums">{fmt(total)}</span>
          </div>

          <p className="font-sans text-xs text-stone-400 mt-3 leading-relaxed">
            Stima indicativa. L&apos;importo esatto verrà definito in fase di stipula del contratto.
          </p>
        </div>
      </div>
    </section>
  )
}
