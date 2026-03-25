'use client'

import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { label: 'All Inventory', href: '/inventory' },
  {
    label: 'By Condition',
    children: [
      { label: 'New Vehicles', href: '/inventory?condition=new' },
      { label: 'Pre-Owned Vehicles', href: '/inventory?condition=pre-owned' },
    ],
  },
  {
    label: 'By Type',
    children: [
      { label: 'School Buses', href: '/inventory?type=school-bus' },
      { label: 'Shuttle Buses', href: '/inventory?type=shuttle-bus' },
      { label: 'Vans', href: '/inventory?type=van' },
      { label: 'Coaches', href: '/inventory?type=coach' },
    ],
  },
  {
    label: 'By Capacity',
    children: [
      { label: 'Small (Under 15)', href: '/inventory?capacity=small' },
      { label: 'Medium (16-28)', href: '/inventory?capacity=medium' },
      { label: 'Large (29+)', href: '/inventory?capacity=large' },
    ],
  },
  { label: 'Wheelchair Accessible', href: '/inventory?wheelchair=yes' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Inventory</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50 flex items-center gap-1">
                    {item.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/admin/inventory"
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="py-1">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-6 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/admin/inventory"
              className="block mx-3 mt-3 px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
