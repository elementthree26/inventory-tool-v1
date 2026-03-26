'use client'

import Link from 'next/link'
import type { Vehicle } from '@/types/inventory'

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
  if (price === null || price === undefined) return 'Contact Us for Pricing'
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.vehicleType}`
  const thumbnailUrl = vehicle.featuredImage || (vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null)

  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 card-hover group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Condition Badge */}
        {vehicle.condition === 'New' && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
        {vehicle.condition === 'Pre-Owned' && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            PRE-OWNED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
          {title}
        </h3>

        <div className="space-y-1.5 text-sm text-gray-600 mb-4 flex-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{formatCapacity(vehicle)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span>Stock #{vehicle.stockNumber}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          {vehicle.price ? (
            <span className="text-xl font-bold text-gray-900">{formatPrice(vehicle.price)}</span>
          ) : (
            <span className="text-sm font-medium text-blue-600">Contact Us for Pricing</span>
          )}
        </div>

        {/* CTA */}
        <button className="w-full btn-primary text-sm py-2.5">
          Get a Quote
        </button>
      </div>
    </Link>
  )
}
