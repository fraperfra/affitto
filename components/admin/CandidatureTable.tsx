'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Candidatura, StatoCandidatura } from '@/lib/types'
import { StatusCandidatoBadge } from './StatusBadge'
import { Search, Download, ExternalLink } from 'lucide-react'

const CAMERA_LABELS: Record<string, string> = {
  camera_1: 'Camera 1 + Bagno Privato',
  camera_2: 'Camera 2',
  camera_3: 'Camera 3',
  indifferente: 'Indifferente',
}

interface Props {
  candidature: Candidatura[]
  onUpdateStato: (id: string, stato: StatoCandidatura) => Promise<void>
}

export function CandidatureTable({ candidature, onUpdateStato }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStato, setFilterStato] = useState('')
  const [filterCamera, setFilterCamera] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => candidature.filter(c => {
    const matchSearch = !search || `${c.nome} ${c.cognome} ${c.email}`.toLowerCase().includes(search.toLowerCase())
    const matchStato = !filterStato || c.stato_candidatura === filterStato
    const matchCamera = !filterCamera || c.camera_preferita === filterCamera
    const matchStatus = !filterStatus || c.status === filterStatus
    return matchSearch && matchStato && matchCamera && matchStatus
  }), [candidature, search, filterStato, filterCamera, filterStatus])

  const handleStato = async (id: string, stato: StatoCandidatura) => {
    setUpdatingId(id)
    await onUpdateStato(id, stato)
    setUpdatingId(null)
    router.refresh()
  }

  const exportCSV = () => {
    const headers = ['Data', 'Nome', 'Cognome', 'Email', 'Telefono', 'Status', 'Camera', 'Stato']
    const rows = filtered.map(c => [
      new Date(c.created_at).toLocaleDateString('it-IT'),
      c.nome, c.cognome, c.email, c.telefono,
      c.status,
      CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita,
      c.stato_candidatura,
    ])
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'candidature.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const sel = 'border border-stone-200 rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 text-anthracite'

  return (
    <div>
      {/* Filtri */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca nome, cognome, email..."
            className="pl-9 border border-stone-200 rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 w-56"
          />
        </div>
        <select value={filterStato} onChange={e => setFilterStato(e.target.value)} className={sel}>
          <option value="">Tutti gli stati</option>
          <option value="nuova">Nuova</option>
          <option value="in_revisione">In revisione</option>
          <option value="accettata">Accettata</option>
          <option value="rifiutata">Rifiutata</option>
        </select>
        <select value={filterCamera} onChange={e => setFilterCamera(e.target.value)} className={sel}>
          <option value="">Tutte le camere</option>
          <option value="camera_1">Camera 1 + Bagno Privato</option>
          <option value="camera_2">Camera 2</option>
          <option value="camera_3">Camera 3</option>
          <option value="indifferente">Indifferente</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={sel}>
          <option value="">Tutti i profili</option>
          <option value="studente">Studente</option>
          <option value="lavoratore">Lavoratore</option>
          <option value="autonomo">Autonomo</option>
          <option value="altro">Altro</option>
        </select>
        <button
          onClick={exportCSV}
          className="ml-auto flex items-center gap-1.5 text-sm font-sans text-text-secondary hover:text-anthracite border border-stone-200 rounded-lg px-3 py-2 hover:bg-stone-50 transition-colors"
        >
          <Download size={14} /> Esporta CSV
        </button>
      </div>

      {/* Tabella */}
      <div className="overflow-x-auto rounded-xl border border-stone-100 bg-white shadow-sm">
        <table className="w-full font-sans text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              {['Data', 'Candidato', 'Profilo', 'Camera', 'Email', 'Telefono', 'Stato', 'Azioni'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-secondary">
                  Nessuna candidatura trovata
                </td>
              </tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString('it-IT')}
                </td>
                <td className="px-4 py-3 font-medium text-anthracite whitespace-nowrap">
                  {c.nome} {c.cognome}
                </td>
                <td className="px-4 py-3">
                  <StatusCandidatoBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                  {CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita}
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${c.email}`} className="text-gold hover:underline">
                    {c.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{c.telefono}</td>
                <td className="px-4 py-3">
                  <select
                    value={c.stato_candidatura}
                    disabled={updatingId === c.id}
                    onChange={e => handleStato(c.id, e.target.value as StatoCandidatura)}
                    className="border border-stone-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gold/40 disabled:opacity-50"
                  >
                    <option value="nuova">Nuova</option>
                    <option value="in_revisione">In revisione</option>
                    <option value="accettata">Accettata</option>
                    <option value="rifiutata">Rifiutata</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => router.push(`/admin/candidato/${c.id}`)}
                    className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 font-medium"
                  >
                    Dettaglio <ExternalLink size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-xs text-text-secondary mt-2">{filtered.length} candidature</p>
    </div>
  )
}
