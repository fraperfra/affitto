# Apartments Restructure Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertire il sito da camere singole a 2 appartamenti interi con pagine di dettaglio, aggiornare admin foto con tab per appartamento, aggiornare form candidatura.

**Architecture:** Config statica in `lib/apartments.ts` per i dati degli appartamenti; pagine dinamiche `/appartamento/[id]`; admin foto ristrutturato con 3 tab (App.1 / App.2 / Comune); form aggiornato senza campi studente e con durata permanenza.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase, React Hook Form + Zod, Framer Motion, Lucide React

**Spec:** `docs/superpowers/specs/2026-03-10-apartments-restructure-design.md`

**Note sulle decisioni di design:**
- `ApartmentInfo.tsx` unifica `ApartmentDetails` + `ApartmentAmenities` dello spec (componente unico, responsabilità chiari)
- `PhotoTabs.tsx` corrisponde a `ApartmentPhotoTabs` dello spec (nome semplificato)

---

## Pre-condizione: Migration Supabase

> Fare prima di qualsiasi altra cosa. La tabella `candidature` ha colonne `camera_preferita` e non ha `appartamento_preferito`/`durata_permanenza`.

- [ ] **Step 1: Esegui questa SQL nel pannello Supabase → SQL Editor**

```sql
ALTER TABLE candidature
  ADD COLUMN IF NOT EXISTS appartamento_preferito text,
  ADD COLUMN IF NOT EXISTS durata_permanenza text;
```

Questa migration è non-distruttiva: le colonne vecchie rimangono, quelle nuove vengono aggiunte. Le candidature esistenti avranno NULL nei nuovi campi.

- [ ] **Step 2: Verifica nel pannello Supabase → Table Editor che le colonne esistano**

---

## Chunk 1: Foundation — Dati e Tipi

### Task 1: lib/apartments.ts — Config statica appartamenti

**Files:**
- Create: `lib/apartments.ts`

- [ ] **Step 1: Crea `lib/apartments.ts`**

