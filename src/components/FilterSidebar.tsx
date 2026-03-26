'use client'

import { useState } from 'react'
import type { AvailableFilters, FilterState } from '@/types/inventory'

interface FilterSidebarProps {
  filters: AvailableFilters
  activeFilters: FilterState
  onFilterChange: (key: string, value: string | undefined) => void
  onClearAll: () => void
  isMobile?: boolean
  onClose?: () => void
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function FilterSidebar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  isMobile,
  onClose,
}: FilterSidebarProps) {
  const hasActiveFilters = Object.values(activeFilters).some((v) => v !== undefined && v !== '')

  const handleCheckboxGroup = (key: string, value: string) => {
    const current = activeFilters[key as keyof FilterState] || ''
    const values = current ? current.split(',') : []
    const index = values.indexOf(value)

    if (index >= 0) {
      values.splice(index, 1)
    } else {
      values.push(value)
    }

    onFilterChange(key, values.length > 0 ? values.join(',') : undefined)
  }

  const isChecked = (key: string, value: string): boolean => {
    const current = activeFilters[key as keyof FilterState] || ''
    return current.split(',').includes(value)
  }

  return (
    <div className={isMobile ? 'filter-overlay p-4' : 'filter-sidebar'}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Search by Stock # */}
      <FilterSection title="Search by Stock #">
        <input
          type="text"
          placeholder="Enter stock number..."
          value={activeFilters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <div className="space-y-1">
          {['new', 'pre-owned'].map((val) => (
            <label key={val} className="filter-checkbox">
              <input
                type="radio"
                name="condition"
                checked={activeFilters.condition === val}
                onChange={() =>
                  onFilterChange('condition', activeFilters.condition === val ? undefined : val)
                }
              />
              <span>{val === 'new' ? 'New' : 'Pre-Owned'}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Maximum Seating Capacity */}
      <FilterSection title="Maximum Seating Capacity">
        <div className="space-y-1">
          {[
            { value: 'small', label: 'Small (Under 15 passengers)' },
            { value: 'medium', label: 'Medium (16-28 passengers)' },
            { value: 'large', label: 'Large (29+ passengers)' },
          ].map((opt) => (
            <label key={opt.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('capacity', opt.value)}
                onChange={() => handleCheckboxGroup('capacity', opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Wheelchair Accessible */}
      <FilterSection title="Wheelchair Accessible">
        <div className="space-y-1">
          {['yes', 'no'].map((val) => (
            <label key={val} className="filter-checkbox">
              <input
                type="radio"
                name="wheelchair"
                checked={activeFilters.wheelchair === val}
                onChange={() =>
                  onFilterChange('wheelchair', activeFilters.wheelchair === val ? undefined : val)
                }
              />
              <span>{val === 'yes' ? 'Yes' : 'No'}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Vehicle Type */}
      <FilterSection title="Vehicle Type">
        <div className="space-y-1">
          {filters.vehicleTypes.map((type) => {
            const slug = type.toLowerCase().replace(/\s+/g, '-')
            return (
              <label key={type} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={isChecked('type', slug)}
                  onChange={() => handleCheckboxGroup('type', slug)}
                />
                <span>{type}</span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Year Range */}
      {filters.yearMin < filters.yearMax && (
        <FilterSection title="Year Range">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{activeFilters.yearMin || filters.yearMin}</span>
              <span>-</span>
              <span>{activeFilters.yearMax || filters.yearMax}</span>
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Min Year</label>
              <input
                type="range"
                min={filters.yearMin}
                max={filters.yearMax}
                value={activeFilters.yearMin || filters.yearMin}
                onChange={(e) =>
                  onFilterChange(
                    'yearMin',
                    e.target.value === String(filters.yearMin) ? undefined : e.target.value
                  )
                }
              />
              <label className="block text-xs text-gray-500">Max Year</label>
              <input
                type="range"
                min={filters.yearMin}
                max={filters.yearMax}
                value={activeFilters.yearMax || filters.yearMax}
                onChange={(e) =>
                  onFilterChange(
                    'yearMax',
                    e.target.value === String(filters.yearMax) ? undefined : e.target.value
                  )
                }
              />
            </div>
          </div>
        </FilterSection>
      )}

      {/* Make */}
      <FilterSection title="Make">
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filters.makes.map((make) => (
            <label key={make} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('make', make)}
                onChange={() => handleCheckboxGroup('make', make)}
              />
              <span>{make}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* CDL Required */}
      <FilterSection title="CDL Required" defaultOpen={false}>
        <div className="space-y-1">
          {[
            { value: 'required', label: 'Required' },
            { value: 'not-required', label: 'Not Required' },
          ].map((opt) => (
            <label key={opt.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('cdl', opt.value)}
                onChange={() => handleCheckboxGroup('cdl', opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type" defaultOpen={false}>
        <div className="space-y-1">
          {filters.fuelTypes.map((fuel) => (
            <label key={fuel} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('fuel', fuel.toLowerCase())}
                onChange={() => handleCheckboxGroup('fuel', fuel.toLowerCase())}
              />
              <span>{fuel}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Location */}
      {filters.locations.length > 1 && (
        <FilterSection title="Location" defaultOpen={false}>
          <div className="space-y-1">
            {filters.locations.map((loc) => (
              <label key={loc} className="filter-checkbox">
                <input
                  type="radio"
                  name="location"
                  checked={activeFilters.location === loc}
                  onChange={() =>
                    onFilterChange('location', activeFilters.location === loc ? undefined : loc)
                  }
                />
                <span>{loc}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Industry */}
      {filters.industries.length > 0 && (
        <FilterSection title="Industry" defaultOpen={false}>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filters.industries.map((ind) => (
              <label key={ind} className="filter-checkbox">
                <input
                  type="radio"
                  name="industry"
                  checked={activeFilters.industry === ind}
                  onChange={() =>
                    onFilterChange('industry', activeFilters.industry === ind ? undefined : ind)
                  }
                />
                <span>{ind}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Clear All */}
      {hasActiveFilters && (
        <div className="pt-4">
          <button
            onClick={onClearAll}
            className="w-full text-center text-sm font-medium text-red-600 hover:text-red-700 py-2"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 mt-4">
          <button onClick={onClose} className="w-full btn-primary">
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
}
