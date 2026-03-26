'use client'

import { useState } from 'react'
import type { Vehicle } from '@/types/inventory'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

const INDUSTRIES = [
  'Senior Living', 'Athletics', 'Hospitality', 'Prison Transport', 'Childcare',
  'Churches', 'Tour & Charter', 'School District', 'Corporate', 'Government',
  'Healthcare', 'Other',
]

interface QuoteFormProps {
  vehicle: Vehicle
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  city: string
  state: string
  industry: string
  financing: string
  comments: string
  consent: boolean
}

export default function QuoteForm({ vehicle }: QuoteFormProps) {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    industry: '',
    financing: '',
    comments: '',
    consent: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s()+-]{10,}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.state) newErrors.state = 'State is required'
    if (!form.industry) newErrors.industry = 'Industry is required'
    if (!form.financing) newErrors.financing = 'Please select an option'
    if (!form.consent) newErrors.consent = 'You must agree to the privacy policy'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // In production, this would submit to HubSpot or CRM
      console.log('Form submitted:', {
        ...form,
        // Hidden fields
        vehicleYear: vehicle.year,
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        stockNumber: vehicle.stockNumber,
        vehicleUrl: typeof window !== 'undefined' ? window.location.href : '',
      })
      setSubmitted(true)
    }
  }

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Your quote request has been submitted. Our team will review your inquiry and get back to you
          within 1 business day. Check your email for a confirmation.
        </p>
      </div>
    )
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.vehicleType}`

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Hidden fields */}
      <input type="hidden" name="vehicleYear" value={vehicle.year} />
      <input type="hidden" name="vehicleMake" value={vehicle.make} />
      <input type="hidden" name="vehicleModel" value={vehicle.model} />
      <input type="hidden" name="stockNumber" value={vehicle.stockNumber} />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          Requesting a quote for: <strong>{title}</strong> (Stock #{vehicle.stockNumber})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 555-5555"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Company */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company / Organization Name
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={form.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select State</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            value={form.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.industry ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry}</p>}
        </div>

        {/* Financing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interested in financing/leasing? <span className="text-red-500">*</span>
          </label>
          <select
            value={form.financing}
            onChange={(e) => handleChange('financing', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.financing ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.financing && <p className="mt-1 text-xs text-red-600">{errors.financing}</p>}
        </div>

        {/* Comments */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments (optional)
          </label>
          <textarea
            value={form.comments}
            onChange={(e) => handleChange('comments', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us more about your needs..."
          />
        </div>
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => handleChange('consent', e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            I agree to the processing of my personal data in accordance with the{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-xs text-red-600">{errors.consent}</p>}
      </div>

      {/* Submit */}
      <button type="submit" className="w-full btn-primary text-lg py-3.5">
        Request a Quote
      </button>
    </form>
  )
}
