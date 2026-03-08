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
