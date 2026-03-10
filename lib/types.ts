export type AppartamentoPreferito = 'appartamento_1' | 'appartamento_2' | 'indifferente'
export type DurataPermanenza = '6_mesi' | '12_mesi' | '18_mesi' | '24_mesi' | 'oltre_2_anni'
export type StatusCandidato = 'lavoratore' | 'autonomo' | 'altro'
export type StatoCandidatura = 'nuova' | 'in_revisione' | 'accettata' | 'rifiutata'

export interface Candidatura {
  id: string
  created_at: string
  nome: string
  cognome: string
  email: string
  telefono: string
  appartamento_preferito: AppartamentoPreferito
  durata_permanenza: DurataPermanenza
  status: StatusCandidato
  tipo_contratto?: string
  nome_azienda?: string
  tipo_attivita?: string
  settore?: string
  note?: string
  consenso_privacy: boolean
  stato_candidatura: StatoCandidatura
}
