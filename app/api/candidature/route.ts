import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { candidaturaSchema } from '@/lib/validations/candidatura'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot anti-spam: se il campo website è compilato, è un bot
    if (body.website) {
      return NextResponse.json({ success: true }) // risposta silente ai bot
    }

    const parsed = candidaturaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Rimuovi il campo honeypot prima di salvare
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { website: _website, ...data } = parsed.data
    const supabase = createAdminClient()
    const { error } = await supabase.from('candidature').insert([data])
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Errore salvataggio candidatura:', err)
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 })
  }
}
