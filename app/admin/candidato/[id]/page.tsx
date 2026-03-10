import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import type { Candidatura, StatoCandidatura } from '@/lib/types'
import { StatoCandidaturaBadge, StatusCandidatoBadge } from '@/components/admin/StatusBadge'
import { DeleteCandidaturaButton } from '@/components/admin/DeleteCandidaturaButton'
import { ArrowLeft } from 'lucide-react'

const APPARTAMENTO_LABELS: Record<string, string> = {
  appartamento_1: 'Appartamento 1',
  appartamento_2: 'Appartamento 2',
  indifferente: 'Indifferente',
}

const DURATA_PERMANENZA_LABELS: Record<string, string> = {
  '6_mesi': '6 mesi',
  '12_mesi': '12 mesi',
  '18_mesi': '18 mesi',
  '24_mesi': '24 mesi',
  'oltre_2_anni': 'Oltre 2 anni',
}

export default async function CandidatoPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminClient = createAdminClient()
  const { data } = await adminClient.from('candidature').select('*').eq('id', id).single()
  if (!data) notFound()
  const c = data as Candidatura

  async function updateStato(formData: FormData) {
    'use server'
    const stato = formData.get('stato') as StatoCandidatura
    const admin = createAdminClient()
    await admin.from('candidature').update({ stato_candidatura: stato }).eq('id', id)
    revalidatePath(`/admin/candidato/${id}`)
  }

  async function deleteCandidatura() {
    'use server'
    const admin = createAdminClient()
    await admin.from('candidature').delete().eq('id', id)
    redirect('/admin/dashboard')
  }

  function Row({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null
    return (
      <div className="flex flex-col sm:flex-row sm:gap-4 py-1">
        <dt className="font-sans text-xs text-text-secondary uppercase tracking-wider w-48 shrink-0">
          {label}
        </dt>
        <dd className="font-sans text-sm text-anthracite">{value}</dd>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-sm font-sans text-text-secondary hover:text-anthracite transition-colors"
        >
          <ArrowLeft size={16} /> Torna alla lista
        </Link>
      </header>
      <main className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-anthracite">{c.nome} {c.cognome}</h1>
              <p className="font-sans text-xs text-text-secondary mt-1">
                Inviata il{' '}
                {new Date(c.created_at).toLocaleDateString('it-IT', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <StatusCandidatoBadge status={c.status} />
              <StatoCandidaturaBadge stato={c.stato_candidatura} />
            </div>
          </div>

          <section className="mb-8">
            <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">
              Dati Anagrafici
            </h2>
            <dl className="space-y-1">
              <Row label="Email" value={c.email} />
              <Row label="Telefono" value={c.telefono} />
              <Row label="Appartamento preferito" value={APPARTAMENTO_LABELS[c.appartamento_preferito] ?? c.appartamento_preferito} />
              <Row label="Durata permanenza" value={DURATA_PERMANENZA_LABELS[c.durata_permanenza] ?? c.durata_permanenza} />
            </dl>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">
              Situazione
            </h2>
            <dl className="space-y-1">
              {c.status === 'lavoratore' && (
                <>
                  <Row label="Tipo contratto" value={c.tipo_contratto} />
                  <Row label="Azienda" value={c.nome_azienda} />
                </>
              )}
              {c.status === 'autonomo' && (
                <>
                  <Row label="Tipo attività" value={c.tipo_attivita} />
                  <Row label="Settore" value={c.settore} />
                </>
              )}
            </dl>
          </section>

          {c.note && (
            <section className="mb-8">
              <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">
                Note
              </h2>
              <p className="font-sans text-sm text-text-secondary bg-stone-50 rounded-lg p-4 leading-relaxed">
                {c.note}
              </p>
            </section>
          )}

          <section className="mb-8">
            <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">
              Gestione Candidatura
            </h2>
            <form action={updateStato} className="flex items-center gap-3">
              <select
                name="stato"
                defaultValue={c.stato_candidatura}
                className="border border-stone-200 rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <option value="nuova">Nuova</option>
                <option value="in_revisione">In revisione</option>
                <option value="accettata">Accettata</option>
                <option value="rifiutata">Rifiutata</option>
              </select>
              <button
                type="submit"
                className="bg-gold hover:bg-gold/90 text-white font-sans text-sm font-medium px-4 py-2 rounded-lg transition-all"
              >
                Aggiorna stato
              </button>
            </form>
          </section>

          <DeleteCandidaturaButton deleteCandidatura={deleteCandidatura} />
        </div>
      </main>
    </div>
  )
}
