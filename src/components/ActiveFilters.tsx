'use client'

import type { FilterState } from '@/types/inventory'

interface ActiveFiltersProps {
  filters: FilterState
  onRemove: (key: string, value?: string) => void
  onClearAll: () => void
}

function getFilterLabel(key: string, value: string): string[] {
  const labels: string[] = []

  switch (key) {
    case 'condition':
      labels.push(value === 'new' ? 'New' : 'Pre-Owned')
      break
    case 'type':
      value.split(',').forEach((t) => {
        const map: Record<string, string> = {
          'school-bus': 'School Bus',
          'shuttle-bus': 'Shuttle Bus',
          van: 'Van',
          coach: 'Coach',
        }
        labels.push(map[t] || t)
      })
      break
    case 'wheelchair':
      labels.push(`Wheelchair: ${value === 'yes' ? 'Yes' : 'No'}`)
      break
    case 'capacity':
      value.split(',').forEach((c) => {
        const map: Record<string, string> = {
          small: 'Small (<15)',
          medium: 'Medium (16-28)',
          large: 'Large (29+)',
        }
        labels.push(map[c] || c)
      })
      break
    case 'make':
      value.split(',').forEach((m) => labels.push(m))
      break
    case 'cdl':
      value.split(',').forEach((c) => {
        labels.push(c === 'required' ? 'CDL Required' : 'No CDL')
      })
      break
    case 'fuel':
      value.split(',').forEach((f) => {
        labels.push(f.charAt(0).toUpperCase() + f.slice(1))
      })
      break
    case 'location':
      labels.push(value)
      break
    case 'industry':
      labels.push(value)
      break
    case 'search':
      labels.push(`Stock #: ${value}`)
      break
    case 'yearMin':
      labels.push(`From: ${value}`)
      break
    case 'yearMax':
      labels.push(`To: ${value}`)
      break
    default:
      labels.push(value)
  }

  return labels
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  const activeEntries = Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== '' && v !== 'newest'
  )

  // Exclude sort and page from display
  const displayEntries = activeEntries.filter(
    ([k]) => k !== 'sort' && k !== 'page'
  )

  if (displayEntries.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {displayEntries.map(([key, value]) =>
        getFilterLabel(key, value!).map((label) => (
          <span key={`${key}-${label}`} className="chip">
            {label}
            <button
              onClick={() => {
                // For comma-separated values, remove just this one
                if (['type', 'capacity', 'make', 'cdl', 'fuel'].includes(key)) {
                  const current = (value || '').split(',')
                  const slugLabel = key === 'type'
                    ? label.toLowerCase().replace(/\s+/g, '-')
                    : key === 'cdl'
                      ? (label === 'CDL Required' ? 'required' : 'not-required')
                      : key === 'fuel'
                        ? label.toLowerCase()
                        : label
                  const filtered = current.filter((v: string) => v !== slugLabel)
                  onRemove(key, filtered.length > 0 ? filtered.join(',') : undefined)
                } else {
                  onRemove(key)
                }
              }}
              className="chip-dismiss"
              aria-label={`Remove ${label} filter`}
            >
              &times;
            </button>
          </span>
        ))
      )}
      <button
        onClick={onClearAll}
        className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
      >
        Clear All
      </button>
    </div>
  )
}
