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
    longDescription: 'Spazioso e luminoso, l\'Appartamento 1 offre tre camere da letto indipendenti, due bagni, una grande cucina abitabile e un soggiorno confortevole. Ideale per famiglie o coinquilini che cercano spazio e comfort. L\'appartamento viene consegnato completamente arredato; qualora l\'affittuario preferisse arredarlo autonomamente, è possibile concordarlo con il locatore.',
    price: 1200,
    floor: 'Primo piano',
    amenities: ['Completamente arredato', 'Riscaldamento autonomo', 'Lavatrice', 'Cucina equipaggiata'],
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
    description: 'Appartamento con terrazza in camera da letto, bagno en-suite, secondo bagno, lavanderia, cucina abitabile e ampio salotto.',
    longDescription: 'L\'Appartamento 2 è una soluzione elegante e funzionale: camera da letto con bagno en-suite, un secondo bagno, cucina abitabile, salotto, lavanderia privata, terrazzo e anticamera. Perfetto per chi cerca un nido accogliente con spazi ben organizzati. L\'appartamento viene consegnato completamente arredato; qualora l\'affittuario preferisse arredarlo autonomamente, è possibile concordarlo con il locatore.',
    price: 1100,
    floor: 'Primo piano',
    amenities: ['Completamente arredato', 'Riscaldamento autonomo', 'Lavatrice in lavanderia privata', 'Terrazzo privato', 'Cucina equipaggiata'],
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
