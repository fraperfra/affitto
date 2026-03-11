'use client'
import { motion } from 'framer-motion'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    q: "Qual è la durata del contratto?",
    a: "La durata viene concordata direttamente con il locatore in base alle singole esigenze dell'inquilino. Contattaci per valutare insieme la soluzione più adatta.",
  },
  {
    q: "A quanto ammonta l'affitto mensile?",
    a: "Il canone mensile si concorderà con il locatore in base alle esigenze e alla durata del contratto. Invia la tua candidatura e ti contatteremo con tutti i dettagli.",
  },
  {
    q: "Le utenze sono incluse nell'affitto?",
    a: "No. Le utenze (luce, gas, acqua) sono interamente a carico dell'inquilino. Le modalità di attivazione e gestione verranno concordate al momento della firma del contratto.",
  },
  {
    q: "È richiesta una caparra?",
    a: "Sì, è previsto un deposito cauzionale il cui importo verrà concordato con il locatore prima della firma. La caparra viene restituita al termine del contratto, previa verifica dello stato dell'appartamento.",
  },
  {
    q: "Posso uscire anticipatamente dal contratto?",
    a: "Questa possibilità va concordata direttamente con il locatore. Qualsiasi variazione contrattuale richiede l'accordo scritto di entrambe le parti.",
  },
]

export function ContractInfo() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="contratto" className="py-8 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Informazioni importanti</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Contratto e Utenze</h2>
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
              Il canone mensile e le condizioni contrattuali{' '}
              <strong className="text-anthracite">si concordano in base alle singole esigenze</strong>{' '}
              dell&apos;inquilino. Ogni situazione è valutata individualmente dal locatore.
            </p>
            <p>
              Le <strong className="text-anthracite">utenze sono a carico dell&apos;inquilino</strong>: luce,
              gas e acqua vengono gestite direttamente dall&apos;affittuario. Le modalità operative vengono
              definite al momento della firma del contratto.
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
