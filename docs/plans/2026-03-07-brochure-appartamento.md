# Brochure Appartamento Reggio Emilia — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Realizzare una web app Next.js 14 con brochure pubblica interattiva per appartamento di pregio + dashboard admin collegata a Supabase.

**Architecture:** Next.js 14 App Router con route `/` (brochure pubblica), `/admin` (dashboard protetta). Form pubblico salva su Supabase via API route server-side. Dashboard legge Supabase con service role key lato server. Middleware protegge le route `/admin/*`.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Supabase (PostgreSQL + Auth + RLS), React Hook Form + Zod, shadcn/ui, Lucide React, yet-another-react-lightbox, next/image.

---

## Task 1: Setup Next.js + Tailwind + shadcn/ui

**Files:**
- Create: tutti i file base del progetto Next.js in `C:\Users\FRANCESCO COPPOLA\Desktop\Brochure\`

**Step 1: Inizializza Next.js 14 nella cartella corrente**

```bash
cd "C:\Users\FRANCESCO COPPOLA\Desktop\Brochure"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --use-npm
```

**Step 2: Installa dipendenze principali**

```bash
npm install framer-motion @supabase/supabase-js @supabase/ssr react-hook-form @hookform/resolvers zod lucide-react yet-another-react-lightbox
```

**Step 3: Installa shadcn/ui**

```bash
npx shadcn@latest init -d
```

**Step 4: Aggiungi componenti shadcn necessari**

```bash
npx shadcn@latest add button input label select textarea badge card table dialog dropdown-menu
```

**Step 5: Configura font Playfair Display + Inter e palette in `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'
const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAFAF7',
        anthracite: '#2C2C2C',
        gold: '#C9A96E',
        'text-secondary': '#6B6B6B',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

**Step 6: Crea `.env.local` con variabili Supabase placeholder**

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

**Step 7: Crea struttura cartelle immagini**

```bash
mkdir -p public/images/appartamento public/images/camera-1 public/images/camera-2 public/images/camera-3 public/images/cucina public/images/soggiorno public/images/bagno-condiviso
```

**Step 8: Commit**

```bash
git init && git add . && git commit -m "feat: setup Next.js 14 + Tailwind + shadcn/ui + dipendenze"
```

---

## Task 2: Configurazione Supabase e lib/

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/types.ts`
- Create: `lib/validations/candidatura.ts`
- Create: `lib/photos.ts`
- Create: `supabase/migrations/001_create_candidature.sql`

**Step 1: Crea `lib/supabase/client.ts`**

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 2: Crea `lib/supabase/server.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

**Step 3: Crea `lib/types.ts`**

```ts
export type CameraPreferita = 'camera_1' | 'camera_2' | 'camera_3' | 'indifferente'
export type StatusCandidato = 'studente' | 'lavoratore' | 'autonomo' | 'altro'
export type StatoCandidatura = 'nuova' | 'in_revisione' | 'accettata' | 'rifiutata'

export interface Candidatura {
  id: string
  created_at: string
  nome: string
  cognome: string
  email: string
  telefono: string
  camera_preferita: CameraPreferita
  status: StatusCandidato
  tipo_contratto?: string
  nome_azienda?: string
  tipo_attivita?: string
  settore?: string
  universita?: string
  garanzie?: string
  tipo_contratto_garante?: string
  azienda_garante?: string
  note?: string
  consenso_privacy: boolean
  stato_candidatura: StatoCandidatura
}
```

**Step 4: Crea `lib/validations/candidatura.ts`**

```ts
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
  website: z.string().max(0).optional(), // honeypot
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
```

**Step 5: Crea `lib/photos.ts`**

```ts
export interface PhotoConfig {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export const photos: Record<string, PhotoConfig[]> = {
  appartamento: [],
  'camera-1': [],
  'camera-2': [],
  'camera-3': [],
  cucina: [],
  soggiorno: [],
  'bagno-condiviso': [],
}
```

**Step 6: Crea `supabase/migrations/001_create_candidature.sql`**

```sql
create table candidature (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nome text not null,
  cognome text not null,
  email text not null,
  telefono text not null,
  camera_preferita text not null,
  status text not null,
  tipo_contratto text,
  nome_azienda text,
  tipo_attivita text,
  settore text,
  universita text,
  garanzie text,
  tipo_contratto_garante text,
  azienda_garante text,
  note text,
  consenso_privacy boolean not null default false,
  stato_candidatura text default 'nuova'
);

alter table candidature enable row level security;

create policy "insert_public" on candidature
  for insert to anon with check (true);

create policy "read_authenticated" on candidature
  for select to authenticated using (true);

create policy "update_authenticated" on candidature
  for update to authenticated using (true);

create policy "delete_authenticated" on candidature
  for delete to authenticated using (true);
```

**Step 7: Commit**

```bash
git add . && git commit -m "feat: lib Supabase, tipi, validazione Zod, config foto, migration SQL"
```

---

## Task 3: Middleware protezione route admin

**Files:**
- Create: `middleware.ts`

**Step 1: Crea `middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname === '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Step 2: Commit**

```bash
git add middleware.ts && git commit -m "feat: middleware protezione route /admin/*"
```

---

## Task 4: Layout globale e globals.css

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Step 1: Sostituisci `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body {
    background-color: #FAFAF7;
    color: #2C2C2C;
    font-family: var(--font-inter), sans-serif;
  }
  h1, h2, h3 { font-family: var(--font-playfair), serif; }
}
```

**Step 2: Sostituisci `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'Appartamento di Pregio — Centro Storico, Reggio Emilia',
  description: 'Appartamento arredato di pregio in affitto nel centro storico di Reggio Emilia. Classe energetica A++, cucina SMEG, triplo vetro.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-ivory text-anthracite antialiased">{children}</body>
    </html>
  )
}
```

**Step 3: Commit**

```bash
git add app/layout.tsx app/globals.css && git commit -m "feat: layout globale con font Playfair+Inter e palette colori"
```

---

## Task 5: Componenti PhotoCarousel e PhotoGallery

**Files:**
- Create: `components/brochure/PhotoCarousel.tsx`
- Create: `components/brochure/PhotoGallery.tsx`

**Step 1: Crea `components/brochure/PhotoCarousel.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { PhotoConfig } from '@/lib/photos'

