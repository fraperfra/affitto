import { createAdminClient } from './supabase/server'
import { photos as staticPhotos } from './photos'
import type { PhotoConfig } from './photos'

export type AllPhotos = Record<string, PhotoConfig[]>

export async function getPhotosFromDB(): Promise<AllPhotos> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('is_cover', { ascending: false })
      .order('order', { ascending: true })

    if (error || !data || data.length === 0) return staticPhotos

    // Per ogni sezione che ha foto nel DB, usa quelle (altrimenti fallback statico)
    const result: AllPhotos = { ...staticPhotos }
    const dbSections = Array.from(new Set<string>(data.map((p: { section: string }) => p.section)))

    for (const section of dbSections) {
      result[section] = data
        .filter((p: { section: string }) => p.section === section)
        .map((p: { url: string; alt: string; caption?: string }) => ({
          src: p.url,
          alt: p.alt || `Foto ${section}`,
          caption: p.caption ?? undefined,
          width: 1920,
          height: 1280,
        }))
    }

    return result
  } catch {
    return staticPhotos
  }
}
