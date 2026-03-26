'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import VehicleForm from '@/components/admin/VehicleForm'

export default function NewVehiclePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true)
    setErrors([])
    setWarnings([])

    try {
      const res = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (!res.ok) {
        setErrors(result.errors || ['Failed to create vehicle'])
        setSaving(false)
        return
      }

      if (result.warnings && result.warnings.length > 0) {
        setWarnings(result.warnings)
      }

      router.push('/admin/inventory')
    } catch {
      setErrors(['Failed to create vehicle'])
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/inventory" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            &larr; Back to Inventory
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Warnings:</h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      <VehicleForm onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}
