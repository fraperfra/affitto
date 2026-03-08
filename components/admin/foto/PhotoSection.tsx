'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Star, Trash2, Upload, ChevronDown, ChevronUp, Loader2, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export interface DBPhoto {
  id: string
  section: string
  storage_path: string
  url: string
  alt: string
  order: number
  is_cover: boolean
}

interface Props {
  sectionKey: string
  sectionLabel: string
  photos: DBPhoto[]
  deletePhoto: (photoId: string, storagePath: string) => Promise<void>
  setCover: (photoId: string, section: string) => Promise<void>
  addPhotoRecord: (section: string, storagePath: string, url: string) => Promise<void>
  reorderPhotos: (section: string, orderedIds: string[]) => Promise<void>
}

export function PhotoSection({ sectionKey, sectionLabel, photos, deletePhoto, setCover, addPhotoRecord, reorderPhotos }: Props) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [uploadDragOver, setUploadDragOver] = useState(false)
  const [localPhotos, setLocalPhotos] = useState<DBPhoto[]>(photos)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Sync when parent updates
  if (photos !== localPhotos && !draggedId) {
    setLocalPhotos(photos)
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    const supabase = createClient()

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${sectionKey}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: false })
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)
        await addPhotoRecord(sectionKey, path, publicUrl)
      }
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (photo: DBPhoto) => {
    if (!confirm('Eliminare questa foto definitivamente?')) return
    setLoadingId(photo.id)
    await deletePhoto(photo.id, photo.storage_path)
    setLoadingId(null)
  }

  const handleSetCover = async (photo: DBPhoto) => {
    setLoadingId(photo.id)
    await setCover(photo.id, sectionKey)
    setLoadingId(null)
  }

  // Drag-to-reorder handlers
  const handleDragStart = (id: string) => setDraggedId(id)

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (id !== draggedId) setDragOverId(id)
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null); setDragOverId(null); return
    }
    const reordered = [...localPhotos]
    const fromIdx = reordered.findIndex(p => p.id === draggedId)
    const toIdx = reordered.findIndex(p => p.id === targetId)
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    setLocalPhotos(reordered)
    setDraggedId(null)
    setDragOverId(null)
    await reorderPhotos(sectionKey, reordered.map(p => p.id))
  }

  const handleDragEnd = () => { setDraggedId(null); setDragOverId(null) }

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Header accordion */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg text-anthracite">{sectionLabel}</span>
          <span className="font-sans text-xs text-text-secondary bg-stone-100 px-2 py-0.5 rounded-full">
            {localPhotos.length} foto
          </span>
        </div>
        {open
          ? <ChevronUp size={18} className="text-stone-400 shrink-0" />
          : <ChevronDown size={18} className="text-stone-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-stone-100">
          {localPhotos.length > 0 && (
            <>
              <p className="font-sans text-xs text-text-secondary mt-4 mb-2">
                Trascina le foto per cambiare l&apos;ordine · La prima è la copertina
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {localPhotos.map(photo => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => handleDragStart(photo.id)}
                    onDragOver={e => handleDragOver(e, photo.id)}
                    onDrop={e => handleDrop(e, photo.id)}
                    onDragEnd={handleDragEnd}
                    className={`relative group rounded-lg overflow-hidden aspect-square bg-stone-100 transition-all ${
                      draggedId === photo.id ? 'opacity-40 scale-95' : ''
                    } ${dragOverId === photo.id ? 'ring-2 ring-gold ring-offset-1' : ''}`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />

                    {/* Handle drag */}
                    <div className="absolute top-2 right-2 bg-black/40 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab z-10">
                      <GripVertical size={14} />
                    </div>

                    {/* Badge copertina */}
                    {photo.is_cover && (
                      <div className="absolute top-2 left-2 bg-gold text-white text-[10px] font-sans px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                        <Star size={10} fill="white" /> Copertina
                      </div>
                    )}

                    {/* Overlay azioni */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      {loadingId === photo.id ? (
                        <Loader2 size={20} className="text-white animate-spin" />
                      ) : (
                        <>
                          {!photo.is_cover && (
                            <button
                              onClick={() => handleSetCover(photo)}
                              className="bg-gold hover:bg-gold/90 text-white rounded-full p-2 transition-colors"
                              title="Imposta come copertina"
                            >
                              <Star size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(photo)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                            title="Elimina foto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Upload area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              uploadDragOver ? 'border-gold bg-gold/5' :
              uploading ? 'border-gold/40 bg-gold/5' :
              'border-stone-200 hover:border-gold/40 hover:bg-stone-50'
            }`}
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setUploadDragOver(true) }}
            onDragLeave={() => setUploadDragOver(false)}
            onDrop={e => { e.preventDefault(); setUploadDragOver(false); handleUpload(e.dataTransfer.files) }}
          >
            {uploading ? (
              <Loader2 size={28} className="mx-auto mb-2 text-gold animate-spin" />
            ) : (
              <Upload size={28} className="mx-auto mb-2 text-stone-400" strokeWidth={1.5} />
            )}
            <p className="font-sans text-sm text-text-secondary">
              {uploading ? 'Caricamento in corso...' : 'Clicca o trascina le foto qui'}
            </p>
            <p className="font-sans text-xs text-stone-400 mt-1">JPG, PNG, WebP · Puoi selezionare più file</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={e => handleUpload(e.target.files)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
