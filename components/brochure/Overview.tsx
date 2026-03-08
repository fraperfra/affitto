'use client'
import { motion } from 'framer-motion'
import { Building2, Zap, Wind, ChefHat, ShieldCheck, Layers, Sofa, Thermometer } from 'lucide-react'
import { PhotoGallery } from './PhotoGallery'
import { photos } from '@/lib/photos'

const features = [
  { icon: Building2, label: 'Piano', value: 'Primo piano con ascensore' },
  { icon: Layers, label: 'Classe Energetica', value: 'A++ — Massima efficienza' },
  { icon: Wind, label: 'Infissi', value: 'Triplo vetro con camera a gas' },
  { icon: ShieldCheck, label: 'Porta', value: 'Blindata' },
  { icon: Thermometer, label: 'Climatizzazione', value: 'Aria condizionata (risc. e raff.)' },
  { icon: ChefHat, label: 'Cucina', value: 'Su misura con elettrodomestici SMEG' },
  { icon: Sofa, label: 'Soggiorno', value: 'Ampio e luminoso' },
  { icon: Zap, label: 'Consegna', value: 'Completamente arredato' },
]

export function Overview() {
  return (
    <section id="appartamento" className="py-24 px-4 bg-ivory">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">L&apos;immobile</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">L&apos;Appartamento</h2>
          <p className="font-sans text-text-secondary max-w-2xl mx-auto text-base leading-relaxed">
            Un appartamento di pregio nel cuore del centro storico di Reggio Emilia. Primo piano con ascensore,
            completamente arredato con materiali di qualità e dotazioni di prima scelta.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {features.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-stone-100 flex flex-col gap-2"
            >
              <Icon size={22} className="text-gold" strokeWidth={1.5} />
              <p className="font-sans text-xs text-text-secondary uppercase tracking-wider">{label}</p>
              <p className="font-sans text-sm text-anthracite font-medium leading-snug">{value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="font-serif text-xl text-anthracite mb-6 text-center">Galleria Fotografica</h3>
          <PhotoGallery photos={photos['appartamento']} columns={3} />
        </motion.div>
      </div>
    </section>
  )
}
