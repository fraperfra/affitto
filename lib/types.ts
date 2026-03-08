export type CameraPreferita = 'camera_1' | 'camera_2' | 'camera_3' | 'indifferente'
export type StatusCandidato = 'studente' | 'lavoratore' | 'autonomo' | 'altro'
export type StatoCandidatura = 'nuova' | 'in_revisione' | 'accettata' | 'rifiutata'

export interface Candidatura {
  id: string
  created_at: string
  nome: string
  cognome: string
  email: string
  telefono: string
  camera_preferita: CameraPreferita
  status: StatusCandidato
  tipo_contratto?: string
  nome_azienda?: string
  tipo_attivita?: string
  settore?: string
  universita?: string
  garanzie?: string
  tipo_contratto_garante?: string
  azienda_garante?: string
  note?: string
  consenso_privacy: boolean
  stato_candidatura: StatoCandidatura
}
