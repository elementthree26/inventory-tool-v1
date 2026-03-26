import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Find the Right Commercial Vehicle for Your Fleet
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Browse our complete inventory of school buses, shuttle buses, vans, and coaches.
              Filter by type, capacity, accessibility, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/inventory" className="btn-primary text-center text-lg px-8 py-4">
                Browse Inventory
              </Link>
              <Link href="/inventory?condition=new" className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold border-2 border-white hover:bg-white/10 transition-colors text-center text-lg">
                New Vehicles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Vehicle Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { type: 'School Buses', slug: 'school-bus', icon: '🚌', desc: 'Type A, B, C & D school buses for districts of all sizes' },
            { type: 'Shuttle Buses', slug: 'shuttle-bus', icon: '🚐', desc: 'Mid-size shuttles for hotels, campuses & senior living' },
            { type: 'Vans', slug: 'van', icon: '🚙', desc: 'Passenger & ADA vans for small group transport' },
            { type: 'Coaches', slug: 'coach', icon: '🚍', desc: 'Full-size coaches for charter, tour & athletics' },
          ].map((item) => (
            <Link
              key={item.slug}
              href={`/inventory?type=${item.slug}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                {item.type}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Filters */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Filters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'New Vehicles', href: '/inventory?condition=new' },
              { label: 'Pre-Owned', href: '/inventory?condition=pre-owned' },
              { label: 'Wheelchair Accessible', href: '/inventory?wheelchair=yes' },
              { label: 'Small (Under 15)', href: '/inventory?capacity=small' },
              { label: 'Medium (16-28)', href: '/inventory?capacity=medium' },
              { label: 'Large (29+)', href: '/inventory?capacity=large' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-center px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
