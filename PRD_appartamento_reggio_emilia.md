# PRD — Brochure Interattiva Appartamento di Pregio + Dashboard Admin
**Reggio Emilia, Centro Storico**

---

## 1. Panoramica del Progetto

Realizzare una **web app** composta da due parti distinte:

1. **Brochure pubblica** — pagina marketing interattiva e dettagliata dell'appartamento, con form di candidatura finale.
2. **Dashboard admin privata** — pannello di gestione dei candidati ricevuti tramite form, collegato a Supabase.

---

## 2. Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Animazioni | Framer Motion |
| Backend / DB | Supabase (PostgreSQL) |
| Form | React Hook Form + Zod |
| Auth dashboard | Supabase Auth (magic link o email/password) |
| Deploy | Vercel |

---

## 3. Struttura delle Route

```
/                → Brochure pubblica (landing page)
/candidatura     → Form di candidatura (o sezione ancorata nella stessa pagina)
/admin           → Login dashboard
/admin/dashboard → Lista candidati (protetta da auth)
/admin/candidato/[id] → Dettaglio singolo candidato
```

---

## 4. Brochure Pubblica — Specifiche di Contenuto

### 4.1 Hero Section

- Titolo principale: **"Appartamento di Pregio — Centro Storico, Reggio Emilia"**
- Sottotitolo evocativo del contesto: centro storico, eleganza, qualità costruttiva
- CTA scroll verso la sezione stanze o il form
- Stile: elegante, minimal, colori neutri caldi (es. beige, bianco avorio, antracite)
- **Foto hero**: immagine full-width a tutta altezza viewport (o slideshow automatico) con le immagini più rappresentative dell'appartamento. Supporto per array di foto configurabile. Overlay scuro leggero per leggibilità del titolo.

---

### 4.2 Sezione "L'Appartamento"

Descrizione generale dell'immobile con i seguenti punti chiave:

- **Piano**: Primo piano con ascensore
- **Posizione**: Centro storico di Reggio Emilia
- **Consegna**: Appartamento completamente arredato
- **Classe energetica**: A++ (massima efficienza energetica)
- **Infissi**: Triplo vetro con camera a gas — isolamento termico e acustico superiore
- **Porta**: Blindata
- **Climatizzazione**: Aria condizionata (riscaldamento e raffrescamento)
- **Cucina**: Cucina su misura con elettrodomestici SMEG, di dimensioni generose
- **Soggiorno**: Ampio soggiorno luminoso

Usare icone o card visive per rendere leggibili le features chiave.

**Galleria fotografica generale dell'appartamento:**
- Griglia fotografica dopo la descrizione testuale (layout masonry o griglia 2/3 colonne)
- Lightbox al click su ogni foto (fullscreen con navigazione frecce + swipe su mobile)
- Didascalie opzionali su ogni immagine
- Le foto sono caricate come asset statici nella cartella `/public/images/appartamento/`
- Placeholder visivo elegante (skeleton/shimmer loader) se le foto non sono ancora disponibili

---

### 4.3 Sezione "Le Stanze"

Presentare le 3 camere con card interattive/espandibili:

#### Camera 1 — Suite Privata
- Bagno privato en-suite
- **Affitto**: €500/mese + €40 spese condominiali
- **Totale mensile**: €540
- **Foto**: carosello orizzontale con le foto della camera e del bagno privato (min 1, max illimitato). Navigazione con frecce e dot indicators. Immagini da `/public/images/camera-1/`. Placeholder elegante se assenti.

#### Camera 2 — Camera Doppia/Singola (A)
- Bagno condiviso con Camera 3
- **Affitto**: €420/mese + €40 spese condominiali
- **Totale mensile**: €460
- **Foto**: carosello orizzontale con le foto della camera. Immagini da `/public/images/camera-2/`. Placeholder elegante se assenti.

#### Camera 3 — Camera Doppia/Singola (B)
- Bagno condiviso con Camera 2
- **Affitto**: €420/mese + €40 spese condominiali
- **Totale mensile**: €460
- **Foto**: carosello orizzontale con le foto della camera. Immagini da `/public/images/camera-3/`. Placeholder elegante se assenti.

Ogni card deve indicare chiaramente il prezzo, la tipologia di bagno e il totale. Il carosello foto occupa la parte superiore della card; testo e prezzo sotto.

