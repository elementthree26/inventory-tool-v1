import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVehicleBySlug, getSimilarVehicles } from '@/lib/inventory'
import type { Vehicle } from '@/types/inventory'
import VehicleDetailClient from './VehicleDetailClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string }
}

function generateSchemaMarkup(vehicle: Vehicle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.vehicleType}`,
    description: vehicle.description || `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.vehicleType} available for purchase`,
    sku: vehicle.stockNumber,
    vehicleModelDate: String(vehicle.year),
    fuelType: vehicle.fuelType,
    vehicleSeatingCapacity: vehicle.maxCapacity,
    brand: {
      '@type': 'Brand',
      name: vehicle.make,
    },
    model: vehicle.model,
    vehicleIdentificationNumber: vehicle.vin,
    ...(vehicle.mileage && { mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'SMI' } }),
    offers: vehicle.price
      ? {
          '@type': 'Offer',
          price: vehicle.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          itemCondition: vehicle.condition === 'New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
        }
      : {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: 0,
            priceCurrency: 'USD',
          },
        },
    ...(vehicle.images && vehicle.images.length > 0 && { image: vehicle.images }),
  }
}

export async function generateMetadata({ params }: PageProps) {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) return { title: 'Vehicle Not Found' }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.vehicleType}`
  return {
    title: `${title} | Stock #${vehicle.stockNumber}`,
    description: vehicle.description || `View details for this ${title}. ${vehicle.fuelType} fuel type, seating capacity of ${vehicle.maxCapacity}. Request a quote today.`,
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) notFound()

  const similarVehicles = await getSimilarVehicles(vehicle)
  const schema = generateSchemaMarkup(vehicle)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <VehicleDetailClient vehicle={vehicle} similarVehicles={similarVehicles} />
    </>
  )
}
