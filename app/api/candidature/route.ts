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
    if (error) {
      console.error('Supabase error:', JSON.stringify(error))
      return NextResponse.json({ error: `DB: ${error.message} (code: ${error.code})` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Errore salvataggio candidatura:', message)
    return NextResponse.json({ error: `Errore interno: ${message}` }, { status: 500 })
  }
}
