import type { StatoCandidatura, StatusCandidato } from '@/lib/types'

const statoConfig: Record<StatoCandidatura, { label: string; className: string }> = {
  nuova:        { label: 'Nuova',        className: 'bg-blue-100 text-blue-700' },
  in_revisione: { label: 'In revisione', className: 'bg-amber-100 text-amber-700' },
  accettata:    { label: 'Accettata',    className: 'bg-green-100 text-green-700' },
  rifiutata:    { label: 'Rifiutata',   className: 'bg-red-100 text-red-700' },
}

const statusConfig: Record<StatusCandidato, { label: string; className: string }> = {
  studente:   { label: 'Studente',   className: 'bg-purple-100 text-purple-700' },
  lavoratore: { label: 'Lavoratore', className: 'bg-cyan-100 text-cyan-700' },
  autonomo:   { label: 'Autonomo',   className: 'bg-orange-100 text-orange-700' },
  altro:      { label: 'Altro',      className: 'bg-stone-100 text-stone-600' },
}

export function StatoCandidaturaBadge({ stato }: { stato: StatoCandidatura }) {
  const cfg = statoConfig[stato] ?? statoConfig.nuova
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

export function StatusCandidatoBadge({ status }: { status: StatusCandidato }) {
  const cfg = statusConfig[status] ?? statusConfig.altro
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