interface Props { photos: PhotoConfig[]; roomName: string }

export function PhotoCarousel({ photos, roomName }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-stone-100 rounded-t-xl flex flex-col items-center justify-center gap-2 text-stone-400">
        <Camera size={32} strokeWidth={1} />
        <span className="text-sm font-sans">Foto in arrivo</span>
      </div>
    )
  }

  const prev = () => setCurrent(c => (c - 1 + photos.length) % photos.length)
  const next = () => setCurrent(c => (c + 1) % photos.length)

  return (
    <>
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-xl group cursor-pointer"
           onClick={() => setLightboxOpen(true)}>
        <Image src={photos[current].src} alt={photos[current].alt} fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw" />
        {photos.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} index={current}
        slides={photos.map(p => ({ src: p.src, alt: p.alt }))} />
    </>
  )
}
```

**Step 2: Crea `components/brochure/PhotoGallery.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { PhotoConfig } from '@/lib/photos'

interface Props { photos: PhotoConfig[]; columns?: 2 | 3 }

export function PhotoGallery({ photos, columns = 3 }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="w-full h-48 bg-stone-100 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400">
        <Camera size={32} strokeWidth={1} />
        <span className="text-sm font-sans">Foto in arrivo</span>
      </div>
    )
  }

  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'

  return (
    <>
      <div className={`grid ${gridCols} gap-2`}>
        {photos.map((photo, i) => (
          <div key={i}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}>
            <Image src={photo.src} alt={photo.alt} fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw" />
            {photo.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity font-sans">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>
      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} index={lightboxIndex}
        slides={photos.map(p => ({ src: p.src, alt: p.alt }))} />
    </>
  )
}
```

**Step 3: Commit**

```bash
git add components/ && git commit -m "feat: PhotoCarousel e PhotoGallery con lightbox e placeholder"
```

---

## Task 6: Hero Section

**Files:**
- Create: `components/brochure/Hero.tsx`

**Step 1: Crea `components/brochure/Hero.tsx`**

```tsx
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { photos } from '@/lib/photos'

export function Hero() {
  const heroPhotos = photos['appartamento']
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (heroPhotos.length <= 1) return
    const timer = setInterval(() => setCurrent(c => (c + 1) % heroPhotos.length), 5000)
    return () => clearInterval(timer)
  }, [heroPhotos.length])

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {heroPhotos.length === 0 ? (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
      ) : heroPhotos.map((photo, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={photo.src} alt={photo.alt} fill priority={i === 0}
            className="object-cover" sizes="100vw" />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="font-sans text-gold uppercase tracking-[0.3em] text-sm mb-4">
          Centro Storico · Reggio Emilia
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
          Appartamento di Pregio
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Eleganza e comfort nel cuore della città. Completamente arredato, classe energetica A++, cucina SMEG.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap">
          <a href="#appartamento"
            className="bg-gold hover:bg-gold/90 text-white font-sans font-medium px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95">
            Scopri l'appartamento
          </a>
          <a href="#candidatura"
            className="border border-white/60 hover:border-white text-white font-sans font-medium px-8 py-3.5 rounded-full transition-all hover:bg-white/10">
            Invia candidatura
          </a>
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60">
        <ChevronDown size={28} />
      </motion.div>

      {heroPhotos.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2">
          {heroPhotos.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gold scale-125' : 'bg-white/40'}`} />
          ))}
        </div>
      )}
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add components/brochure/Hero.tsx && git commit -m "feat: Hero section con slideshow automatico e animazioni Framer Motion"
```

---

## Task 7: Sezione Overview (L'Appartamento)

**Files:**
- Create: `components/brochure/Overview.tsx`

**Step 1: Crea `components/brochure/Overview.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { Building2, Zap, Wind, ChefHat, ShieldCheck, Layers, Sofa, Thermometer } from 'lucide-react'
import { PhotoGallery } from './PhotoGallery'
import { photos } from '@/lib/photos'

const features = [
  { icon: Building2, label: 'Piano', value: 'Primo piano con ascensore' },
  { icon: Layers, label: 'Classe Energetica', value: 'A++ — Massima efficienza' },
  { icon: Wind, label: 'Infissi', value: 'Triplo vetro con camera a gas' },
  { icon: ShieldCheck, label: 'Porta', value: 'Blindata' },
  { icon: Thermometer, label: 'Climatizzazione', value: 'Aria condizionata (risc. e raff.)' },
  { icon: ChefHat, label: 'Cucina', value: 'Su misura con elettrodomestici SMEG' },
  { icon: Sofa, label: 'Soggiorno', value: 'Ampio e luminoso' },
  { icon: Zap, label: 'Consegna', value: 'Completamente arredato' },
]