---

### 4.4 Sezione "Spazi Comuni"

- **Cucina**: Su misura, grande, elettrodomestici SMEG (frigo, forno, piano cottura, lavastoviglie — specificare quelli effettivamente presenti o usare formulazione aperta)
- **Soggiorno**: Ampio, arredato, luminoso
- **Bagno condiviso**: Accessibile da Camera 2 e Camera 3

**Foto per ogni ambiente comune:**

Ogni spazio comune ha una propria sotto-sezione con:
- Titolo dell'ambiente (es. "La Cucina", "Il Soggiorno", "Il Bagno Condiviso")
- Breve descrizione testuale
- Galleria fotografica dedicata: griglia 2–3 colonne o carosello, con lightbox al click
- Immagini organizzate in sottocartelle:
  - `/public/images/cucina/`
  - `/public/images/soggiorno/`
  - `/public/images/bagno-condiviso/`
- Placeholder shimmer elegante se le foto non sono ancora caricate

---

### 4.5 Sezione "Contratto & Utenze" ⚠️ Importante

Questa sezione deve essere **chiara, prominente e visivamente distinta** (es. box evidenziato).

**Testo da veicolare:**

> L'appartamento prevede **un unico contratto di locazione**, intestato congiuntamente a tutti e tre gli inquilini (co-intestatari). Analogamente, sarà attiva **una sola utenza** (luce/gas/internet) co-intestata tra i coinquilini.
>
> Questo significa che tutti i coinquilini condividono la responsabilità contrattuale e la gestione delle spese. È richiesta pertanto piena collaborazione e accordo tra i candidati selezionati.

Aggiungere eventualmente una FAQ breve:
- *Posso uscire anticipatamente dal contratto?* — Risposta: da definire con il locatore, ma il contratto è unico per tutti.
- *Come vengono divise le utenze?* — Risposta: unica bolletta, gestione interna tra coinquilini.

---

### 4.6 Sezione "Regole della Casa"

Lista di regole (da personalizzare, proporre una base standard):

- Non è consentito fumare all'interno dell'appartamento
- Sono ammessi animali domestici solo previo accordo esplicito con il proprietario
- Rispetto degli orari di silenzio (es. 22:00 – 08:00)
- Manutenzione ordinaria degli spazi comuni a carico dei coinquilini
- Nessuna modifica all'arredamento o alle pareti senza autorizzazione
- Ospiti occasionali consentiti; ospiti fissi non autorizzati senza accordo

---

### 4.7 Sezione Form di Candidatura

Vedi Sezione 5 per le specifiche complete del form.

---

## 5. Form di Candidatura — Specifiche

Il form raccoglie i dati del candidato interessato a una delle camere. Struttura logica:

### 5.1 Dati Anagrafici (tutti obbligatori)

| Campo | Tipo | Note |
|---|---|---|
| Nome | Text | |
| Cognome | Text | |
| Email | Email | Validazione formato |
| Numero di telefono | Tel | Validazione formato italiano |

---

### 5.2 Camera di Interesse

| Campo | Tipo | Opzioni |
|---|---|---|
| Camera preferita | Select | Camera 1 (€540) / Camera 2 (€460) / Camera 3 (€460) / Indifferente |

---

### 5.3 Status del Candidato

| Campo | Tipo | Opzioni |
|---|---|---|
| Status | Radio / Select | Studente / Lavoratore / Lavoratore autonomo / Altro |

---

### 5.4 Campi Condizionali — Se LAVORATORE (dipendente)

| Campo | Tipo | Note |
|---|---|---|
| Tipologia di contratto | Select | Tempo indeterminato / Tempo determinato / Apprendistato / Altro |
| Nome dell'azienda | Text | |

---

### 5.5 Campi Condizionali — Se LAVORATORE AUTONOMO

| Campo | Tipo | Note |
|---|---|---|
| Tipo di attività | Text | es. Partita IVA, libero professionista |
| Settore | Text | |

---

### 5.6 Campi Condizionali — Se STUDENTE

| Campo | Tipo | Note |
|---|---|---|
| Università / Istituto | Text | |
| Garanzie familiari | Radio | 1 genitore garante / 2 genitori garanti / Nessun garante |
| Tipologia contratto lavorativo del/dei garante/i | Select | Tempo indeterminato / Tempo determinato / Pensionato / Lavoratore autonomo / Altro |
| Nome dell'azienda / datore del garante | Text | |