```typescript
export interface Room {
  id: string
  name: string
  description: string
  photoSection: string // chiave sezione foto in Supabase
  icon: string         // emoji per la card
}

export interface Apartment {
  id: '1' | '2'
  name: string
  slug: string
  description: string
  longDescription: string
  price: number
  floor: string
  amenities: string[]
  details: { label: string; value: string }[]
  rooms: Room[]
  heroSection: string        // chiave sezione foto hero
  planimetriaSection: string // chiave sezione planimetria
}

export const apartments: Apartment[] = [
  {
    id: '1',
    name: 'Appartamento 1',
    slug: '1',
    description: 'Ampio appartamento con 3 camere da letto, soggiorno e cucina abitabile.',
    longDescription: 'Spazioso e luminoso, l\'Appartamento 1 offre tre camere da letto indipendenti, due bagni, una grande cucina abitabile e un soggiorno confortevole. Ideale per famiglie o coinquilini che cercano spazio e comfort.',
    price: 1200,
    floor: 'Primo piano',
    amenities: ['Wi-Fi incluso', 'Completamente arredato', 'Riscaldamento autonomo', 'Lavatrice', 'Cucina equipaggiata'],
    details: [
      { label: 'Piano', value: '1°' },
      { label: 'Camere da letto', value: '3' },
      { label: 'Bagni', value: '2' },
      { label: 'Cucina', value: 'Abitabile' },
    ],
    rooms: [
      { id: 'camera-1', name: 'Camera 1', description: 'Camera matrimoniale luminosa con ampio armadio.', photoSection: 'app1-camera-1', icon: '🛏' },
      { id: 'camera-2', name: 'Camera 2', description: 'Camera doppia con affaccio interno.', photoSection: 'app1-camera-2', icon: '🛏' },
      { id: 'camera-3', name: 'Camera 3', description: 'Camera singola o studio, versatile e accogliente.', photoSection: 'app1-camera-3', icon: '🛏' },
      { id: 'cucina', name: 'Cucina Abitabile', description: 'Cucina grande con zona pranzo separata.', photoSection: 'app1-cucina', icon: '🍳' },
      { id: 'soggiorno', name: 'Soggiorno', description: 'Soggiorno spazioso con divano e TV.', photoSection: 'app1-soggiorno', icon: '🛋' },
      { id: 'bagno-1', name: 'Bagno 1', description: 'Bagno completo con doccia.', photoSection: 'app1-bagno-1', icon: '🚿' },
      { id: 'bagno-2', name: 'Bagno 2', description: 'Secondo bagno con vasca.', photoSection: 'app1-bagno-2', icon: '🛁' },
    ],
    heroSection: 'app1-hero',
    planimetriaSection: 'app1-planimetria',
  },
  {
    id: '2',
    name: 'Appartamento 2',
    slug: '2',
    description: 'Appartamento con terrazzo, camera en-suite, lavanderia e ampio salotto.',
    longDescription: 'L\'Appartamento 2 è una soluzione elegante e funzionale: camera da letto con bagno en-suite, un secondo bagno, cucina abitabile, salotto, lavanderia privata, terrazzo e anticamera. Perfetto per chi cerca un nido accogliente con spazi ben organizzati.',
    price: 1200,
    floor: 'Primo piano',
    amenities: ['Wi-Fi incluso', 'Completamente arredato', 'Riscaldamento autonomo', 'Lavatrice in lavanderia privata', 'Terrazzo privato', 'Cucina equipaggiata'],
    details: [
      { label: 'Piano', value: '1°' },
      { label: 'Camera da letto', value: '1 (en-suite)' },
      { label: 'Bagni', value: '2' },
      { label: 'Cucina', value: 'Abitabile' },
      { label: 'Extra', value: 'Terrazzo, Lavanderia, Ripostiglio' },
    ],
    rooms: [
      { id: 'camera', name: 'Camera da Letto', description: 'Camera matrimoniale con bagno en-suite privato.', photoSection: 'app2-camera', icon: '🛏' },
      { id: 'cucina', name: 'Cucina Abitabile', description: 'Cucina attrezzata con zona colazione.', photoSection: 'app2-cucina', icon: '🍳' },
      { id: 'salotto', name: 'Salotto', description: 'Salotto luminoso con divano e zona relax.', photoSection: 'app2-salotto', icon: '🛋' },
      { id: 'bagno-1', name: 'Bagno En-Suite', description: 'Bagno privato nella camera da letto.', photoSection: 'app2-bagno-1', icon: '🚿' },
      { id: 'bagno-2', name: 'Bagno 2', description: 'Secondo bagno indipendente.', photoSection: 'app2-bagno-2', icon: '🚿' },
      { id: 'terrazzo', name: 'Terrazzo', description: 'Terrazzo privato con vista.', photoSection: 'app2-terrazzo', icon: '🌿' },
      { id: 'lavanderia', name: 'Lavanderia', description: 'Lavanderia privata con lavatrice.', photoSection: 'app2-lavanderia', icon: '🧺' },
    ],
    heroSection: 'app2-hero',
    planimetriaSection: 'app2-planimetria',
  },
]

export function getApartment(id: string): Apartment | undefined {
  return apartments.find(a => a.slug === id)
}
```

- [ ] **Step 2: Commit**
```bash
git add lib/apartments.ts
git commit -m "feat: add apartments static config"
```

---

### Task 2: Aggiorna lib/types.ts e lib/validations/candidatura.ts

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/validations/candidatura.ts`

- [ ] **Step 1: Sostituisci tutto il contenuto di `lib/types.ts`**

```typescript
export type AppartamentoPreferito = 'appartamento_1' | 'appartamento_2' | 'indifferente'
export type DurataPermanenza = '6_mesi' | '12_mesi' | '18_mesi' | '24_mesi' | 'oltre_2_anni'
export type StatusCandidato = 'lavoratore' | 'autonomo' | 'altro'
export type StatoCandidatura = 'nuova' | 'in_revisione' | 'accettata' | 'rifiutata'

