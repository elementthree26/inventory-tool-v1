'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface AdminVehicle {
  id: number
  year: number
  make: string
  model: string
  vehicleType: string
  condition: string
  stockNumber: string
  vin: string
  price: number | null
  status: string
  updatedAt: string
  slug: string
  locations: string | null
}

export default function AdminInventoryPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCondition, setFilterCondition] = useState('')
  const [sortField, setSortField] = useState<string>('updatedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [bulkAction, setBulkAction] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/vehicles')
      const data = await res.json()
      setVehicles(data)
    } catch {
      setMessage({ type: 'error', text: 'Failed to fetch vehicles' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Filter & sort
  const filtered = vehicles
    .filter((v) => {
      if (search) {
        const q = search.toLowerCase()
        const title = `${v.year} ${v.make} ${v.model}`.toLowerCase()
        if (!title.includes(q) && !v.stockNumber.includes(q) && !v.vin.toLowerCase().includes(q)) {
          return false
        }
      }
      if (filterStatus && v.status !== filterStatus) return false
      if (filterType && v.vehicleType !== filterType) return false
      if (filterCondition && v.condition !== filterCondition) return false
      return true
    })
    .sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField]
      const bVal = (b as unknown as Record<string, unknown>)[sortField]
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      const comparison = aVal < bVal ? -1 : 1
      return sortDir === 'asc' ? comparison : -comparison
    })

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((v) => v.id)))
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selected.size === 0) return

    if (bulkAction === 'delete' && !confirm(`Delete ${selected.size} vehicles? This cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/vehicles/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: bulkAction, ids: Array.from(selected) }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setSelected(new Set())
        setBulkAction('')
        fetchVehicles()
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Bulk action failed' })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this vehicle?')) return
    try {
      await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
      setMessage({ type: 'success', text: 'Vehicle deleted' })
      fetchVehicles()
    } catch {
      setMessage({ type: 'error', text: 'Delete failed' })
    }
  }

  const handleQuickEdit = async (id: number, field: string, value: string | number | null) => {
    try {
      await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      fetchVehicles()
    } catch {
      setMessage({ type: 'error', text: 'Update failed' })
    }
  }

  const vehicleTypes = Array.from(new Set(vehicles.map((v) => v.vehicleType))).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-600 mt-1">{vehicles.length} total vehicles</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory/import"
            className="btn-secondary text-sm py-2 px-4"
          >
            Import CSV
          </Link>
          <a
            href="/api/inventory/export"
            className="btn-secondary text-sm py-2 px-4"
          >
            Export CSV
          </a>
          <Link
            href="/admin/inventory/new"
            className="btn-primary text-sm py-2 px-4"
          >
            + Add Vehicle
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search title, stock #, or VIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Pending Review">Pending Review</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Types</option>
          {vehicleTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={filterCondition}
          onChange={(e) => setFilterCondition(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Pre-Owned">Pre-Owned</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center gap-3">
          <span className="text-sm font-medium text-blue-800">{selected.size} selected</span>
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="px-3 py-1.5 border border-blue-300 rounded-md text-sm bg-white"
          >
            <option value="">Bulk Action...</option>
            <option value="publish">Publish</option>
            <option value="draft">Set as Draft</option>
            <option value="delete">Delete</option>
          </select>
          <button
            onClick={handleBulkAction}
            disabled={!bulkAction}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md disabled:opacity-50"
          >
            Apply
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                  onClick={() => toggleSort('year')}
                >
                  Vehicle {sortField === 'year' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Stock #</th>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                  onClick={() => toggleSort('condition')}
                >
                  Condition
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                  onClick={() => toggleSort('price')}
                >
                  Price {sortField === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:text-blue-600"
                  onClick={() => toggleSort('updatedAt')}
                >
                  Modified {sortField === 'updatedAt' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No vehicles found</td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(v.id)}
                        onChange={() => toggleSelect(v.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/inventory/${v.slug}`} className="text-blue-600 hover:underline font-medium">
                        {v.year} {v.make} {v.model}
                      </Link>
                      <div className="text-xs text-gray-500">{v.vehicleType}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{v.stockNumber}</td>
                    <td className="px-4 py-3">
                      <select
                        value={v.condition}
                        onChange={(e) => handleQuickEdit(v.id, 'condition', e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-200 rounded"
                      >
                        <option value="New">New</option>
                        <option value="Pre-Owned">Pre-Owned</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {v.price ? `$${v.price.toLocaleString()}` : (
                        <span className="text-gray-400 text-xs">No price</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={v.status}
                        onChange={(e) => handleQuickEdit(v.id, 'status', e.target.value)}
                        className={`text-xs px-2 py-1 border rounded font-medium ${
                          v.status === 'Published'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : v.status === 'Draft'
                              ? 'bg-gray-50 text-gray-600 border-gray-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Pending Review">Pending Review</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(v.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/inventory/${v.id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
