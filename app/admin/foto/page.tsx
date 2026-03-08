import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Images } from 'lucide-react'
import { PhotoSection } from '@/components/admin/foto/PhotoSection'
import type { DBPhoto } from '@/components/admin/foto/PhotoSection'

const SECTIONS = [
  { key: 'appartamento', label: 'Appartamento — Hero (slideshow principale)' },
  { key: 'galleria', label: 'Galleria Fotografica (sezione dedicata)' },
  { key: 'camera-1', label: 'Camera 1 + Bagno Privato' },
  { key: 'camera-2', label: 'Camera 2' },
  { key: 'camera-3', label: 'Camera 3' },
  { key: 'cucina', label: 'Cucina' },
  { key: 'soggiorno', label: 'Soggiorno' },
  { key: 'bagno-condiviso', label: 'Bagno Condiviso' },
]

export default async function FotoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const admin = createAdminClient()
  const { data: allPhotos } = await admin
    .from('photos')
    .select('*')
    .order('is_cover', { ascending: false })
    .order('order', { ascending: true })

  const grouped: Record<string, DBPhoto[]> = {}
  for (const s of SECTIONS) {
    grouped[s.key] = (allPhotos ?? []).filter((p: DBPhoto) => p.section === s.key)
  }

  // Server Actions
  async function deletePhoto(photoId: string, storagePath: string) {
    'use server'
    const admin = createAdminClient()
    await admin.storage.from('photos').remove([storagePath])
    await admin.from('photos').delete().eq('id', photoId)
    revalidatePath('/admin/foto')
    revalidatePath('/')
  }

  async function setCover(photoId: string, section: string) {
    'use server'
    const admin = createAdminClient()
    await admin.from('photos').update({ is_cover: false }).eq('section', section)
    await admin.from('photos').update({ is_cover: true }).eq('id', photoId)
    revalidatePath('/admin/foto')
    revalidatePath('/')
  }

  async function reorderPhotos(section: string, orderedIds: string[]) {
    'use server'
    const admin = createAdminClient()
    await Promise.all(
      orderedIds.map((id, index) =>
        admin.from('photos').update({ order: index }).eq('id', id)
      )
    )
    revalidatePath('/admin/foto')
    revalidatePath('/')
  }

  async function addPhotoRecord(section: string, storagePath: string, url: string) {
    'use server'
    const admin = createAdminClient()
    const { data: existing } = await admin.from('photos').select('id').eq('section', section)
    const isCover = !existing || existing.length === 0
    await admin.from('photos').insert({
      section,
      storage_path: storagePath,
      url,
      alt: `Foto ${section}`,
      order: 999,
      is_cover: isCover,
    })
    revalidatePath('/admin/foto')
    revalidatePath('/')
  }

  const totalPhotos = (allPhotos ?? []).length

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-sm font-sans text-text-secondary hover:text-anthracite transition-colors"
        >
          <ArrowLeft size={16} /> Torna alla dashboard
        </Link>
        <div className="flex items-center gap-2 text-sm font-sans text-text-secondary">
          <Images size={15} />
          <span>{totalPhotos} foto totali</span>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-anthracite mb-1">Gestione Foto</h1>
          <p className="font-sans text-sm text-text-secondary">
            Carica, elimina e scegli la foto di copertina per ogni sezione. Le modifiche si riflettono subito sul sito.
          </p>
        </div>

        <div className="space-y-4">
          {SECTIONS.map(section => (
            <PhotoSection
              key={section.key}
              sectionKey={section.key}
              sectionLabel={section.label}
              photos={grouped[section.key]}
              deletePhoto={deletePhoto}
              setCover={setCover}
              addPhotoRecord={addPhotoRecord}
              reorderPhotos={reorderPhotos}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
