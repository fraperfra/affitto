import { notFound } from 'next/navigation'
import { getApartment, apartments } from '@/lib/apartments'
import { getPhotosFromDB } from '@/lib/photos-db'
import { Header } from '@/components/brochure/Header'
import { ApartmentHero } from '@/components/appartamento/ApartmentHero'
import { ApartmentInfo } from '@/components/appartamento/ApartmentInfo'
import { ApartmentRooms } from '@/components/appartamento/ApartmentRooms'
import { FloorPlan } from '@/components/appartamento/FloorPlan'
import { EntryCostCalculator } from '@/components/appartamento/EntryCostCalculator'
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
        <EntryCostCalculator price={apartment.price} />
        <ApplicationForm
          defaultAppartamento={apartment.id === '1' ? 'appartamento_1' : 'appartamento_2'}
        />
      </main>
    </>
  )
}
