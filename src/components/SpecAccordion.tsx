'use client'

import { useState } from 'react'

interface SpecItem {
  label: string
  value: string | number | null | undefined
}

interface SpecAccordionProps {
  title: string
  specs: SpecItem[]
  defaultOpen?: boolean
}

export default function SpecAccordion({ title, specs, defaultOpen = false }: SpecAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  // Filter out empty specs
  const visibleSpecs = specs.filter((s) => s.value !== null && s.value !== undefined && s.value !== '')

  if (visibleSpecs.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-semibold text-gray-900">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="accordion-content"
        style={{ maxHeight: open ? `${visibleSpecs.length * 52 + 20}px` : '0px' }}
      >
        <div className="px-5 pb-4">
          <dl className="divide-y divide-gray-100">
            {visibleSpecs.map((spec) => (
              <div key={spec.label} className="flex justify-between py-2.5">
                <dt className="text-sm text-gray-600">{spec.label}</dt>
                <dd className="text-sm font-medium text-gray-900">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
