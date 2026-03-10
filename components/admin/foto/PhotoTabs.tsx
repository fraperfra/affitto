'use client'
import { useState } from 'react'
import { PhotoSection, type DBPhoto } from './PhotoSection'

interface SectionDef {
  key: string
  label: string
}

interface PhotoActions {
  deletePhoto: (photoId: string, storagePath: string) => Promise<void>
  setCover: (photoId: string, section: string) => Promise<void>
  addPhotoRecord: (section: string, storagePath: string, url: string) => Promise<void>
  reorderPhotos: (section: string, orderedIds: string[]) => Promise<void>
}

interface Props extends PhotoActions {
  sections: {
    app1: SectionDef[]
    app2: SectionDef[]
    comune: SectionDef[]
  }
  photosBySection: Record<string, DBPhoto[]>
}

const TABS = [
  { id: 'app1' as const, label: 'Appartamento 1' },
  { id: 'app2' as const, label: 'Appartamento 2' },
  { id: 'comune' as const, label: 'Comune' },
]

export function PhotoTabs({ sections, photosBySection, deletePhoto, setCover, addPhotoRecord, reorderPhotos }: Props) {
  const [active, setActive] = useState<'app1' | 'app2' | 'comune'>('app1')

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-5 py-2 rounded-lg font-sans text-sm transition-all ${
              active === tab.id ? 'bg-[#C9A96E] text-white' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sections[active].map(section => (
          <PhotoSection
            key={section.key}
            sectionKey={section.key}
            sectionLabel={section.label}
            photos={photosBySection[section.key] ?? []}
            deletePhoto={deletePhoto}
            setCover={setCover}
            addPhotoRecord={addPhotoRecord}
            reorderPhotos={reorderPhotos}
          />
        ))}
      </div>
    </div>
  )
}
