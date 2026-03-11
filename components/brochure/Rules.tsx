'use client'
import { motion } from 'framer-motion'
import { CigaretteOff, PawPrint, Clock, Wrench, Paintbrush, Users } from 'lucide-react'

const rules = [
  { icon: CigaretteOff, text: "Vietato fumare all'interno degli appartamenti" },
  { icon: PawPrint, text: 'Animali domestici non ammessi' },
  { icon: Clock, text: 'Rispetto degli orari di silenzio: 22:00 – 08:00' },
  { icon: Wrench, text: 'Manutenzione ordinaria degli spazi comuni a carico dei coinquilini' },
  { icon: Paintbrush, text: "Nessuna modifica all'arredamento o alle pareti senza autorizzazione" },
  { icon: Users, text: 'Ospiti occasionali consentiti; ospiti fissi non autorizzati senza accordo' },
]

export function Rules() {
  return (
    <section id="regole" className="py-8 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Convivenza</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Regole della Casa</h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto">
            Per garantire un&apos;esperienza piacevole negli appartamenti, chiediamo il rispetto di alcune semplici regole.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-stone-100"
            >
              <Icon size={20} className="text-gold mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="font-sans text-sm text-anthracite leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
