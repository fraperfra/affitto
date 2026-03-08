import { z } from 'zod'

export const candidaturaSchema = z.object({
  nome: z.string().min(2, 'Nome obbligatorio'),
  cognome: z.string().min(2, 'Cognome obbligatorio'),
  email: z.string().email('Email non valida'),
  telefono: z.string().regex(/^(\+39)?[\s]?([0-9]{9,10})$/, 'Numero italiano non valido'),
  camera_preferita: z.enum(['camera_1', 'camera_2', 'camera_3', 'indifferente']),
  status: z.enum(['studente', 'lavoratore', 'autonomo', 'altro']),
  tipo_contratto: z.string().optional(),
  nome_azienda: z.string().optional(),
  tipo_attivita: z.string().optional(),
  settore: z.string().optional(),
  universita: z.string().optional(),
  garanzie: z.enum(['1_genitore', '2_genitori', 'nessuno']).optional(),
  tipo_contratto_garante: z.string().optional(),
  azienda_garante: z.string().optional(),
  note: z.string().optional(),
  consenso_privacy: z.boolean().refine(v => v === true, 'Consenso obbligatorio'),
  website: z.literal('').optional(), // honeypot anti-spam
}).superRefine((data, ctx) => {
  if (data.status === 'lavoratore') {
    if (!data.tipo_contratto) ctx.addIssue({ code: 'custom', path: ['tipo_contratto'], message: 'Obbligatorio' })
    if (!data.nome_azienda) ctx.addIssue({ code: 'custom', path: ['nome_azienda'], message: 'Obbligatorio' })
  }
  if (data.status === 'autonomo') {
    if (!data.tipo_attivita) ctx.addIssue({ code: 'custom', path: ['tipo_attivita'], message: 'Obbligatorio' })
    if (!data.settore) ctx.addIssue({ code: 'custom', path: ['settore'], message: 'Obbligatorio' })
  }
  if (data.status === 'studente') {
    if (!data.universita) ctx.addIssue({ code: 'custom', path: ['universita'], message: 'Obbligatorio' })
    if (!data.garanzie) ctx.addIssue({ code: 'custom', path: ['garanzie'], message: 'Obbligatorio' })
  }
})

export type CandidaturaFormData = z.infer<typeof candidaturaSchema>
