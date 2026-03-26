'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FilterSidebar from '@/components/FilterSidebar'
import ActiveFilters from '@/components/ActiveFilters'
import VehicleCard from '@/components/VehicleCard'
import Pagination from '@/components/Pagination'
import type { Vehicle, AvailableFilters, FilterState, SortOption } from '@/types/inventory'

function InventoryPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    makes: [],
    vehicleTypes: [],
    fuelTypes: [],
    locations: [],
    industries: [],
    yearMin: 2020,
    yearMax: 2026,
    conditions: [],
  })
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Read filters from URL
  const getFiltersFromURL = useCallback((): FilterState => {
    const filters: FilterState = {}
    const keys: (keyof FilterState)[] = [
      'condition', 'type', 'wheelchair', 'capacity', 'make',
      'cdl', 'fuel', 'location', 'industry', 'yearMin', 'yearMax',
      'search', 'sort', 'page',
    ]
    keys.forEach((key) => {
      const val = searchParams.get(key)
      if (val) filters[key] = val
    })
    return filters
  }, [searchParams])

  const [activeFilters, setActiveFilters] = useState<FilterState>(getFiltersFromURL)

  // Sync filters with URL
  useEffect(() => {
    setActiveFilters(getFiltersFromURL())
  }, [getFiltersFromURL])

  // Fetch inventory
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      try {
        const res = await fetch(`/api/inventory?${params.toString()}`)
        const data = await res.json()
        setVehicles(data.vehicles || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 0)
        if (data.filters) setAvailableFilters(data.filters)
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [activeFilters])

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      // Preserve UTMs
      searchParams.forEach((value, key) => {
        if (key.startsWith('utm_')) params.set(key, value)
      })

      const qs = params.toString()
      router.push(`/inventory${qs ? `?${qs}` : ''}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleFilterChange = useCallback(
    (key: string, value: string | undefined) => {
      const newFilters = { ...activeFilters, [key]: value, page: undefined }
      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters, updateURL]
  )

  const handleClearAll = useCallback(() => {
    // Preserve UTMs only
    const newFilters: FilterState = {}
    setActiveFilters(newFilters)
    updateURL(newFilters)
  }, [updateURL])

  const handleRemoveFilter = useCallback(
    (key: string, value?: string) => {
      const newFilters = { ...activeFilters }
      if (value !== undefined) {
        (newFilters as Record<string, string | undefined>)[key] = value || undefined
      } else {
        (newFilters as Record<string, string | undefined>)[key] = undefined
      }
      newFilters.page = undefined
      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters, updateURL]
  )

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      const newFilters = { ...activeFilters, sort: sort === 'newest' ? undefined : sort }
      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters, updateURL]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const newFilters = { ...activeFilters, page: page === 1 ? undefined : String(page) }
      setActiveFilters(newFilters)
      updateURL(newFilters)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [activeFilters, updateURL]
  )

  const activeFilterCount = Object.entries(activeFilters).filter(
    ([k, v]) => v && k !== 'sort' && k !== 'page'
  ).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
        <p className="mt-1 text-gray-600">
          Browse our complete selection of commercial vehicles
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 filter-sidebar">
            <FilterSidebar
              filters={availableFilters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4 flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile Sort */}
            <select
              value={activeFilters.sort || 'newest'}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="flex-1 px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700"
            >
              <option value="newest">Most Recently Added</option>
              <option value="price-low">Lowest Price First</option>
              <option value="price-high">Highest Price First</option>
            </select>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            filters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />

          {/* Sort & Count Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {vehicles.length}
              </span>{' '}
              of <span className="font-semibold text-gray-900">{total}</span> vehicles
            </p>
            <select
              value={activeFilters.sort || 'newest'}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Most Recently Added</option>
              <option value="price-low">Lowest Price First</option>
              <option value="price-high">Highest Price First</option>
            </select>
          </div>

          {/* Mobile result count */}
          <div className="lg:hidden mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{vehicles.length}</span> of{' '}
              <span className="font-semibold">{total}</span> vehicles
            </p>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              <Pagination
                currentPage={parseInt(activeFilters.page || '1')}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No vehicles match your search
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
              <button onClick={handleClearAll} className="btn-primary">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <FilterSidebar
          filters={availableFilters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          isMobile
          onClose={() => setMobileFiltersOpen(false)}
        />
      )}
    </div>
  )
}

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      }
    >
      <InventoryPageContent />
    </Suspense>
  )
}
