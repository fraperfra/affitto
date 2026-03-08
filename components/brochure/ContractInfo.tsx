'use client'
import { motion } from 'framer-motion'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    q: 'Posso uscire anticipatamente dal contratto?',
    a: "Questa possibilità va concordata direttamente con il locatore. Il contratto è unico e intestato a tutti i coinquilini, pertanto qualsiasi variazione richiede l'accordo di tutte le parti.",
  },
  {
    q: 'Come vengono divise le utenze?',
    a: "È attiva una sola bolletta (luce/gas/internet) co-intestata tra i coinquilini. La gestione e suddivisione delle spese avviene internamente tra gli inquilini con le modalità che preferiscono.",
  },
]

export function ContractInfo() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="contratto" className="py-16 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Informazioni importanti</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Contratto &amp; Utenze</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-10"
        >
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle size={22} className="text-amber-600 mt-0.5 shrink-0" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-anthracite">Da leggere prima di candidarsi</h3>
          </div>
          <div className="font-sans text-text-secondary leading-relaxed space-y-3 text-sm md:text-base">
            <p>
              L&apos;appartamento prevede{' '}
              <strong className="text-anthracite">un unico contratto di locazione</strong>, intestato
              congiuntamente a tutti e tre gli inquilini (co-intestatari). Analogamente, sarà attiva{' '}
              <strong className="text-anthracite">una sola utenza</strong> (luce/gas/internet) co-intestata
              tra i coinquilini.
            </p>
            <p>
              Tutti i coinquilini{' '}
              <strong className="text-anthracite">condividono la responsabilità contrattuale</strong> e la
              gestione delle spese. È richiesta pertanto piena collaborazione e accordo tra i candidati
              selezionati.
            </p>
          </div>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-stone-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left font-sans font-medium text-anthracite hover:bg-stone-50 transition-colors"
              >
                {faq.q}
                <ChevronDown
                  size={18}
                  className={`text-gold transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 font-sans text-sm text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