export interface Candidatura {
  id: string
  created_at: string
  nome: string
  cognome: string
  email: string
  telefono: string
  appartamento_preferito: AppartamentoPreferito
  durata_permanenza: DurataPermanenza
  status: StatusCandidato
  tipo_contratto?: string
  nome_azienda?: string
  tipo_attivita?: string
  settore?: string
  note?: string
  consenso_privacy: boolean
  stato_candidatura: StatoCandidatura
}
```

- [ ] **Step 2: Sostituisci tutto il contenuto di `lib/validations/candidatura.ts`**

```typescript
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
```

- [ ] **Step 3: Aggiorna `components/admin/StatusBadge.tsx`**

Il file ha una `statusConfig` del tipo `Record<StatusCandidato, ...>`. Dopo la rimozione di `'studente'` da `StatusCandidato`, TypeScript darà errore se `studente` è ancora una chiave.

Trova il blocco `statusConfig` (contiene le chiavi `studente`, `lavoratore`, `autonomo`, `altro`) e rimuovi la riga con `studente`:
```tsx
// Rimuovi questa riga:
studente: { label: 'Studente', ... },
```

- [ ] **Step 4: Commit**
```bash
git add lib/types.ts lib/validations/candidatura.ts components/admin/StatusBadge.tsx
git commit -m "feat: update types and validation (remove studente, add durata_permanenza)"
```

---

## Chunk 2: Homepage — Sezione Appartamenti

### Task 3: ApartmentCard e Apartments section

**Files:**
- Create: `components/brochure/ApartmentCard.tsx`
- Create: `components/brochure/Apartments.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Crea `components/brochure/ApartmentCard.tsx`**

```tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BedDouble, Bath, ArrowRight } from 'lucide-react'
import type { Apartment } from '@/lib/apartments'
import type { PhotoConfig } from '@/lib/photos-db'

interface Props {
  apartment: Apartment
  coverPhoto?: PhotoConfig
  delay?: number
}

export function ApartmentCard({ apartment, coverPhoto, delay = 0 }: Props) {
  const bedroomCount = apartment.rooms.filter(r => r.id.startsWith('camera')).length
  const bathroomCount = apartment.rooms.filter(r => r.id.startsWith('bagno')).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100"
    >
      <div className="relative h-56 overflow-hidden bg-stone-100">
        {coverPhoto ? (
          <Image
            src={coverPhoto.src}
            alt={coverPhoto.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
            <span className="text-stone-400 font-sans text-sm">Foto in arrivo</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-anthracite/80 backdrop-blur-sm text-white font-sans text-xs tracking-widest uppercase px-3 py-1 rounded-full">
            {apartment.floor}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-1">{apartment.name}</p>
        <p className="font-sans text-stone-500 text-sm mb-4 line-clamp-2">{apartment.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-full px-3 py-1 font-sans text-xs text-stone-600">
            <BedDouble size={12} /> {bedroomCount} {bedroomCount === 1 ? 'camera' : 'camere'}
          </span>
          <span className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-full px-3 py-1 font-sans text-xs text-stone-600">
            <Bath size={12} /> {bathroomCount} bagni
          </span>
          {apartment.rooms.some(r => r.id === 'terrazzo') && (
            <span className="bg-stone-50 border border-stone-200 rounded-full px-3 py-1 font-sans text-xs text-stone-600">🌿 Terrazzo</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif text-2xl text-anthracite">€ {apartment.price.toLocaleString('it-IT')}</span>
            <span className="font-sans text-stone-400 text-sm"> / mese</span>
          </div>
          <Link
            href={`/appartamento/${apartment.slug}`}
            className="flex items-center gap-2 bg-anthracite text-white font-sans text-sm px-4 py-2 rounded-xl hover:bg-anthracite/80 transition-colors"
          >
            Scopri <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Crea `components/brochure/Apartments.tsx`**

```tsx
import { apartments } from '@/lib/apartments'
import { ApartmentCard } from './ApartmentCard'
import type { AllPhotos } from '@/lib/photos-db'

