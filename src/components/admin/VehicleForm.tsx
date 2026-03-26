'use client'

import { useState } from 'react'

interface VehicleFormProps {
  initialData?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  saving: boolean
  isEdit?: boolean
}

const VEHICLE_TYPES = ['School Bus', 'Shuttle Bus', 'Van', 'Coach']
const CONDITIONS = ['New', 'Pre-Owned']
const FUEL_TYPES = ['Diesel', 'Electric', 'Gas']
const CDL_OPTIONS = ['Required', 'Not Required']
const WHEELCHAIR_OPTIONS = ['Yes', 'No']
const CREW_OPTIONS = ['', 'Driver', 'Driver + Co-Pilot']
const STATUS_OPTIONS = ['Draft', 'Pending Review', 'Published']
const VISIBILITY_OPTIONS = ['Public', 'Private']

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  )
}

function FormField({
  label,
  required,
  children,
  note,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  note?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  )
}

export default function VehicleForm({ initialData, onSubmit, saving, isEdit }: VehicleFormProps) {
  const [form, setForm] = useState<Record<string, unknown>>({
    year: initialData?.year || new Date().getFullYear(),
    make: initialData?.make || '',
    model: initialData?.model || '',
    vehicleType: initialData?.vehicleType || '',
    condition: initialData?.condition || 'New',
    stockNumber: initialData?.stockNumber || '',
    vin: initialData?.vin || '',
    price: initialData?.price || '',
    mileage: initialData?.mileage || '',
    description: initialData?.description || '',
    cdlRequired: initialData?.cdlRequired || 'Not Required',
    maxCapacity: initialData?.maxCapacity || '',
    standardPassengers: initialData?.standardPassengers || '',
    crew: initialData?.crew || '',
    wheelchairAccessible: initialData?.wheelchairAccessible || 'No',
    liftManufacturer: initialData?.liftManufacturer || '',
    wheelchairPositions: initialData?.wheelchairPositions || '',
    wheelbase: initialData?.wheelbase || '',
    suspensionType: initialData?.suspensionType || '',
    engineMake: initialData?.engineMake || '',
    engineModel: initialData?.engineModel || '',
    fuelType: initialData?.fuelType || 'Diesel',
    fuelTankCapacity: initialData?.fuelTankCapacity || '',
    ac: initialData?.ac || '',
    luggage: initialData?.luggage || '',
    brake: initialData?.brake || '',
    transmissionMfr: initialData?.transmissionMfr || '',
    transmissionModel: initialData?.transmissionModel || '',
    exteriorColor: initialData?.exteriorColor || '',
    interiorColor: initialData?.interiorColor || '',
    floorPlan: initialData?.floorPlan || '',
    matterportUrl: initialData?.matterportUrl || '',
    featuredImage: initialData?.featuredImage || '',
    status: initialData?.status || 'Draft',
    visibility: initialData?.visibility || 'Public',
    includeOnWebsite: initialData?.includeOnWebsite !== false,
    locations: initialData?.locations || [],
    industries: initialData?.industries || [],
    images: initialData?.images || [],
    contactFormEmbed: initialData?.contactFormEmbed || '',
  })

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500'
  const selectClass = inputClass

  return (
    <form onSubmit={handleSubmit}>
      {/* Basic Information */}
      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Year" required>
            <input
              type="number"
              value={form.year as number}
              onChange={(e) => handleChange('year', e.target.value)}
              min={1990}
              max={new Date().getFullYear() + 2}
              className={inputClass}
            />
          </FormField>

          <FormField label="Make" required>
            <input
              type="text"
              value={form.make as string}
              onChange={(e) => handleChange('make', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Model / Series" required>
            <input
              type="text"
              value={form.model as string}
              onChange={(e) => handleChange('model', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Vehicle Type" required>
            <select
              value={form.vehicleType as string}
              onChange={(e) => handleChange('vehicleType', e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>

          <FormField label="Condition" required>
            <select
              value={form.condition as string}
              onChange={(e) => handleChange('condition', e.target.value)}
              className={selectClass}
            >
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label="Stock Number" required note="Must be unique">
            <input
              type="text"
              value={form.stockNumber as string}
              onChange={(e) => handleChange('stockNumber', e.target.value)}
              className={inputClass}
              disabled={isEdit}
            />
          </FormField>

          <FormField label="VIN" required>
            <input
              type="text"
              value={form.vin as string}
              onChange={(e) => handleChange('vin', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Price" note="Leave blank for 'Contact for Pricing'">
            <input
              type="number"
              value={form.price as string}
              onChange={(e) => handleChange('price', e.target.value)}
              step="0.01"
              min="0"
              className={inputClass}
              placeholder="e.g. 89500"
            />
          </FormField>

          {form.condition === 'Pre-Owned' && (
            <FormField label="Mileage" required>
              <input
                type="number"
                value={form.mileage as string}
                onChange={(e) => handleChange('mileage', e.target.value)}
                className={inputClass}
              />
            </FormField>
          )}
        </div>

        <div className="mt-4">
          <FormField label="Description">
            <textarea
              value={form.description as string}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Vehicle overview..."
            />
          </FormField>
        </div>
      </FormSection>

      {/* Specs */}
      <FormSection title="Specifications">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Fuel Type" required>
            <select
              value={form.fuelType as string}
              onChange={(e) => handleChange('fuelType', e.target.value)}
              className={selectClass}
            >
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </FormField>

          <FormField label="CDL Required" required>
            <select
              value={form.cdlRequired as string}
              onChange={(e) => handleChange('cdlRequired', e.target.value)}
              className={selectClass}
            >
              {CDL_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label="Max Capacity" required note="Total max occupants">
            <input
              type="number"
              value={form.maxCapacity as string}
              onChange={(e) => handleChange('maxCapacity', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Standard Passengers" required>
            <input
              type="number"
              value={form.standardPassengers as string}
              onChange={(e) => handleChange('standardPassengers', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Crew">
            <select
              value={form.crew as string}
              onChange={(e) => handleChange('crew', e.target.value)}
              className={selectClass}
            >
              {CREW_OPTIONS.map((c) => <option key={c} value={c}>{c || 'None'}</option>)}
            </select>
          </FormField>

          <FormField label="Wheelchair Accessible" required>
            <select
              value={form.wheelchairAccessible as string}
              onChange={(e) => handleChange('wheelchairAccessible', e.target.value)}
              className={selectClass}
            >
              {WHEELCHAIR_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </FormField>

          {form.wheelchairAccessible === 'Yes' && (
            <>
              <FormField label="Wheelchair Positions">
                <input
                  type="number"
                  value={form.wheelchairPositions as string}
                  onChange={(e) => handleChange('wheelchairPositions', e.target.value)}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Lift Manufacturer">
                <input
                  type="text"
                  value={form.liftManufacturer as string}
                  onChange={(e) => handleChange('liftManufacturer', e.target.value)}
                  className={inputClass}
                />
              </FormField>
            </>
          )}

          <FormField label="Engine Make">
            <input
              type="text"
              value={form.engineMake as string}
              onChange={(e) => handleChange('engineMake', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Engine Model">
            <input
              type="text"
              value={form.engineModel as string}
              onChange={(e) => handleChange('engineModel', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Fuel Tank Capacity">
            <input
              type="text"
              value={form.fuelTankCapacity as string}
              onChange={(e) => handleChange('fuelTankCapacity', e.target.value)}
              className={inputClass}
              placeholder="e.g. 55 gal"
            />
          </FormField>

          <FormField label="Brake">
            <input
              type="text"
              value={form.brake as string}
              onChange={(e) => handleChange('brake', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Transmission Manufacturer">
            <input
              type="text"
              value={form.transmissionMfr as string}
              onChange={(e) => handleChange('transmissionMfr', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Transmission Model">
            <input
              type="text"
              value={form.transmissionModel as string}
              onChange={(e) => handleChange('transmissionModel', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Wheelbase">
            <input
              type="text"
              value={form.wheelbase as string}
              onChange={(e) => handleChange('wheelbase', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Suspension Type">
            <input
              type="text"
              value={form.suspensionType as string}
              onChange={(e) => handleChange('suspensionType', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="A/C" note="BTU value">
            <input
              type="text"
              value={form.ac as string}
              onChange={(e) => handleChange('ac', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Luggage">
            <input
              type="text"
              value={form.luggage as string}
              onChange={(e) => handleChange('luggage', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Exterior Color">
            <input
              type="text"
              value={form.exteriorColor as string}
              onChange={(e) => handleChange('exteriorColor', e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Interior Color">
            <input
              type="text"
              value={form.interiorColor as string}
              onChange={(e) => handleChange('interiorColor', e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>
      </FormSection>

      {/* Media */}
      <FormSection title="Media">
        <div className="space-y-4">
          <FormField label="Gallery Image URLs" note="Enter image URLs, one per line">
            <textarea
              value={(form.images as string[]).join('\n')}
              onChange={(e) =>
                handleChange('images', e.target.value.split('\n').filter((url) => url.trim()))
              }
              rows={4}
              className={inputClass}
              placeholder="/images/vehicle-1.jpg&#10;/images/vehicle-2.jpg"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Featured Image URL" note="Override for listing card thumbnail">
              <input
                type="text"
                value={form.featuredImage as string}
                onChange={(e) => handleChange('featuredImage', e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Floor Plan URL" note="PDF or image">
              <input
                type="text"
                value={form.floorPlan as string}
                onChange={(e) => handleChange('floorPlan', e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Matterport URL" note="Must start with http:// or https://">
              <input
                type="url"
                value={form.matterportUrl as string}
                onChange={(e) => handleChange('matterportUrl', e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Contact Form Embed Code" note="HubSpot form embed">
              <input
                type="text"
                value={form.contactFormEmbed as string}
                onChange={(e) => handleChange('contactFormEmbed', e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>
        </div>
      </FormSection>

      {/* Publishing Controls */}
      <FormSection title="Publishing">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Status" required>
            <select
              value={form.status as string}
              onChange={(e) => handleChange('status', e.target.value)}
              className={selectClass}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Visibility">
            <select
              value={form.visibility as string}
              onChange={(e) => handleChange('visibility', e.target.value)}
              className={selectClass}
            >
              {VISIBILITY_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </FormField>

          <FormField label="Include on Website">
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.includeOnWebsite as boolean}
                onChange={(e) => handleChange('includeOnWebsite', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">Show on front-end</span>
            </label>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <FormField label="Locations" note="Comma-separated">
            <input
              type="text"
              value={(form.locations as string[]).join(', ')}
              onChange={(e) =>
                handleChange('locations', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
              }
              className={inputClass}
              placeholder="Indianapolis, IN, Chicago, IL"
            />
          </FormField>

          <FormField label="Industries" note="Comma-separated">
            <input
              type="text"
              value={(form.industries as string[]).join(', ')}
              onChange={(e) =>
                handleChange('industries', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
              }
              className={inputClass}
              placeholder="Senior Living, Childcare"
            />
          </FormField>
        </div>
      </FormSection>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <a href="/admin/inventory" className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900">
          Cancel
        </a>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Create Vehicle'}
        </button>
      </div>
    </form>
  )
}
