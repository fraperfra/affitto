'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { candidaturaSchema, type CandidaturaFormData } from '@/lib/validations/candidatura'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-xs mt-1 font-sans">{message}</p>
}

const inputClass =
  'w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-anthracite bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all placeholder:text-stone-400'
const labelClass = 'block font-sans text-sm font-medium text-anthracite mb-1.5'

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CandidaturaFormData>({
    resolver: zodResolver(candidaturaSchema),
    defaultValues: { consenso_privacy: false },
  })

  const status = watch('status')

  const onSubmit = async (data: CandidaturaFormData) => {
    setServerError('')
    try {
      const res = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        setServerError(err.error || "Errore durante l'invio")
        return
      }
      setSubmitted(true)
    } catch {
      setServerError('Errore di connessione. Riprova.')
    }
  }

  if (submitted) {
    return (
      <section id="candidatura" className="py-16 px-4 bg-stone-50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
          >
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-3xl text-anthracite mb-3">Candidatura inviata!</h2>
            <p className="font-sans text-text-secondary">
              Grazie per il tuo interesse. Ti contatteremo presto.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="candidatura" className="py-16 px-4 bg-stone-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Candidati ora</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Form di Candidatura</h2>
          <p className="font-sans text-text-secondary">
            Compila il form per candidarti a uno dei nostri appartamenti.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6"
        >
          {/* Honeypot: campo nascosto, non deve essere compilato da umani */}
          <div className="hidden" aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </div>

          {/* Dati anagrafici */}
          <div>
            <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-stone-100">
              Dati Personali
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nome *</label>
                <input {...register('nome')} placeholder="Mario" className={inputClass} />
                <FieldError message={errors.nome?.message} />
              </div>
              <div>
                <label className={labelClass}>Cognome *</label>
                <input {...register('cognome')} placeholder="Rossi" className={inputClass} />
                <FieldError message={errors.cognome?.message} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Email *</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="mario@email.it"
                  className={inputClass}
                />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <label className={labelClass}>Telefono *</label>
                <input
                  {...register('telefono')}
                  type="tel"
                  placeholder="+39 333 1234567"
                  className={inputClass}
                />
                <FieldError message={errors.telefono?.message} />
              </div>
            </div>
          </div>

          {/* Appartamento preferito e Durata permanenza */}
          <div>
            <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-stone-100">
              Appartamento e Permanenza
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Appartamento preferito *</label>
                <select {...register('appartamento_preferito')} className={inputClass}>
                  <option value="">Seleziona...</option>
                  <option value="appartamento_1">Appartamento 1</option>
                  <option value="appartamento_2">Appartamento 2</option>
                  <option value="indifferente">Indifferente</option>
                </select>
                <FieldError message={errors.appartamento_preferito?.message} />
              </div>
              <div>
                <label className={labelClass}>Durata permanenza *</label>
                <select {...register('durata_permanenza')} className={inputClass}>
                  <option value="">Seleziona...</option>
                  <option value="6_mesi">6 mesi</option>
                  <option value="12_mesi">12 mesi</option>
                  <option value="18_mesi">18 mesi</option>
                  <option value="24_mesi">24 mesi</option>
                  <option value="oltre_2_anni">Oltre 2 anni</option>
                </select>
                <FieldError message={errors.durata_permanenza?.message} />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-stone-100">
              Situazione Lavorativa
            </h3>
            <label className={labelClass}>Status *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'lavoratore', label: 'Lavoratore dipendente' },
                { value: 'autonomo', label: 'Lavoratore autonomo' },
                { value: 'altro', label: 'Altro' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    {...register('status')}
                    value={opt.value}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="font-sans text-sm text-anthracite group-hover:text-gold transition-colors">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            <FieldError message={errors.status?.message} />
          </div>

          {/* Campi condizionali — Lavoratore dipendente */}
          {status === 'lavoratore' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Tipologia di contratto *</label>
                <select {...register('tipo_contratto')} className={inputClass}>
                  <option value="">Seleziona...</option>
                  <option value="indeterminato">Tempo indeterminato</option>
                  <option value="determinato">Tempo determinato</option>
                  <option value="apprendistato">Apprendistato</option>
                  <option value="altro">Altro</option>
                </select>
                <FieldError message={errors.tipo_contratto?.message} />
              </div>
              <div>
                <label className={labelClass}>Nome dell&apos;azienda *</label>
                <input
                  {...register('nome_azienda')}
                  placeholder="Es. Azienda SRL"
                  className={inputClass}
                />
                <FieldError message={errors.nome_azienda?.message} />
              </div>
            </motion.div>
          )}

          {/* Campi condizionali — Lavoratore autonomo */}
          {status === 'autonomo' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Tipo di attività *</label>
                <input
                  {...register('tipo_attivita')}
                  placeholder="Es. Partita IVA, libero professionista"
                  className={inputClass}
                />
                <FieldError message={errors.tipo_attivita?.message} />
              </div>
              <div>
                <label className={labelClass}>Settore *</label>
                <input
                  {...register('settore')}
                  placeholder="Es. IT, Marketing, Commercio"
                  className={inputClass}
                />
                <FieldError message={errors.settore?.message} />
              </div>
            </motion.div>
          )}


          {/* Note aggiuntive */}
          <div>
            <label className={labelClass}>Note aggiuntive (facoltativo)</label>
            <textarea
              {...register('note')}
              rows={4}
              placeholder="Qualcosa che vuoi farci sapere..."
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Consenso privacy */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('consenso_privacy')}
                className="accent-gold w-4 h-4 mt-0.5"
              />
              <span className="font-sans text-sm text-text-secondary">
                Ho letto e accetto la{' '}
                <a href="#" className="text-gold hover:underline">
                  privacy policy
                </a>{' '}
                e acconsento al trattamento dei dati personali ai sensi del GDPR *
              </span>
            </label>
            <FieldError message={errors.consenso_privacy?.message} />
          </div>

          {/* Errore server */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-sans text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold/90 disabled:opacity-60 text-white font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Invio in corso...
              </>
            ) : (
              'Invia la mia candidatura'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
