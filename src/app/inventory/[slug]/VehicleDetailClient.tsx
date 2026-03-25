'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Vehicle } from '@/types/inventory'
import ImageGallery from '@/components/ImageGallery'
import SpecAccordion from '@/components/SpecAccordion'
import QuoteForm from '@/components/QuoteForm'
import VehicleCard from '@/components/VehicleCard'

function formatCapacity(vehicle: Vehicle): string {
  const parts: string[] = []
  if (vehicle.standardPassengers) {
    if (vehicle.maxCapacity !== vehicle.standardPassengers) {
      parts.push(`${vehicle.standardPassengers}(${vehicle.maxCapacity}) pass`)
    } else {
      parts.push(`${vehicle.standardPassengers} pass`)
    }
  }
  if (vehicle.wheelchairPositions && vehicle.wheelchairPositions > 0) {
    parts.push(`${vehicle.wheelchairPositions}wc`)
  }
  if (vehicle.crew) {
    parts.push(vehicle.crew)
  }
  return parts.join(' + ')
}

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'Contact for Pricing'
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

interface VehicleDetailClientProps {
  vehicle: Vehicle
  similarVehicles: Vehicle[]
}

export default function VehicleDetailClient({ vehicle, similarVehicles }: VehicleDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'images' | 'floorplan' | 'tour'>('images')
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.vehicleType}`
  const images = vehicle.images || []
  const hasFloorPlan = !!vehicle.floorPlan
  const hasMatterport = !!vehicle.matterportUrl

  const scrollToQuoteForm = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/inventory" className="hover:text-blue-600">Inventory</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{title}</span>
      </nav>

      {/* Top Section */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            vehicle.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {vehicle.condition.toUpperCase()}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
            {vehicle.vehicleType}
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
        {vehicle.description && (
          <p className="mt-3 text-gray-600 max-w-3xl">{vehicle.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Specs (Mobile only — shows above gallery) */}
          <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Specs</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Seating</dt>
                <dd className="font-medium text-gray-900">{formatCapacity(vehicle)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Fuel Type</dt>
                <dd className="font-medium text-gray-900">{vehicle.fuelType}</dd>
              </div>
              <div>
                <dt className="text-gray-500">CDL Required</dt>
                <dd className="font-medium text-gray-900">{vehicle.cdlRequired}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Wheelchair</dt>
                <dd className="font-medium text-gray-900">{vehicle.wheelchairAccessible}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">Stock #</dt>
                <dd className="font-medium text-gray-900">{vehicle.stockNumber}</dd>
              </div>
            </dl>
          </div>

          {/* Media Gallery Tabs */}
          <div>
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('images')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === 'images'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Photos ({images.length})
              </button>
              {hasFloorPlan && (
                <button
                  onClick={() => setActiveTab('floorplan')}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === 'floorplan'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Floor Plan
                </button>
              )}
              {hasMatterport && (
                <button
                  onClick={() => setActiveTab('tour')}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === 'tour'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  360&deg; Tour
                </button>
              )}
            </div>

            {activeTab === 'images' && (
              <ImageGallery images={images} title={title} />
            )}

            {activeTab === 'floorplan' && vehicle.floorPlan && (
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={vehicle.floorPlan}
                    alt={`${title} Floor Plan`}
                    className="w-full object-contain max-h-[600px]"
                  />
                </div>
                <a
                  href={vehicle.floorPlan}
                  download
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Floor Plan
                </a>
              </div>
            )}

            {activeTab === 'tour' && vehicle.matterportUrl && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Virtual Tour</h3>
                <div className="aspect-video min-h-[500px] rounded-lg overflow-hidden">
                  <iframe
                    src={vehicle.matterportUrl}
                    title={`${title} 360° Tour`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="xr-spatial-tracking"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Spec Accordions */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Specifications</h2>

            <SpecAccordion
              title="Details & Availability"
              defaultOpen={true}
              specs={[
                { label: 'Condition', value: vehicle.condition },
                { label: 'Stock #', value: vehicle.stockNumber },
                { label: 'VIN', value: vehicle.vin },
                { label: 'Year', value: vehicle.year },
                { label: 'CDL Required', value: vehicle.cdlRequired },
                { label: 'Make', value: vehicle.make },
                { label: 'Model', value: vehicle.model },
                { label: 'Available At', value: vehicle.locations?.join(', ') },
                ...(vehicle.mileage ? [{ label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} miles` }] : []),
              ]}
            />

            <SpecAccordion
              title="Capacity & Specs"
              defaultOpen={true}
              specs={[
                { label: 'Seating Capacity', value: formatCapacity(vehicle) },
                { label: 'Max Capacity', value: vehicle.maxCapacity },
                { label: 'Standard Passengers', value: vehicle.standardPassengers },
                { label: 'Wheelchair Positions', value: vehicle.wheelchairPositions },
                { label: 'Lift Manufacturer', value: vehicle.liftManufacturer },
                { label: 'Fuel Type', value: vehicle.fuelType },
                { label: 'Fuel Tank Capacity', value: vehicle.fuelTankCapacity },
                { label: 'Engine Make', value: vehicle.engineMake },
                { label: 'Engine Model', value: vehicle.engineModel },
                { label: 'Brake', value: vehicle.brake },
                { label: 'Transmission', value: vehicle.transmissionMfr ? `${vehicle.transmissionMfr}${vehicle.transmissionModel ? ` ${vehicle.transmissionModel}` : ''}` : null },
                { label: 'Wheelbase', value: vehicle.wheelbase },
                { label: 'Suspension Type', value: vehicle.suspensionType },
              ]}
            />

            <SpecAccordion
              title="Features & Amenities"
              specs={[
                { label: 'Exterior Color', value: vehicle.exteriorColor },
                { label: 'Interior Color', value: vehicle.interiorColor },
                { label: 'A/C', value: vehicle.ac },
                { label: 'Luggage', value: vehicle.luggage },
              ]}
            />
          </div>

          {/* Quote Form */}
          <div id="quote-form" className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Quote</h2>
            <QuoteForm vehicle={vehicle} />
          </div>
        </div>

        {/* Right Column (1/3) — CTA + Quick Specs */}
        <div className="hidden lg:block">
          <div className="sticky-cta space-y-4">
            {/* CTA Box */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-4">
                {vehicle.price ? (
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(vehicle.price)}</span>
                ) : (
                  <span className="text-lg font-semibold text-blue-600">Contact for Pricing</span>
                )}
              </div>
              <div className="space-y-3">
                <button onClick={scrollToQuoteForm} className="w-full btn-primary text-base py-3">
                  Get a Quote
                </button>
                <a
                  href="tel:+15551234567"
                  className="w-full btn-secondary text-center block py-3"
                >
                  Call for Info
                </a>
              </div>
            </div>

            {/* Quick Specs Box */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Specs</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Seating Capacity</dt>
                  <dd className="font-medium text-gray-900">{formatCapacity(vehicle)}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Fuel Type</dt>
                  <dd className="font-medium text-gray-900">{vehicle.fuelType}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">CDL Required</dt>
                  <dd className="font-medium text-gray-900">{vehicle.cdlRequired}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Wheelchair Accessible</dt>
                  <dd className="font-medium text-gray-900">{vehicle.wheelchairAccessible}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Stock #</dt>
                  <dd className="font-medium text-gray-900">{vehicle.stockNumber}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30 flex items-center gap-3">
        <div className="flex-1">
          {vehicle.price ? (
            <span className="text-lg font-bold text-gray-900">{formatPrice(vehicle.price)}</span>
          ) : (
            <span className="text-sm font-semibold text-blue-600">Contact for Pricing</span>
          )}
        </div>
        <button onClick={scrollToQuoteForm} className="btn-primary text-sm py-2.5 px-5">
          Get a Quote
        </button>
        <a href="tel:+15551234567" className="btn-secondary text-sm py-2.5 px-4">
          Call
        </a>
      </div>

      {/* Similar Vehicles */}
      {similarVehicles.length > 0 && (
        <section className="mt-16 mb-20 lg:mb-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
