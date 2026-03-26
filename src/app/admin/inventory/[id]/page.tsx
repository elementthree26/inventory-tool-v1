'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import VehicleForm from '@/components/admin/VehicleForm'

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [vehicle, setVehicle] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrors([data.error])
        } else {
          // Parse JSON fields for the form
          setVehicle({
            ...data,
            images: data.images ? JSON.parse(data.images) : [],
            locations: data.locations ? JSON.parse(data.locations) : [],
            industries: data.industries ? JSON.parse(data.industries) : [],
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setErrors(['Failed to load vehicle'])
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true)
    setErrors([])

    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (!res.ok) {
        setErrors(result.errors || ['Failed to update vehicle'])
        setSaving(false)
        return
      }

      setMessage('Vehicle updated successfully!')
      setSaving(false)

      if (result.previewUrl) {
        setMessage(`Vehicle updated! Preview: ${result.previewUrl}`)
      }
    } catch {
      setErrors(['Failed to update vehicle'])
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/inventory" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
            &larr; Back to Inventory
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Vehicle {vehicle ? `#${(vehicle as Record<string, unknown>).stockNumber}` : ''}
          </h1>
        </div>
        {vehicle && (
          <Link
            href={`/inventory/${(vehicle as Record<string, unknown>).slug}`}
            className="text-sm text-blue-600 hover:text-blue-700"
            target="_blank"
          >
            View on Front End &rarr;
          </Link>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {message && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          {message}
        </div>
      )}

      {vehicle && (
        <VehicleForm
          initialData={vehicle as Record<string, unknown>}
          onSubmit={handleSubmit}
          saving={saving}
          isEdit
        />
      )}
    </div>
  )
}