---

### 5.7 Note Aggiuntive

| Campo | Tipo | Note |
|---|---|---|
| Messaggio / Note | Textarea | Facoltativo |

---

### 5.8 Consenso

- [ ] Ho letto e accetto la privacy policy (link placeholder)
- [ ] Acconsento al trattamento dei dati personali ai sensi del GDPR

---

### 5.9 Comportamento del Form

- Validazione real-time con Zod + React Hook Form
- Campi condizionali mostrati/nascosti dinamicamente in base allo status selezionato
- Feedback visivo su errori e successo
- Dopo invio: messaggio di conferma "Candidatura inviata! Ti contatteremo presto."
- I dati vengono salvati su Supabase (tabella `candidature`)

---

## 6. Database Supabase — Schema

### Tabella: `candidature`

```sql
create table candidature (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- Dati anagrafici
  nome text not null,
  cognome text not null,
  email text not null,
  telefono text not null,

  -- Preferenza camera
  camera_preferita text not null, -- 'camera_1' | 'camera_2' | 'camera_3' | 'indifferente'

  -- Status
  status text not null, -- 'studente' | 'lavoratore' | 'autonomo' | 'altro'

  -- Campi lavoratore
  tipo_contratto text,
  nome_azienda text,

  -- Campi autonomo
  tipo_attivita text,
  settore text,

  -- Campi studente
  universita text,
  garanzie text, -- '1_genitore' | '2_genitori' | 'nessuno'
  tipo_contratto_garante text,
  azienda_garante text,

  -- Extra
  note text,
  consenso_privacy boolean not null default false,

  -- Stato gestione (usato dalla dashboard)
  stato_candidatura text default 'nuova' -- 'nuova' | 'in_revisione' | 'accettata' | 'rifiutata'
);
```

### Row Level Security (RLS)

- La tabella è **write-only per gli anonimi** (solo INSERT dal form pubblico)
- La lettura è consentita solo agli utenti autenticati (admin dashboard)

```sql
-- Abilita RLS
alter table candidature enable row level security;

-- Chiunque può inserire
create policy "insert_public" on candidature
  for insert to anon with check (true);

-- Solo autenticati possono leggere
create policy "read_authenticated" on candidature
  for select to authenticated using (true);

-- Solo autenticati possono aggiornare (cambio stato)
create policy "update_authenticated" on candidature
  for update to authenticated using (true);
```

---

## 7. Dashboard Admin — Specifiche

### 7.1 Autenticazione

- Login tramite Supabase Auth (email + password oppure magic link)
- Route `/admin` protetta: redirect a `/admin/login` se non autenticato
- Middleware Next.js per protezione lato server

---

### 7.2 Pagina `/admin/dashboard`

**Tabella candidature** con colonne:

| Colonna | Tipo |
|---|---|
| Data invio | Timestamp formattato |
| Nome Cognome | Text |
| Status | Badge colorato (studente/lavoratore/ecc.) |
| Camera preferita | Text |
| Email | Link mailto |
| Telefono | Text |
| Stato candidatura | Badge colorato + dropdown per modificare |
| Azioni | Pulsante "Dettaglio" |

**Funzionalità:**
- Filtro per stato candidatura (nuova / in revisione / accettata / rifiutata)
- Filtro per camera preferita
- Filtro per status (studente/lavoratore/ecc.)
- Ricerca per nome/cognome/email
- Ordinamento per data (default: più recente prima)
- Contatori in alto: tot candidature, per stato, per camera
- Export CSV delle candidature filtrate

---

### 7.3 Pagina `/admin/candidato/[id]`

**Scheda completa del candidato:**

- Tutti i dati anagrafici
- Status e campi condizionali compilati
- Note
- Data di invio
- **Cambio stato** con dropdown: Nuova → In Revisione → Accettata / Rifiutata
- Pulsante "Torna alla lista"
- Pulsante "Elimina candidatura" (con conferma)

---

## 8. Design & UX della Brochure

### Palette consigliata
- Sfondo: `#FAFAF7` (bianco avorio caldo)
- Primario: `#2C2C2C` (antracite quasi nero)
- Accento: `#C9A96E` (oro opaco / bronzo elegante)
- Testo secondario: `#6B6B6B`

