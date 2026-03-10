import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Immobiliare Diba',
  description: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40 px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-anthracite transition-colors"
        >
          <ArrowLeft size={16} />
          Torna al sito
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-sans text-gold uppercase tracking-[0.2em] text-xs mb-3">Informativa legale</p>
        <h1 className="font-serif text-3xl md:text-4xl text-anthracite mb-2">Privacy Policy</h1>
        <p className="font-sans text-sm text-text-secondary mb-12">
          Ai sensi dell&apos;art. 13 del Regolamento UE 2016/679 (GDPR) — ultimo aggiornamento: marzo 2026
        </p>

        <div className="space-y-10 font-sans text-sm text-text-secondary leading-relaxed">

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">1. Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento dei dati personali è <strong className="text-anthracite">Immobiliare Diba</strong>,
              con sede in Via Vittorio Veneto 3/d, 42121 Reggio Emilia (RE).
            </p>
            <p className="mt-2">
              Contatti: <a href="mailto:segreteria@immobiliarediba.it" className="text-gold hover:underline">segreteria@immobiliarediba.it</a> · <a href="tel:+393274911031" className="text-gold hover:underline">327 491 1031</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">2. Dati raccolti e finalità</h2>
            <p className="mb-4">I dati personali vengono raccolti esclusivamente attraverso il modulo di candidatura presente sul sito. Le informazioni trattate sono:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Nome e cognome</li>
              <li>Indirizzo e-mail</li>
              <li>Numero di telefono</li>
              <li>Situazione lavorativa</li>
              <li>Preferenza appartamento e durata di permanenza</li>
              <li>Eventuale messaggio libero</li>
            </ul>
            <p className="mt-4">
              I dati sono trattati con la finalità di <strong className="text-anthracite">valutare le candidature per la locazione degli appartamenti</strong> e
              contattare i candidati in merito alla loro richiesta.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">3. Base giuridica</h2>
            <p>
              Il trattamento si fonda sul <strong className="text-anthracite">consenso dell&apos;interessato</strong> (art. 6, par. 1, lett. a GDPR),
              espresso mediante l&apos;invio volontario del modulo di candidatura, e sull&apos;esecuzione di misure precontrattuali
              richieste dall&apos;interessato (art. 6, par. 1, lett. b GDPR).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">4. Modalità di trattamento e conservazione</h2>
            <p>
              I dati sono trattati con strumenti informatici, con misure di sicurezza adeguate a prevenire
              accessi non autorizzati, perdita o divulgazione. I dati vengono conservati per il tempo
              strettamente necessario alla gestione della candidatura e, in caso di locazione, per il periodo
              previsto dalla normativa fiscale e civilistica applicabile.
            </p>
            <p className="mt-2">
              I dati non saranno ceduti a terzi, né utilizzati per finalità diverse da quelle indicate.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">5. Comunicazione e diffusione</h2>
            <p>
              I dati personali non vengono diffusi. Possono essere comunicati esclusivamente a soggetti
              strettamente coinvolti nella gestione della locazione (es. professionisti incaricati per la
              redazione del contratto), vincolati da obblighi di riservatezza.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">6. Cookie e dati di navigazione</h2>
            <p>
              Il sito non utilizza cookie di profilazione o di tracciamento. I server che ospitano il sito
              possono registrare automaticamente dati tecnici di navigazione (indirizzo IP, tipo di browser,
              pagine visitate) a fini di sicurezza e diagnostici, nel rispetto delle disposizioni di legge.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">7. Diritti dell&apos;interessato</h2>
            <p className="mb-3">Ai sensi degli artt. 15-22 GDPR, l&apos;interessato ha il diritto di:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Accedere ai propri dati personali</li>
              <li>Ottenere la rettifica o la cancellazione dei dati</li>
              <li>Richiedere la limitazione del trattamento</li>
              <li>Opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso in qualsiasi momento, senza pregiudizio per la liceità del trattamento precedente</li>
            </ul>
            <p className="mt-4">
              Per esercitare tali diritti è sufficiente inviare una richiesta a{' '}
              <a href="mailto:segreteria@immobiliarediba.it" className="text-gold hover:underline">
                segreteria@immobiliarediba.it
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">8. Reclamo all&apos;autorità di controllo</h2>
            <p>
              L&apos;interessato ha il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali
              (www.garanteprivacy.it) qualora ritenga che il trattamento dei propri dati personali avvenga
              in violazione del GDPR.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-anthracite mb-3">9. Protezione delle immagini</h2>
            <p>
              Tutte le fotografie presenti sul sito sono di proprietà esclusiva di Immobiliare Diba e sono
              protette dal diritto d&apos;autore. È vietata la riproduzione, la copia, la distribuzione o qualsiasi
              altro utilizzo delle immagini senza autorizzazione scritta del titolare.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-200 text-center">
          <p className="font-sans text-xs text-stone-400">
            © {new Date().getFullYear()} Immobiliare Diba — Via Vittorio Veneto 3/d, 42121 Reggio Emilia
          </p>
        </div>
      </main>
    </div>
  )
}
