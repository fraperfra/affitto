import { z } from 'zod'

export const candidaturaSchema = z.object({
  nome: z.string().min(2, 'Nome obbligatorio'),
  cognome: z.string().min(2, 'Cognome obbligatorio'),
  email: z.string().email('Email non valida'),
  telefono: z.string().regex(/^(\+39)?[\s]?([0-9]{9,10})$/, 'Numero italiano non valido'),
  appartamento_preferito: z.enum(['appartamento_1', 'appartamento_2', 'indifferente']),
  durata_permanenza: z.enum(['6_mesi', '12_mesi', '18_mesi', '24_mesi', 'oltre_2_anni']),
  status: z.enum(['lavoratore', 'autonomo', 'altro']),
  tipo_contratto: z.string().optional(),
  nome_azienda: z.string().optional(),
  tipo_attivita: z.string().optional(),
  settore: z.string().optional(),
  note: z.string().optional(),
  consenso_privacy: z.boolean().refine(v => v === true, 'Consenso obbligatorio'),
  website: z.literal('').optional(),
}).superRefine((data, ctx) => {
  if (data.status === 'lavoratore') {
    if (!data.tipo_contratto) ctx.addIssue({ code: 'custom', path: ['tipo_contratto'], message: 'Obbligatorio' })
    if (!data.nome_azienda) ctx.addIssue({ code: 'custom', path: ['nome_azienda'], message: 'Obbligatorio' })
  }
  if (data.status === 'autonomo') {
    if (!data.tipo_attivita) ctx.addIssue({ code: 'custom', path: ['tipo_attivita'], message: 'Obbligatorio' })
    if (!data.settore) ctx.addIssue({ code: 'custom', path: ['settore'], message: 'Obbligatorio' })
  }
})

export type CandidaturaFormData = z.infer<typeof candidaturaSchema>
