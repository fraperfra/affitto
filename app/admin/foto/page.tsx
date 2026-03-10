import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Images } from 'lucide-react'
import { PhotoTabs } from '@/components/admin/foto/PhotoTabs'
import type { DBPhoto } from '@/components/admin/foto/PhotoSection'

const APARTMENT_SECTIONS = {
  app1: [
    { key: 'app1-hero', label: '🖼 Hero / Cover' },
    { key: 'app1-camera-1', label: '🛏 Camera 1' },
    { key: 'app1-camera-2', label: '🛏 Camera 2' },
    { key: 'app1-camera-3', label: '🛏 Camera 3' },
    { key: 'app1-cucina', label: '🍳 Cucina' },
    { key: 'app1-soggiorno', label: '🛋 Soggiorno' },
    { key: 'app1-bagno-1', label: '🚿 Bagno 1' },
    { key: 'app1-bagno-2', label: '🛁 Bagno 2' },
    { key: 'app1-planimetria', label: '🗺 Planimetria' },
  ],
  app2: [
    { key: 'app2-hero', label: '🖼 Hero / Cover' },
    { key: 'app2-camera', label: '🛏 Camera da Letto' },
    { key: 'app2-cucina', label: '🍳 Cucina' },
    { key: 'app2-salotto', label: '🛋 Salotto' },
    { key: 'app2-bagno-1', label: '🚿 Bagno En-Suite' },
    { key: 'app2-bagno-2', label: '🚿 Bagno 2' },
    { key: 'app2-terrazzo', label: '🌿 Terrazzo' },
    { key: 'app2-lavanderia', label: '🧺 Lavanderia' },
    { key: 'app2-planimetria', label: '🗺 Planimetria' },
  ],
  comune: [
    { key: 'galleria', label: '🖼 Galleria Fotografica' },
  ],
}

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

  const photosBySection = (allPhotos ?? []).reduce<Record<string, DBPhoto[]>>((acc, p) => {
    if (!acc[p.section]) acc[p.section] = []
    acc[p.section].push(p)
    return acc
  }, {})

  async function deletePhoto(photoId: string, storagePath: string) {
    'use server'
    const admin = createAdminClient()
    await admin.storage.from('photos').remove([storagePath])
    await admin.from('photos').delete().eq('id', photoId)
    revalidatePath('/admin/foto')
    revalidatePath('/')
    revalidatePath('/appartamento/1')
    revalidatePath('/appartamento/2')
  }

  async function setCover(photoId: string, section: string) {
    'use server'
    const admin = createAdminClient()
    await admin.from('photos').update({ is_cover: false }).eq('section', section)
    await admin.from('photos').update({ is_cover: true }).eq('id', photoId)
    revalidatePath('/admin/foto')
    revalidatePath('/')
    revalidatePath('/appartamento/1')
    revalidatePath('/appartamento/2')
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
    revalidatePath('/appartamento/1')
    revalidatePath('/appartamento/2')
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
    revalidatePath('/appartamento/1')
    revalidatePath('/appartamento/2')
  }

  const totalPhotos = (allPhotos ?? []).length

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-sans text-text-secondary hover:text-anthracite transition-colors">
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

        <PhotoTabs
          sections={APARTMENT_SECTIONS}
          photosBySection={photosBySection}
          deletePhoto={deletePhoto}
          setCover={setCover}
          addPhotoRecord={addPhotoRecord}
          reorderPhotos={reorderPhotos}
        />
      </main>
    </div>
  )
}