### Tipografia
- Titoli: Playfair Display o Cormorant Garamond (serif elegante)
- Corpo: Inter o DM Sans (sans-serif leggibile)

### Stile generale
- Minimal, lusso discreto, non eccessivamente "immobiliare"
- Sezioni con transizioni scroll fluide (Framer Motion)
- Icone Lucide React per le features
- Card con ombre sottili e bordi arrotondati
- Mobile-first e completamente responsive

---

## 9. Struttura File del Progetto

```
/
├── app/
│   ├── page.tsx                    # Brochure pubblica
│   ├── layout.tsx
│   ├── globals.css
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── candidato/[id]/page.tsx
│   └── api/
│       └── candidature/route.ts    # API route per salvataggio form
├── components/
│   ├── brochure/
│   │   ├── Hero.tsx
│   │   ├── Overview.tsx
│   │   ├── RoomCard.tsx
│   │   ├── CommonSpaces.tsx
│   │   ├── ContractInfo.tsx
│   │   ├── Rules.tsx
│   │   ├── PhotoGallery.tsx        # Griglia con lightbox (riusabile)
│   │   ├── PhotoCarousel.tsx       # Carosello (riusabile per le camere)
│   │   └── ApplicationForm.tsx
│   ├── admin/
│   │   ├── CandidatureTable.tsx
│   │   ├── CandidatoDetail.tsx
│   │   ├── StatusBadge.tsx
│   │   └── StatsCards.tsx
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── validations/
│   │   └── candidatura.ts          # Schema Zod
│   └── types.ts
├── public/
│   └── images/
│       ├── appartamento/           # Foto hero e galleria generale
│       ├── camera-1/               # Foto Camera 1 + bagno privato
│       ├── camera-2/               # Foto Camera 2
│       ├── camera-3/               # Foto Camera 3
│       ├── cucina/                 # Foto cucina
│       ├── soggiorno/              # Foto soggiorno
│       └── bagno-condiviso/        # Foto bagno condiviso
├── middleware.ts                    # Protezione route admin
├── .env.local                      # SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
└── supabase/
    └── migrations/
        └── 001_create_candidature.sql
```

---

## 10. Variabili d'Ambiente Richieste

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 11. Sequenza di Sviluppo Consigliata

1. Setup Next.js + Tailwind + shadcn/ui
2. Configurazione Supabase (progetto, tabella, RLS, auth)
3. Sviluppo brochure pubblica (sezioni statiche)
4. Integrazione form con validazione Zod + invio a Supabase
5. Sviluppo dashboard admin (auth + lista + dettaglio)
6. Styling e animazioni Framer Motion
7. Test form → Supabase → Dashboard end-to-end
8. Deploy su Vercel

---

## 12. Note Finali per lo Sviluppatore

- Il form pubblico deve funzionare senza autenticazione (usa la `anon key`)
- La dashboard deve usare la `service_role key` lato server (mai esposta al client)
- Gestire correttamente i campi condizionali del form (mostrati solo se rilevanti)
- Il campo `stato_candidatura` è modificabile solo dalla dashboard admin
- Tutti i testi della brochure sono in **italiano**
- La dashboard può essere in italiano o inglese (preferibilmente italiano)
- Aggiungere `loading states` e `error handling` su tutte le chiamate async
- Il form deve essere protetto da spam (es. honeypot field o rate limiting Supabase)
- **Gestione foto**: le immagini sono asset statici in `/public/images/`. I componenti `PhotoGallery` e `PhotoCarousel` leggono i file da un array di configurazione in `lib/photos.ts` — questo permette di aggiungere/rimuovere foto senza toccare i componenti. Ogni ambiente ha la sua chiave nell'oggetto di configurazione.
- **Foto mancanti**: se una cartella è vuota o l'array è vuoto, mostrare un placeholder con sfondo neutro e icona fotocamera — mai errori o spazi vuoti bianchi.
- **Lightbox**: usare la libreria `yet-another-react-lightbox` (leggera, accessibile, supporta swipe mobile e navigazione da tastiera).
- **Ottimizzazione immagini**: usare sempre il componente `next/image` con `width`, `height` e `priority` appropriati per le foto hero.