export function Overview() {
  return (
    <section id="appartamento" className="py-24 px-4 bg-ivory">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">L'immobile</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">L'Appartamento</h2>
          <p className="font-sans text-text-secondary max-w-2xl mx-auto text-base leading-relaxed">
            Un appartamento di pregio nel cuore del centro storico di Reggio Emilia. Primo piano con ascensore,
            completamente arredato con materiali di qualità e dotazioni di prima scelta.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {features.map(({ icon: Icon, label, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-stone-100 flex flex-col gap-2">
              <Icon size={22} className="text-gold" strokeWidth={1.5} />
              <p className="font-sans text-xs text-text-secondary uppercase tracking-wider">{label}</p>
              <p className="font-sans text-sm text-anthracite font-medium leading-snug">{value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h3 className="font-serif text-xl text-anthracite mb-6 text-center">Galleria Fotografica</h3>
          <PhotoGallery photos={photos['appartamento']} columns={3} />
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add components/brochure/Overview.tsx && git commit -m "feat: sezione Overview con feature cards e galleria"
```

---

## Task 8: Sezione Stanze

**Files:**
- Create: `components/brochure/RoomCard.tsx`
- Create: `components/brochure/Rooms.tsx`

**Step 1: Crea `components/brochure/RoomCard.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { Bath, Euro } from 'lucide-react'
import { PhotoCarousel } from './PhotoCarousel'
import type { PhotoConfig } from '@/lib/photos'

interface Props {
  name: string
  bathType: 'privato' | 'condiviso'
  sharedWith?: string
  rent: number
  expenses: number
  photos: PhotoConfig[]
  delay?: number
}

export function RoomCard({ name, bathType, sharedWith, rent, expenses, photos, delay = 0 }: Props) {
  const total = rent + expenses
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
      <PhotoCarousel photos={photos} roomName={name} />
      <div className="p-6">
        <h3 className="font-serif text-xl text-anthracite mb-4">{name}</h3>
        <div className="flex items-center gap-2.5 text-sm font-sans text-text-secondary mb-5">
          <Bath size={16} className="text-gold" strokeWidth={1.5} />
          {bathType === 'privato' ? (
            <span>Bagno <strong className="text-anthracite">privato en-suite</strong></span>
          ) : (
            <span>Bagno <strong className="text-anthracite">condiviso</strong>{sharedWith && ` con ${sharedWith}`}</span>
          )}
        </div>
        <div className="border-t border-stone-100 pt-4">
          <div className="flex justify-between text-sm font-sans text-text-secondary mb-1">
            <span>Affitto mensile</span><span>€{rent}/mese</span>
          </div>
          <div className="flex justify-between text-sm font-sans text-text-secondary mb-3">
            <span>Spese condominiali</span><span>€{expenses}/mese</span>
          </div>
          <div className="flex justify-between items-center font-sans font-semibold text-anthracite bg-stone-50 rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <Euro size={16} className="text-gold" strokeWidth={2} />
              <span>Totale mensile</span>
            </div>
            <span className="text-gold text-lg">€{total}</span>
          </div>
        </div>
        <a href="#candidatura"
          className="mt-4 block w-full text-center bg-anthracite hover:bg-anthracite/90 text-white font-sans text-sm font-medium py-3 rounded-lg transition-all hover:scale-[1.02] active:scale-95">
          Richiedi questa camera
        </a>
      </div>
    </motion.div>
  )
}
```

**Step 2: Crea `components/brochure/Rooms.tsx`**

```tsx
import { RoomCard } from './RoomCard'
import { photos } from '@/lib/photos'

export function Rooms() {
  return (
    <section id="stanze" className="py-24 px-4 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Disponibilità</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Le Stanze</h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto text-base">
            Tre camere indipendenti, ognuna con carattere e dotazioni proprie.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoomCard name="Suite Privata" bathType="privato" rent={500} expenses={40}
            photos={photos['camera-1']} delay={0} />
          <RoomCard name="Camera Doppia/Singola (A)" bathType="condiviso" sharedWith="Camera B"
            rent={420} expenses={40} photos={photos['camera-2']} delay={0.1} />
          <RoomCard name="Camera Doppia/Singola (B)" bathType="condiviso" sharedWith="Camera A"
            rent={420} expenses={40} photos={photos['camera-3']} delay={0.2} />
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Commit**

```bash
git add components/brochure/RoomCard.tsx components/brochure/Rooms.tsx && git commit -m "feat: sezione Stanze con RoomCard, carousel foto e prezzi"
```

---

## Task 9: Spazi Comuni

**Files:**
- Create: `components/brochure/CommonSpaces.tsx`

**Step 1: Crea `components/brochure/CommonSpaces.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { PhotoGallery } from './PhotoGallery'
import { photos } from '@/lib/photos'

const spaces = [
  {
    key: 'cucina',
    title: 'La Cucina',
    description: 'Cucina su misura di generose dimensioni, dotata di elettrodomestici SMEG di alta qualità: frigorifero, forno, piano cottura e lavastoviglie. Un ambiente dove cucinare diventa un piacere.',
  },
  {
    key: 'soggiorno',
    title: 'Il Soggiorno',
    description: 'Ampio soggiorno luminoso, arredato con gusto e attenzione ai dettagli. Lo spazio ideale per rilassarsi e condividere momenti con i coinquilini.',
  },
  {
    key: 'bagno-condiviso',
    title: 'Il Bagno Condiviso',
    description: 'Bagno condiviso tra Camera A e Camera B, moderno e ben attrezzato. Accessibile comodamente da entrambe le camere.',
  },
]

export function CommonSpaces() {
  return (
    <section id="spazi-comuni" className="py-24 px-4 bg-ivory">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Vivere insieme</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Spazi Comuni</h2>
        </div>
        <div className="flex flex-col gap-20">
          {spaces.map(({ key, title, description }, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <h3 className="font-serif text-2xl text-anthracite mb-3">{title}</h3>
                <p className="font-sans text-text-secondary leading-relaxed">{description}</p>
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <PhotoGallery photos={photos[key as keyof typeof photos] ?? []} columns={2} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add components/brochure/CommonSpaces.tsx && git commit -m "feat: sezione Spazi Comuni con gallerie foto dedicate"
```

---

## Task 10: Contratto e Utenze + Regole della Casa

**Files:**
- Create: `components/brochure/ContractInfo.tsx`
- Create: `components/brochure/Rules.tsx`

**Step 1: Crea `components/brochure/ContractInfo.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    q: 'Posso uscire anticipatamente dal contratto?',
    a: 'Questa possibilità va concordata direttamente con il locatore. Il contratto è unico e intestato a tutti i coinquilini, pertanto qualsiasi variazione richiede l\'accordo di tutte le parti.',
  },
  {
    q: 'Come vengono divise le utenze?',
    a: 'È attiva una sola bolletta (luce/gas/internet) co-intestata tra i coinquilini. La gestione e suddivisione delle spese avviene internamente tra gli inquilini con le modalità che preferiscono.',
  },
]

export function ContractInfo() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <section id="contratto" className="py-24 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Informazioni importanti</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Contratto & Utenze</h2>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-10">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle size={22} className="text-amber-600 mt-0.5 shrink-0" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-anthracite">Da leggere prima di candidarsi</h3>
          </div>
          <div className="font-sans text-text-secondary leading-relaxed space-y-3 text-sm md:text-base">
            <p>L'appartamento prevede <strong className="text-anthracite">un unico contratto di locazione</strong>, intestato
              congiuntamente a tutti e tre gli inquilini (co-intestatari). Analogamente, sarà attiva{' '}
              <strong className="text-anthracite">una sola utenza</strong> (luce/gas/internet) co-intestata tra i coinquilini.</p>
            <p>Tutti i coinquilini <strong className="text-anthracite">condividono la responsabilità contrattuale</strong> e la gestione
              delle spese. È richiesta pertanto piena collaborazione e accordo tra i candidati selezionati.</p>
          </div>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-stone-100 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left font-sans font-medium text-anthracite hover:bg-stone-50 transition-colors">
                {faq.q}
                <ChevronDown size={18} className={`text-gold transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 font-sans text-sm text-text-secondary leading-relaxed">{faq.a}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Crea `components/brochure/Rules.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import { CigaretteOff, PawPrint, Clock, Wrench, Paintbrush, Users } from 'lucide-react'

const rules = [
  { icon: CigaretteOff, text: 'Vietato fumare all\'interno dell\'appartamento' },
  { icon: PawPrint, text: 'Animali domestici ammessi solo previo accordo esplicito con il proprietario' },
  { icon: Clock, text: 'Rispetto degli orari di silenzio: 22:00 – 08:00' },
  { icon: Wrench, text: 'Manutenzione ordinaria degli spazi comuni a carico dei coinquilini' },
  { icon: Paintbrush, text: 'Nessuna modifica all\'arredamento o alle pareti senza autorizzazione' },
  { icon: Users, text: 'Ospiti occasionali consentiti; ospiti fissi non autorizzati senza accordo' },
]

export function Rules() {
  return (
    <section id="regole" className="py-24 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Convivenza</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Regole della Casa</h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto">
            Per garantire un'esperienza piacevole a tutti i coinquilini, chiediamo il rispetto di alcune semplici regole.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(({ icon: Icon, text }, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-stone-100">
              <Icon size={20} className="text-gold mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="font-sans text-sm text-anthracite leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Commit**

```bash
git add components/brochure/ContractInfo.tsx components/brochure/Rules.tsx && git commit -m "feat: ContractInfo con FAQ e Rules con icone"
```

---

## Task 11: API Route + Form di Candidatura

**Files:**
- Create: `app/api/candidature/route.ts`
- Create: `components/brochure/ApplicationForm.tsx`

**Step 1: Crea `app/api/candidature/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { candidaturaSchema } from '@/lib/validations/candidatura'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.website) return NextResponse.json({ success: true }) // honeypot

    const parsed = candidaturaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 })
    }

    const { website: _w, ...data } = parsed.data
    const supabase = createAdminClient()
    const { error } = await supabase.from('candidature').insert([data])
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Errore salvataggio candidatura:', err)
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 })
  }
}
```

**Step 2: Crea `components/brochure/ApplicationForm.tsx`**

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { candidaturaSchema, type CandidaturaFormData } from '@/lib/validations/candidatura'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-xs mt-1 font-sans">{message}</p>
}

const inputClass = "w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-anthracite bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all placeholder:text-stone-400"
const labelClass = "block font-sans text-sm font-medium text-anthracite mb-1.5"

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CandidaturaFormData>({
    resolver: zodResolver(candidaturaSchema),
    defaultValues: { consenso_privacy: false },
  })
  const status = watch('status')

  const onSubmit = async (data: CandidaturaFormData) => {
    setServerError('')
    try {
      const res = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); setServerError(err.error || 'Errore durante l\'invio'); return }
      setSubmitted(true)
    } catch { setServerError('Errore di connessione. Riprova.') }
  }

  if (submitted) {
    return (
      <section id="candidatura" className="py-24 px-4 bg-stone-50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-3xl text-anthracite mb-3">Candidatura inviata!</h2>
            <p className="font-sans text-text-secondary">Grazie per il tuo interesse. Ti contatteremo presto.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="candidatura" className="py-24 px-4 bg-stone-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-gold uppercase tracking-[0.25em] text-xs mb-3">Candidati ora</p>
          <h2 className="font-serif text-3xl md:text-5xl text-anthracite mb-4">Form di Candidatura</h2>
          <p className="font-sans text-text-secondary">Compila il form per candidarti a una delle camere disponibili.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6">
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </div>

          {/* Dati anagrafici */}
          <div>
            <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-stone-100">Dati Personali</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nome *</label>
                <input {...register('nome')} placeholder="Mario" className={inputClass} />
                <FieldError message={errors.nome?.message} />
              </div>
              <div>
                <label className={labelClass}>Cognome *</label>
                <input {...register('cognome')} placeholder="Rossi" className={inputClass} />
                <FieldError message={errors.cognome?.message} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Email *</label>
                <input {...register('email')} type="email" placeholder="mario@email.it" className={inputClass} />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <label className={labelClass}>Telefono *</label>
                <input {...register('telefono')} type="tel" placeholder="+39 333 1234567" className={inputClass} />
                <FieldError message={errors.telefono?.message} />
              </div>
            </div>
          </div>

          {/* Camera preferita */}
          <div>
            <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-stone-100">Camera di Interesse</h3>
            <label className={labelClass}>Camera preferita *</label>
            <select {...register('camera_preferita')} className={inputClass}>
              <option value="">Seleziona...</option>
              <option value="camera_1">Suite Privata — €540/mese</option>
              <option value="camera_2">Camera Doppia/Singola (A) — €460/mese</option>
              <option value="camera_3">Camera Doppia/Singola (B) — €460/mese</option>
              <option value="indifferente">Indifferente</option>
            </select>
            <FieldError message={errors.camera_preferita?.message} />
          </div>

          {/* Status */}
          <div>
            <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-stone-100">Situazione Lavorativa</h3>
            <label className={labelClass}>Status *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'lavoratore', label: 'Lavoratore dipendente' },
                { value: 'autonomo', label: 'Lavoratore autonomo' },
                { value: 'studente', label: 'Studente' },
                { value: 'altro', label: 'Altro' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="radio" {...register('status')} value={opt.value} className="accent-gold w-4 h-4" />
                  <span className="font-sans text-sm text-anthracite group-hover:text-gold transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
            <FieldError message={errors.status?.message} />
          </div>

          {/* Campi condizionali — Lavoratore */}
          {status === 'lavoratore' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <div>
                <label className={labelClass}>Tipologia di contratto *</label>
                <select {...register('tipo_contratto')} className={inputClass}>
                  <option value="">Seleziona...</option>
                  <option value="indeterminato">Tempo indeterminato</option>
                  <option value="determinato">Tempo determinato</option>
                  <option value="apprendistato">Apprendistato</option>
                  <option value="altro">Altro</option>
                </select>
                <FieldError message={errors.tipo_contratto?.message} />
              </div>
              <div>
                <label className={labelClass}>Nome dell'azienda *</label>
                <input {...register('nome_azienda')} placeholder="Es. Azienda SRL" className={inputClass} />
                <FieldError message={errors.nome_azienda?.message} />
              </div>
            </motion.div>
          )}

          {/* Campi condizionali — Autonomo */}
          {status === 'autonomo' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <div>
                <label className={labelClass}>Tipo di attività *</label>
                <input {...register('tipo_attivita')} placeholder="Es. Partita IVA, libero professionista" className={inputClass} />
                <FieldError message={errors.tipo_attivita?.message} />
              </div>
              <div>
                <label className={labelClass}>Settore *</label>
                <input {...register('settore')} placeholder="Es. IT, Marketing, Commercio" className={inputClass} />
                <FieldError message={errors.settore?.message} />
              </div>
            </motion.div>
          )}

          {/* Campi condizionali — Studente */}
          {status === 'studente' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
              <div>
                <label className={labelClass}>Università / Istituto *</label>
                <input {...register('universita')} placeholder="Es. Università di Bologna" className={inputClass} />
                <FieldError message={errors.universita?.message} />
              </div>
              <div>
                <label className={labelClass}>Garanzie familiari *</label>
                <select {...register('garanzie')} className={inputClass}>
                  <option value="">Seleziona...</option>
                  <option value="1_genitore">1 genitore garante</option>
                  <option value="2_genitori">2 genitori garanti</option>
                  <option value="nessuno">Nessun garante</option>
                </select>
                <FieldError message={errors.garanzie?.message} />
              </div>
              <div>
                <label className={labelClass}>Tipologia contratto del/dei garante/i</label>
                <select {...register('tipo_contratto_garante')} className={inputClass}>
                  <option value="">Seleziona...</option>
                  <option value="indeterminato">Tempo indeterminato</option>
                  <option value="determinato">Tempo determinato</option>
                  <option value="pensionato">Pensionato</option>
                  <option value="autonomo">Lavoratore autonomo</option>
                  <option value="altro">Altro</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Nome azienda / datore del garante</label>
                <input {...register('azienda_garante')} placeholder="Es. Comune di RE, Azienda SPA" className={inputClass} />
              </div>
            </motion.div>
          )}

          {/* Note */}
          <div>
            <label className={labelClass}>Note aggiuntive (facoltativo)</label>
            <textarea {...register('note')} rows={4} placeholder="Qualcosa che vuoi farci sapere..."
              className={inputClass + ' resize-none'} />
          </div>

          {/* Consenso */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" {...register('consenso_privacy')} className="accent-gold w-4 h-4 mt-0.5" />
              <span className="font-sans text-sm text-text-secondary">
                Ho letto e accetto la <a href="#" className="text-gold hover:underline">privacy policy</a> e acconsento al trattamento dei dati personali ai sensi del GDPR *
              </span>
            </label>
            <FieldError message={errors.consenso_privacy?.message} />
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-sans text-sm text-red-600">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold/90 disabled:opacity-60 text-white font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Invio in corso...</> : 'Invia la mia candidatura'}
          </button>
        </form>
      </div>
    </section>
  )
}
```

**Step 3: Commit**

```bash
git add app/api/ components/brochure/ApplicationForm.tsx && git commit -m "feat: API route candidature + form con validazione Zod e campi condizionali"
```

---

## Task 12: Pagina principale `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

**Step 1: Sostituisci `app/page.tsx`**

```tsx
import { Hero } from '@/components/brochure/Hero'
import { Overview } from '@/components/brochure/Overview'
import { Rooms } from '@/components/brochure/Rooms'
import { CommonSpaces } from '@/components/brochure/CommonSpaces'
import { ContractInfo } from '@/components/brochure/ContractInfo'
import { Rules } from '@/components/brochure/Rules'
import { ApplicationForm } from '@/components/brochure/ApplicationForm'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Overview />
      <Rooms />
      <CommonSpaces />
      <ContractInfo />
      <Rules />
      <ApplicationForm />
      <footer className="py-8 bg-anthracite text-center">
        <p className="font-sans text-sm text-white/40">
          © {new Date().getFullYear()} Appartamento di Pregio — Centro Storico, Reggio Emilia
        </p>
      </footer>
    </main>
  )
}
```

**Step 2: Avvia dev server e verifica visivamente**

```bash
npm run dev
```

Aprire http://localhost:3000 e verificare: Hero, feature cards, placeholder foto per tutte le sezioni, FAQ accordion, form con campi condizionali.

**Step 3: Commit**

```bash
git add app/page.tsx && git commit -m "feat: pagina principale brochure pubblica completa"
```

---

## Task 13: Dashboard Admin — Login

**Files:**
- Create: `app/admin/login/page.tsx`

**Step 1: Crea `app/admin/login/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Credenziali non valide. Riprova.'); setLoading(false) }
    else { router.push('/admin/dashboard'); router.refresh() }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-anthracite mb-1">Area Riservata</h1>
          <p className="font-sans text-sm text-text-secondary">Dashboard Admin</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-anthracite mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label className="block font-sans text-sm font-medium text-anthracite mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 font-sans text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 disabled:opacity-60 text-white font-sans font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Accesso...</> : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/admin/ && git commit -m "feat: pagina login dashboard admin"
```

---

## Task 14: Dashboard Admin — Componenti StatusBadge e StatsCards

**Files:**
- Create: `components/admin/StatusBadge.tsx`
- Create: `components/admin/StatsCards.tsx`

**Step 1: Crea `components/admin/StatusBadge.tsx`**

```tsx
import type { StatoCandidatura, StatusCandidato } from '@/lib/types'

const statoConfig: Record<StatoCandidatura, { label: string; className: string }> = {
  nuova:        { label: 'Nuova',        className: 'bg-blue-100 text-blue-700' },
  in_revisione: { label: 'In revisione', className: 'bg-amber-100 text-amber-700' },
  accettata:    { label: 'Accettata',    className: 'bg-green-100 text-green-700' },
  rifiutata:    { label: 'Rifiutata',   className: 'bg-red-100 text-red-700' },
}

const statusConfig: Record<StatusCandidato, { label: string; className: string }> = {
  studente:   { label: 'Studente',   className: 'bg-purple-100 text-purple-700' },
  lavoratore: { label: 'Lavoratore', className: 'bg-cyan-100 text-cyan-700' },
  autonomo:   { label: 'Autonomo',  className: 'bg-orange-100 text-orange-700' },
  altro:      { label: 'Altro',     className: 'bg-stone-100 text-stone-600' },
}

export function StatoCandidaturaBadge({ stato }: { stato: StatoCandidatura }) {
  const cfg = statoConfig[stato] ?? statoConfig.nuova
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans ${cfg.className}`}>{cfg.label}</span>
}

export function StatusCandidatoBadge({ status }: { status: StatusCandidato }) {
  const cfg = statusConfig[status] ?? statusConfig.altro
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans ${cfg.className}`}>{cfg.label}</span>
}
```

**Step 2: Crea `components/admin/StatsCards.tsx`**

```tsx
import type { Candidatura } from '@/lib/types'
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react'

export function StatsCards({ candidature }: { candidature: Candidatura[] }) {
  const stats = [
    { label: 'Totale',    value: candidature.length,                                                   icon: Users,       color: 'text-blue-500' },
    { label: 'Nuove',     value: candidature.filter(c => c.stato_candidatura === 'nuova').length,       icon: Clock,       color: 'text-amber-500' },
    { label: 'Accettate', value: candidature.filter(c => c.stato_candidatura === 'accettata').length,   icon: CheckCircle, color: 'text-green-500' },
    { label: 'Rifiutate', value: candidature.filter(c => c.stato_candidatura === 'rifiutata').length,   icon: XCircle,     color: 'text-red-500' },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans text-xs text-text-secondary uppercase tracking-wider">{label}</p>
            <Icon size={18} className={color} strokeWidth={1.5} />
          </div>
          <p className="font-serif text-3xl text-anthracite">{value}</p>
        </div>
      ))}
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add components/admin/ && git commit -m "feat: componenti admin StatusBadge e StatsCards"
```

---

## Task 15: Dashboard Admin — Tabella Candidature

**Files:**
- Create: `components/admin/CandidatureTable.tsx`

**Step 1: Crea `components/admin/CandidatureTable.tsx`**

```tsx
'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Candidatura, StatoCandidatura } from '@/lib/types'
import { StatoCandidaturaBadge, StatusCandidatoBadge } from './StatusBadge'
import { Search, Download, ExternalLink } from 'lucide-react'

const CAMERA_LABELS: Record<string, string> = {
  camera_1: 'Suite Privata', camera_2: 'Camera A', camera_3: 'Camera B', indifferente: 'Indifferente',
}

interface Props {
  candidature: Candidatura[]
  onUpdateStato: (id: string, stato: StatoCandidatura) => Promise<void>
}

export function CandidatureTable({ candidature, onUpdateStato }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStato, setFilterStato] = useState('')
  const [filterCamera, setFilterCamera] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => candidature.filter(c => {
    const matchSearch = !search || `${c.nome} ${c.cognome} ${c.email}`.toLowerCase().includes(search.toLowerCase())
    const matchStato = !filterStato || c.stato_candidatura === filterStato
    const matchCamera = !filterCamera || c.camera_preferita === filterCamera
    const matchStatus = !filterStatus || c.status === filterStatus
    return matchSearch && matchStato && matchCamera && matchStatus
  }), [candidature, search, filterStato, filterCamera, filterStatus])

  const handleStato = async (id: string, stato: StatoCandidatura) => {
    setUpdatingId(id)
    await onUpdateStato(id, stato)
    setUpdatingId(null)
    router.refresh()
  }

  const exportCSV = () => {
    const headers = ['Data', 'Nome', 'Cognome', 'Email', 'Telefono', 'Status', 'Camera', 'Stato']
    const rows = filtered.map(c => [
      new Date(c.created_at).toLocaleDateString('it-IT'),
      c.nome, c.cognome, c.email, c.telefono,
      c.status, CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita, c.stato_candidatura,
    ])
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'candidature.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const sel = "border border-stone-200 rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 text-anthracite"

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca..."
            className="pl-9 border border-stone-200 rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 w-56" />
        </div>
        <select value={filterStato} onChange={e => setFilterStato(e.target.value)} className={sel}>
          <option value="">Tutti gli stati</option>
          <option value="nuova">Nuova</option>
          <option value="in_revisione">In revisione</option>
          <option value="accettata">Accettata</option>
          <option value="rifiutata">Rifiutata</option>
        </select>
        <select value={filterCamera} onChange={e => setFilterCamera(e.target.value)} className={sel}>
          <option value="">Tutte le camere</option>
          <option value="camera_1">Suite Privata</option>
          <option value="camera_2">Camera A</option>
          <option value="camera_3">Camera B</option>
          <option value="indifferente">Indifferente</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={sel}>
          <option value="">Tutti i profili</option>
          <option value="studente">Studente</option>
          <option value="lavoratore">Lavoratore</option>
          <option value="autonomo">Autonomo</option>
          <option value="altro">Altro</option>
        </select>
        <button onClick={exportCSV}
          className="ml-auto flex items-center gap-1.5 text-sm font-sans text-text-secondary hover:text-anthracite border border-stone-200 rounded-lg px-3 py-2 hover:bg-stone-50 transition-colors">
          <Download size={14} /> Esporta CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-100 bg-white shadow-sm">
        <table className="w-full font-sans text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              {['Data', 'Candidato', 'Profilo', 'Camera', 'Email', 'Telefono', 'Stato', 'Azioni'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-text-secondary">Nessuna candidatura trovata</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{new Date(c.created_at).toLocaleDateString('it-IT')}</td>
                <td className="px-4 py-3 font-medium text-anthracite whitespace-nowrap">{c.nome} {c.cognome}</td>
                <td className="px-4 py-3"><StatusCandidatoBadge status={c.status} /></td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita}</td>
                <td className="px-4 py-3"><a href={`mailto:${c.email}`} className="text-gold hover:underline">{c.email}</a></td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{c.telefono}</td>
                <td className="px-4 py-3">
                  <select value={c.stato_candidatura} disabled={updatingId === c.id}
                    onChange={e => handleStato(c.id, e.target.value as StatoCandidatura)}
                    className="border border-stone-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gold/40 disabled:opacity-50">
                    <option value="nuova">Nuova</option>
                    <option value="in_revisione">In revisione</option>
                    <option value="accettata">Accettata</option>
                    <option value="rifiutata">Rifiutata</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => router.push(`/admin/candidato/${c.id}`)}
                    className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 font-medium">
                    Dettaglio <ExternalLink size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-xs text-text-secondary mt-2">{filtered.length} candidature</p>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/admin/CandidatureTable.tsx && git commit -m "feat: tabella candidature con filtri, ricerca, export CSV"
```

---

## Task 16: Dashboard Admin — Pagine

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/dashboard/page.tsx`
- Create: `app/admin/candidato/[id]/page.tsx`

**Step 1: Crea `app/admin/page.tsx`**

```tsx
import { redirect } from 'next/navigation'
export default function AdminPage() { redirect('/admin/dashboard') }
```

**Step 2: Crea `app/admin/dashboard/page.tsx`**

```tsx
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { StatsCards } from '@/components/admin/StatsCards'
import { CandidatureTable } from '@/components/admin/CandidatureTable'
import type { Candidatura, StatoCandidatura } from '@/lib/types'
import { LogOut } from 'lucide-react'

async function updateStato(id: string, stato: StatoCandidatura) {
  'use server'
  const supabase = createAdminClient()
  await supabase.from('candidature').update({ stato_candidatura: stato }).eq('id', id)
  revalidatePath('/admin/dashboard')
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminClient = createAdminClient()
  const { data: candidature } = await adminClient
    .from('candidature').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-anthracite">Dashboard Admin</h1>
          <p className="font-sans text-xs text-text-secondary">Gestione candidature — Appartamento RE</p>
        </div>
        <form action={async () => {
          'use server'
          const supabase = await createClient()
          await supabase.auth.signOut()
          redirect('/admin/login')
        }}>
          <button type="submit" className="flex items-center gap-1.5 text-sm font-sans text-text-secondary hover:text-anthracite transition-colors">
            <LogOut size={15} /> Esci
          </button>
        </form>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        <StatsCards candidature={candidature as Candidatura[] ?? []} />
        <CandidatureTable candidature={candidature as Candidatura[] ?? []} onUpdateStato={updateStato} />
      </main>
    </div>
  )
}
```

**Step 3: Crea `app/admin/candidato/[id]/page.tsx`**

```tsx
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import type { Candidatura, StatoCandidatura } from '@/lib/types'
import { StatoCandidaturaBadge, StatusCandidatoBadge } from '@/components/admin/StatusBadge'
import { ArrowLeft, Trash2 } from 'lucide-react'

const CAMERA_LABELS: Record<string, string> = {
  camera_1: 'Suite Privata (€540/mese)', camera_2: 'Camera A (€460/mese)',
  camera_3: 'Camera B (€460/mese)', indifferente: 'Indifferente',
}

export default async function CandidatoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminClient = createAdminClient()
  const { data } = await adminClient.from('candidature').select('*').eq('id', id).single()
  if (!data) notFound()
  const c = data as Candidatura

  async function updateStato(formData: FormData) {
    'use server'
    const stato = formData.get('stato') as StatoCandidatura
    createAdminClient().from('candidature').update({ stato_candidatura: stato }).eq('id', id)
    revalidatePath(`/admin/candidato/${id}`)
  }

  async function deleteCandidatura() {
    'use server'
    await createAdminClient().from('candidature').delete().eq('id', id)
    redirect('/admin/dashboard')
  }

  const Row = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className="flex flex-col sm:flex-row sm:gap-4 py-1">
        <dt className="font-sans text-xs text-text-secondary uppercase tracking-wider w-48 shrink-0">{label}</dt>
        <dd className="font-sans text-sm text-anthracite">{value}</dd>
      </div>
    ) : null

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-sans text-text-secondary hover:text-anthracite transition-colors">
          <ArrowLeft size={16} /> Torna alla lista
        </Link>
      </header>
      <main className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-anthracite">{c.nome} {c.cognome}</h1>
              <p className="font-sans text-xs text-text-secondary mt-1">
                Inviata il {new Date(c.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <StatusCandidatoBadge status={c.status} />
              <StatoCandidaturaBadge stato={c.stato_candidatura} />
            </div>
          </div>

          <section className="mb-8">
            <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">Dati Anagrafici</h2>
            <dl className="space-y-1">
              <Row label="Email" value={c.email} />
              <Row label="Telefono" value={c.telefono} />
              <Row label="Camera preferita" value={CAMERA_LABELS[c.camera_preferita] ?? c.camera_preferita} />
            </dl>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">Situazione</h2>
            <dl className="space-y-1">
              {c.status === 'lavoratore' && <><Row label="Tipo contratto" value={c.tipo_contratto} /><Row label="Azienda" value={c.nome_azienda} /></>}
              {c.status === 'autonomo' && <><Row label="Tipo attività" value={c.tipo_attivita} /><Row label="Settore" value={c.settore} /></>}
              {c.status === 'studente' && <>
                <Row label="Università" value={c.universita} />
                <Row label="Garanzie" value={c.garanzie?.replace(/_/g, ' ')} />
                <Row label="Contratto garante" value={c.tipo_contratto_garante} />
                <Row label="Azienda garante" value={c.azienda_garante} />
              </>}
            </dl>
          </section>

          {c.note && (
            <section className="mb-8">
              <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">Note</h2>
              <p className="font-sans text-sm text-text-secondary bg-stone-50 rounded-lg p-4 leading-relaxed">{c.note}</p>
            </section>
          )}

          <section className="mb-8">
            <h2 className="font-serif text-base text-anthracite mb-4 pb-2 border-b border-stone-100">Gestione Candidatura</h2>
            <form action={updateStato} className="flex items-center gap-3">
              <select name="stato" defaultValue={c.stato_candidatura}
                className="border border-stone-200 rounded-lg px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="nuova">Nuova</option>
                <option value="in_revisione">In revisione</option>
                <option value="accettata">Accettata</option>
                <option value="rifiutata">Rifiutata</option>
              </select>
              <button type="submit" className="bg-gold hover:bg-gold/90 text-white font-sans text-sm font-medium px-4 py-2 rounded-lg transition-all">
                Aggiorna stato
              </button>
            </form>
          </section>

          <form action={deleteCandidatura}>
            <button type="submit"
              onClick={e => { if (!confirm('Eliminare questa candidatura definitivamente?')) e.preventDefault() }}
              className="flex items-center gap-2 text-sm font-sans text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg px-4 py-2 transition-colors">
              <Trash2 size={15} /> Elimina candidatura
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add app/admin/ && git commit -m "feat: dashboard admin completa — login, lista candidature, dettaglio"
```

---

## Task 17: Verifica TypeScript + Build

**Step 1: Controlla errori TypeScript**

```bash
npx tsc --noEmit
```

Correggere eventuali errori prima di procedere.

**Step 2: Lint**

```bash
npm run lint
```

**Step 3: Build produzione**

```bash
npm run build
```

Build deve completarsi senza errori.

**Step 4: Commit se necessari fix**

```bash
git add . && git commit -m "fix: correzioni TypeScript e lint pre-build"
```

---

## Task 18: Setup Supabase Cloud (manuale)

1. Creare progetto su supabase.com
2. SQL Editor → incollare ed eseguire `supabase/migrations/001_create_candidature.sql`
3. Authentication → Email → abilitare email/password
4. Authentication → Users → creare utente admin
5. Project Settings → API → copiare URL, anon key, service_role key
6. Aggiornare `.env.local` con i valori reali

**Test end-to-end:**
1. `npm run dev`
2. Compilare form su http://localhost:3000
3. Accedere su http://localhost:3000/admin/login
4. Verificare candidatura in dashboard, cambio stato, filtri, dettaglio, eliminazione

---

## Task 19: Deploy su Vercel

```bash
# Usare la skill vercel:deploy oppure:
npx vercel --prod
```

Aggiungere su Vercel dashboard → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