export function Apartments({ allPhotos }: { allPhotos: AllPhotos }) {
  return (
    <section id="appartamenti" className="py-16 px-4 bg-ivory">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Disponibilità</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">I Nostri Appartamenti</h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto text-base">
            Due appartamenti indipendenti, affittati per intero. Scegli quello che fa per te.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {apartments.map((apt, i) => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              coverPhoto={(allPhotos[apt.heroSection] ?? [])[0]}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Aggiorna `app/page.tsx`**

Cambia:
```tsx
import { Rooms } from '@/components/brochure/Rooms'
```
Con:
```tsx
import { Apartments } from '@/components/brochure/Apartments'
```

Cambia:
```tsx
<Rooms allPhotos={allPhotos} />
```
Con:
```tsx
<Apartments allPhotos={allPhotos} />
```

- [ ] **Step 4: Verifica build**
```bash
npm run build
```
Atteso: nessun errore TypeScript.

- [ ] **Step 5: Commit**
```bash
git add components/brochure/ApartmentCard.tsx components/brochure/Apartments.tsx app/page.tsx
git commit -m "feat: add Apartments section to homepage (replaces Rooms)"
```

---

## Chunk 3: Pagina Dettaglio Appartamento

### Task 4: Componenti dettaglio

**Files:**
- Create: `components/appartamento/ApartmentHero.tsx`
- Create: `components/appartamento/ApartmentInfo.tsx` *(unifica descrizione + dettagli + servizi)*
- Create: `components/appartamento/ApartmentRooms.tsx`
- Create: `components/appartamento/FloorPlan.tsx`

- [ ] **Step 1: Crea `components/appartamento/ApartmentHero.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import type { PhotoConfig } from '@/lib/photos-db'

export function ApartmentHero({ photos, name }: { photos: PhotoConfig[]; name: string }) {
  const [current, setCurrent] = useState(0)
  const total = photos.length

  if (total === 0) return (
    <div className="h-[50vh] bg-stone-200 flex items-center justify-center">
      <p className="text-stone-400 font-sans">Foto in arrivo</p>
    </div>
  )

  return (
    <div className="relative h-[60vh] overflow-hidden bg-anthracite">
      <Image src={photos[current].src} alt={photos[current].alt} fill className="object-cover opacity-90" priority />
      <div className="absolute inset-0 bg-gradient-to-b from-anthracite/40 to-transparent" />

      <Link
        href="/#appartamenti"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/90 font-sans text-sm bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-black/50 transition-colors"
      >
        <ArrowLeft size={14} /> Tutti gli appartamenti
      </Link>

      <div className="absolute bottom-6 left-6">
        <p className="font-sans text-gold uppercase tracking-widest text-xs mb-1">Vicolo Folletto</p>
        <h1 className="font-serif text-white text-3xl md:text-4xl">{name}</h1>
      </div>

      {total > 1 && (
        <>
          <button onClick={() => setCurrent(p => (p - 1 + total) % total)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrent(p => (p + 1) % total)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Crea `components/appartamento/ApartmentInfo.tsx`**

```tsx
import type { Apartment } from '@/lib/apartments'

export function ApartmentInfo({ apartment }: { apartment: Apartment }) {
  return (
    <section className="py-12 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Descrizione</p>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-2xl">
            {apartment.longDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-4">Dettagli</p>
            <div className="space-y-2">
              {apartment.details.map(d => (
                <div key={d.label} className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="font-sans text-sm text-stone-500">{d.label}</span>
                  <span className="font-sans text-sm font-medium text-anthracite">{d.value}</span>
                </div>
              ))}
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="font-sans text-sm text-stone-500">Affitto mensile</span>
                <span className="font-serif text-lg font-medium text-anthracite">€ {apartment.price.toLocaleString('it-IT')}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-4">Dotazioni</p>
            <ul className="space-y-2">
              {apartment.amenities.map(a => (
                <li key={a} className="flex items-center gap-2 font-sans text-sm text-stone-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Crea `components/appartamento/ApartmentRooms.tsx`**

```tsx
'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Room } from '@/lib/apartments'
import type { AllPhotos } from '@/lib/photos-db'

export function ApartmentRooms({ rooms, allPhotos }: { rooms: Room[]; allPhotos: AllPhotos }) {
  return (
    <section className="py-12 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Spazi</p>
        <h2 className="font-serif text-3xl text-anthracite mb-8">Suddivisione degli ambienti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rooms.map((room, i) => {
            const cover = (allPhotos[room.photoSection] ?? [])[0]
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm"
              >
                <div className="relative h-40 bg-stone-100">
                  {cover
                    ? <Image src={cover.src} alt={cover.alt} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">{room.icon}</div>
                  }
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{room.icon}</span>
                    <h3 className="font-serif text-anthracite text-base">{room.name}</h3>
                  </div>
                  <p className="font-sans text-sm text-stone-500">{room.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Crea `components/appartamento/FloorPlan.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { PhotoConfig } from '@/lib/photos-db'

export function FloorPlan({ photos }: { photos: PhotoConfig[] }) {
  const [zoomed, setZoomed] = useState(false)
  if (photos.length === 0) return null
  const photo = photos[0]

  return (
    <section className="py-12 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Planimetria</p>
        <h2 className="font-serif text-3xl text-anthracite mb-8">Pianta dell'appartamento</h2>
        <div className="relative cursor-zoom-in rounded-xl overflow-hidden border border-stone-200 bg-stone-50 min-h-[300px]" onClick={() => setZoomed(true)}>
          <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="w-full h-auto object-contain" />
          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-stone-500 font-sans text-xs px-2 py-1 rounded-full">
            Clicca per ingrandire
          </div>
        </div>
        {zoomed && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoomed(false)}>
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verifica build**
```bash
npm run build
```
Atteso: nessun errore TypeScript nei 4 nuovi componenti.

- [ ] **Step 6: Commit**
```bash
git add components/appartamento/
git commit -m "feat: add apartment detail components (Hero, Info, Rooms, FloorPlan)"
```

---

### Task 5: Pagina route /appartamento/[id]

**Files:**
- Create: `app/appartamento/[id]/page.tsx`

- [ ] **Step 1: Crea cartella e file `app/appartamento/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getApartment, apartments } from '@/lib/apartments'
import { getPhotosFromDB } from '@/lib/photos-db'
import { Header } from '@/components/brochure/Header'
import { ApartmentHero } from '@/components/appartamento/ApartmentHero'
import { ApartmentInfo } from '@/components/appartamento/ApartmentInfo'
import { ApartmentRooms } from '@/components/appartamento/ApartmentRooms'
import { FloorPlan } from '@/components/appartamento/FloorPlan'
import { ApplicationForm } from '@/components/brochure/ApplicationForm'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return apartments.map(a => ({ id: a.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const apt = getApartment(id)
  if (!apt) return {}
  return { title: `${apt.name} — Vicolo Folletto` }
}

export default async function ApartmentPage({ params }: Props) {
  const { id } = await params
  const apartment = getApartment(id)
  if (!apartment) notFound()

  const allPhotos = await getPhotosFromDB()

  return (
    <>
      <Header />
      <main>
        <ApartmentHero photos={allPhotos[apartment.heroSection] ?? []} name={apartment.name} />
        <ApartmentInfo apartment={apartment} />
        <ApartmentRooms rooms={apartment.rooms} allPhotos={allPhotos} />
        <FloorPlan photos={allPhotos[apartment.planimetriaSection] ?? []} />
        <ApplicationForm
          defaultAppartamento={apartment.id === '1' ? 'appartamento_1' : 'appartamento_2'}
        />
      </main>
    </>
  )
}
```

- [ ] **Step 2: Verifica build**
```bash
npm run build
```

- [ ] **Step 3: Commit**
```bash
git add app/appartamento/
git commit -m "feat: add /appartamento/[id] detail page"
```

---

## Chunk 4: Admin — Gestione Foto con Tab

### Task 6: Ristruttura admin foto

**Files:**
- Create: `components/admin/foto/PhotoTabs.tsx`
- Modify: `app/admin/foto/page.tsx`

- [ ] **Step 1: Crea `components/admin/foto/PhotoTabs.tsx`**

> Nota: `PhotoSection` usa props tipizzate (non FormData). Le firme devono corrispondere esattamente all'interfaccia in `PhotoSection.tsx`:
> `deletePhoto(photoId: string, storagePath: string)`, `setCover(photoId: string, section: string)`, `addPhotoRecord(section: string, storagePath: string, url: string)`, `reorderPhotos(section: string, orderedIds: string[])`

```tsx
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
      <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-5 py-2 rounded-lg font-sans text-sm transition-all ${
              active === tab.id ? 'bg-[#C9A96E] text-white' : 'text-white/50 hover:text-white/80'
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
```

- [ ] **Step 2: Sostituisci tutto il contenuto di `app/admin/foto/page.tsx`**

```tsx
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
    { key: 'spazi-comuni', label: '🏠 Spazi Comuni' },
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

  // Server actions — stessa logica dell'attuale page.tsx, aggiungendo revalidatePath per le route appartamento

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
```

- [ ] **Step 3: Verifica build**
```bash
npm run build
```
Atteso: nessun errore TypeScript.

- [ ] **Step 4: Commit**
```bash
git add components/admin/foto/PhotoTabs.tsx app/admin/foto/page.tsx
git commit -m "feat: restructure admin foto with apartment tabs"
```

---

## Chunk 5: Form Candidatura e Admin Dashboard

### Task 7: Aggiorna ApplicationForm

**Files:**
- Modify: `components/brochure/ApplicationForm.tsx`
- Modify: `app/api/candidature/route.ts`

- [ ] **Step 1: Aggiorna la firma del componente in `ApplicationForm.tsx`**

Trova la riga con `export function ApplicationForm()` e sostituisci con:
```tsx
interface Props {
  defaultAppartamento?: 'appartamento_1' | 'appartamento_2' | 'indifferente'
}

export function ApplicationForm({ defaultAppartamento }: Props = {}) {
```

- [ ] **Step 2: Aggiorna `defaultValues` in `useForm`**

Trova `defaultValues: { consenso_privacy: false }` e sostituisci con:
```tsx
defaultValues: {
  consenso_privacy: false,
  appartamento_preferito: defaultAppartamento ?? 'indifferente',
},
```

- [ ] **Step 3: Mantieni `const status = watch('status')`**

La riga `const status = watch('status')` deve rimanere: è ancora necessaria per mostrare i campi condizionali `lavoratore` (tipo_contratto, nome_azienda) e `autonomo` (tipo_attivita, settore). Non rimuoverla.

- [ ] **Step 4: Sostituisci il campo `camera_preferita` con `appartamento_preferito`**

Trova il blocco JSX con il select per `camera_preferita` e sostituisci con:
```tsx
<div>
  <label className={labelClass}>Appartamento di interesse</label>
  <select {...register('appartamento_preferito')} className={inputClass}>
    <option value="indifferente">Nessuna preferenza</option>
    <option value="appartamento_1">Appartamento 1 (3 camere)</option>
    <option value="appartamento_2">Appartamento 2 (con terrazzo)</option>
  </select>
  <FieldError message={errors.appartamento_preferito?.message} />
</div>
```

- [ ] **Step 5: Aggiungi campo `durata_permanenza` subito dopo il campo appartamento**

```tsx
<div>
  <label className={labelClass}>Durata di permanenza prevista</label>
  <select {...register('durata_permanenza')} className={inputClass}>
    <option value="">Seleziona durata</option>
    <option value="6_mesi">6 mesi</option>
    <option value="12_mesi">12 mesi</option>
    <option value="18_mesi">18 mesi</option>
    <option value="24_mesi">24 mesi</option>
    <option value="oltre_2_anni">Oltre 2 anni</option>
  </select>
  <FieldError message={errors.durata_permanenza?.message} />
</div>
```

- [ ] **Step 6: Rimuovi il blocco JSX condizionale studente**

Trova e rimuovi l'intero blocco:
```tsx
{status === 'studente' && (
  <>
    {/* ...tutto il blocco... */}
  </>
)}
```

- [ ] **Step 7: Rimuovi 'Studente' dal select status**

Nel `<select>` per `status`, rimuovi:
```tsx
<option value="studente">Studente</option>
```

- [ ] **Step 8: Aggiorna il testo descrittivo del form**

Trova `"camere disponibili"` o simile e sostituisci con `"appartamenti disponibili"`.

- [ ] **Step 9: Verifica che `app/api/candidature/route.ts` usi il nuovo schema**

Il file importa già `candidaturaSchema`. Non ci sono altre modifiche necessarie: il nuovo schema gestisce automaticamente i campi aggiornati. Verifica solo che non ci siano riferimenti hardcoded a `camera_preferita` nella route.

- [ ] **Step 10: Verifica build**
```bash
npm run build
```

- [ ] **Step 11: Commit**
```bash
git add components/brochure/ApplicationForm.tsx app/api/candidature/route.ts
git commit -m "feat: update application form (remove studente, add durata_permanenza)"
```

---

### Task 8: Aggiorna Admin Dashboard

**Files:**
- Modify: `components/admin/CandidatureTable.tsx`
- Modify: `app/admin/candidato/[id]/page.tsx`

- [ ] **Step 1: Sostituisci `CAMERA_LABELS` in `CandidatureTable.tsx`**

Trova:
```tsx
const CAMERA_LABELS: Record<string, string> = {
  camera_1: 'Camera 1 + Bagno Privato',
  camera_2: 'Camera 2',
  camera_3: 'Camera 3',
  indifferente: 'Indifferente',
}
```
Sostituisci con:
```tsx
const APPARTAMENTO_LABELS: Record<string, string> = {
  appartamento_1: 'Appartamento 1',
  appartamento_2: 'Appartamento 2',
  indifferente: 'Indifferente',
}

const DURATA_LABELS: Record<string, string> = {
  '6_mesi': '6 mesi',
  '12_mesi': '12 mesi',
  '18_mesi': '18 mesi',
  '24_mesi': '24 mesi',
  'oltre_2_anni': 'Oltre 2 anni',
}
```

- [ ] **Step 2: Aggiorna lo stato del filtro camera → appartamento in `CandidatureTable.tsx`**

Trova:
```tsx
const [filterCamera, setFilterCamera] = useState('')
```
Sostituisci con:
```tsx
const [filterAppartamento, setFilterAppartamento] = useState('')
```

Aggiorna il filtro `useMemo`:
```tsx
const matchCamera = !filterAppartamento || c.appartamento_preferito === filterAppartamento
```

- [ ] **Step 3: Sostituisci il select del filtro camera nel JSX**

Trova il `<select>` con `Tutte le camere` e sostituisci con:
```tsx
<select value={filterAppartamento} onChange={e => setFilterAppartamento(e.target.value)} className={sel}>
  <option value="">Tutti gli appartamenti</option>
  <option value="appartamento_1">Appartamento 1</option>
  <option value="appartamento_2">Appartamento 2</option>
  <option value="indifferente">Indifferente</option>
</select>
```

- [ ] **Step 4: Rimuovi 'Studente' dal select filtro status nel JSX**

Trova `<option value="studente">Studente</option>` e rimuovilo.

- [ ] **Step 5: Aggiorna le intestazioni e celle della tabella**

Trova `'Camera'` nell'array di headers e cambia in `'Appartamento'`.

Trova la cella:
```tsx
{CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita}
```
Sostituisci con:
```tsx
{APPARTAMENTO_LABELS[c.appartamento_preferito] ?? c.appartamento_preferito}
```

- [ ] **Step 6: Aggiorna `exportCSV` in `CandidatureTable.tsx`**

Trova:
```tsx
const headers = ['Data', 'Nome', 'Cognome', 'Email', 'Telefono', 'Status', 'Camera', 'Stato']
const rows = filtered.map(c => [
  new Date(c.created_at).toLocaleDateString('it-IT'),
  c.nome, c.cognome, c.email, c.telefono,
  c.status,
  CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita,
  c.stato_candidatura,
])
```
Sostituisci con:
```tsx
const headers = ['Data', 'Nome', 'Cognome', 'Email', 'Telefono', 'Status', 'Appartamento', 'Durata', 'Stato']
const rows = filtered.map(c => [
  new Date(c.created_at).toLocaleDateString('it-IT'),
  c.nome, c.cognome, c.email, c.telefono,
  c.status,
  APPARTAMENTO_LABELS[c.appartamento_preferito] ?? c.appartamento_preferito,
  DURATA_LABELS[c.durata_permanenza] ?? c.durata_permanenza,
  c.stato_candidatura,
])
```

- [ ] **Step 7: Aggiorna `CAMERA_LABELS` in `app/admin/candidato/[id]/page.tsx`**

Trova:
```tsx
const CAMERA_LABELS: Record<string, string> = {
  camera_1: 'Camera 1 + Bagno Privato (€540/mese)',
  camera_2: 'Camera 2 (€460/mese)',
  camera_3: 'Camera 3 (€460/mese)',
  indifferente: 'Indifferente',
}
```
Sostituisci con:
```tsx
const APPARTAMENTO_LABELS: Record<string, string> = {
  appartamento_1: 'Appartamento 1 — €1.200/mese',
  appartamento_2: 'Appartamento 2 — €1.200/mese',
  indifferente: 'Indifferente',
}

const DURATA_LABELS: Record<string, string> = {
  '6_mesi': '6 mesi',
  '12_mesi': '12 mesi',
  '18_mesi': '18 mesi',
  '24_mesi': '24 mesi',
  'oltre_2_anni': 'Oltre 2 anni',
}
```

- [ ] **Step 8: Aggiorna le `<Row>` in `app/admin/candidato/[id]/page.tsx`**

Trova:
```tsx
<Row label="Camera preferita" value={CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita} />
```
Sostituisci con:
```tsx
<Row label="Appartamento di interesse" value={APPARTAMENTO_LABELS[c.appartamento_preferito] ?? c.appartamento_preferito} />
<Row label="Durata permanenza" value={DURATA_LABELS[c.durata_permanenza] ?? c.durata_permanenza} />
```

- [ ] **Step 9: Rimuovi il blocco studente da `app/admin/candidato/[id]/page.tsx`**

Trova e rimuovi:
```tsx
{c.status === 'studente' && (
  <>
    <Row label="Università" value={c.universita} />
    <Row label="Garanzie" value={c.garanzie?.replace(/_/g, ' ')} />
    <Row label="Contratto garante" value={c.tipo_contratto_garante} />
    <Row label="Azienda garante" value={c.azienda_garante} />
  </>
)}
```

- [ ] **Step 10: Verifica build**
```bash
npm run build
```
Atteso: build pulita senza errori TypeScript.

- [ ] **Step 11: Commit**
```bash
git add components/admin/CandidatureTable.tsx app/admin/candidato/
git commit -m "feat: update admin dashboard for new candidatura fields"
```

---

## Note finali

- **Foto esistenti in Supabase:** le sezioni vecchie (`camera-1`, `appartamento`, ecc.) restano in DB ma non sono più visibili nell'admin. Eliminabili manualmente da Supabase Storage se necessario.
- **Candidature esistenti:** avranno NULL nei campi `appartamento_preferito` e `durata_permanenza`. La UI admin gestisce questo con il fallback `?? c.appartamento_preferito`.
- **`StatusCandidatoBadge`:** il componente `components/admin/StatusBadge.tsx` potrebbe avere `'studente'` come caso nel badge. Verificare e rimuovere se necessario dopo il build.
