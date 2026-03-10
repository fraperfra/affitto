# Design: Ristrutturazione sito — 2 appartamenti interi

## Contesto
Conversione da sito con camere singole a sito con 2 appartamenti affittati per intero.

## Appartamenti

**Appartamento 1** — €1200/mese
- 3 camere da letto, 2 bagni, cucina abitabile, soggiorno

**Appartamento 2** — €1200/mese
- 1 camera da letto (en-suite), 2° bagno, cucina abitabile, salotto, terrazzo, lavanderia, anticamera, ripostiglio

## Route

| Route | Tipo | Note |
|---|---|---|
| `/` | Modifica | Sostituisce sezione Rooms con Apartments |
| `/appartamento/1` | Nuova | Dettaglio App. 1 |
| `/appartamento/2` | Nuova | Dettaglio App. 2 |

## Homepage

Struttura sezioni (invariata tranne la sostituzione):
- Hero, Overview, **Apartments** *(sostituisce Rooms)*, Gallery, CommonSpaces, ContractInfo, Rules, ApplicationForm

### Sezione Apartments
- 2 card affiancate (grid 2 colonne)
- Card: foto cover, nome, tag stanze/bagni, prezzo, bottone "Scopri di più"

## Pagina dettaglio (colonna singola)

1. Breadcrumb "← Torna agli appartamenti"
2. Hero slideshow
3. Descrizione
4. Dettagli tecnici + Servizi (icone)
5. Stanze (card con foto e descrizione)
6. Planimetria
7. Form candidatura

## Dati (config statica)

Nuovo file `lib/apartments.ts` con interfacce `Apartment` e `Room`.
Foto da Supabase come attualmente.

## Admin — Gestione Foto

Pagina foto con 3 tab:

**Tab "Appartamento 1":** `app1-hero`, `app1-camera-1`, `app1-camera-2`, `app1-camera-3`, `app1-cucina`, `app1-soggiorno`, `app1-bagno-1`, `app1-bagno-2`, `app1-planimetria`

**Tab "Appartamento 2":** `app2-hero`, `app2-camera`, `app2-cucina`, `app2-salotto`, `app2-bagno-1`, `app2-bagno-2`, `app2-terrazzo`, `app2-lavanderia`, `app2-planimetria`

**Tab "Comune":** `galleria`, `spazi-comuni`

## Form Candidatura

### Rimozioni
- Enum `studente` da `StatusCandidato`
- Campi condizionali studente: `universita`, `garanzie`, `tipo_contratto_garante`, `azienda_garante`

### Modifiche
- `camera_preferita` → `appartamento_preferito`: `'appartamento_1' | 'appartamento_2' | 'indifferente'`

### Aggiunte
- `durata_permanenza`: dropdown `'6_mesi' | '12_mesi' | '18_mesi' | '24_mesi' | 'oltre_2_anni'`

### Aggiornamenti a cascata
- `lib/validations/candidatura.ts` — Zod schema
- `lib/types.ts` — tipi TypeScript
- `app/api/candidature/route.ts` — endpoint POST
- `components/admin/CandidatureTable.tsx` — filtri e colonne
- `app/admin/candidato/[id]/page.tsx` — dettaglio candidato

## Componenti da creare

- `lib/apartments.ts` — config dati
- `components/brochure/Apartments.tsx` — sezione homepage con 2 card
- `components/brochure/ApartmentCard.tsx` — card singolo appartamento
- `app/appartamento/[id]/page.tsx` — pagina dettaglio
- `components/appartamento/ApartmentHero.tsx`
- `components/appartamento/ApartmentDetails.tsx`
- `components/appartamento/ApartmentAmenities.tsx`
- `components/appartamento/ApartmentRooms.tsx`
- `components/appartamento/FloorPlan.tsx`
- `components/admin/foto/ApartmentPhotoTabs.tsx`

## Componenti da modificare

- `app/page.tsx` — sostituisci `<Rooms>` con `<Apartments>`
- `components/brochure/ApplicationForm.tsx`
- `lib/validations/candidatura.ts`
- `lib/types.ts`
- `app/admin/foto/page.tsx`
