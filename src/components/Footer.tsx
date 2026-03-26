import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Inventory Tool</h3>
            <p className="text-sm">
              Searchable, filterable vehicle and product inventory for OEMs, dealers, and multi-location businesses.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Browse By Type</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inventory?type=school-bus" className="hover:text-white">School Buses</Link></li>
              <li><Link href="/inventory?type=shuttle-bus" className="hover:text-white">Shuttle Buses</Link></li>
              <li><Link href="/inventory?type=van" className="hover:text-white">Vans</Link></li>
              <li><Link href="/inventory?type=coach" className="hover:text-white">Coaches</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Browse By Condition</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inventory?condition=new" className="hover:text-white">New Vehicles</Link></li>
              <li><Link href="/inventory?condition=pre-owned" className="hover:text-white">Pre-Owned Vehicles</Link></li>
              <li><Link href="/inventory?wheelchair=yes" className="hover:text-white">Wheelchair Accessible</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inventory" className="hover:text-white">All Inventory</Link></li>
              <li><Link href="/admin/inventory" className="hover:text-white">Admin Panel</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>Prepared by Element Three | Inventory Tool v1.0</p>
        </div>
      </div>
    </footer>
  )
}
