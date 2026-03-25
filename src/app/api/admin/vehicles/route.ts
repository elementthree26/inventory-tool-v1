import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateSlug(year: number, make: string, model: string, vehicleType: string, stockNumber: string): string {
  return `${year}-${make}-${model}-${vehicleType}-${stockNumber}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Admin vehicles error:', error)
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    const errors: string[] = []
    if (!body.vehicleType) errors.push('Vehicle Type is required')
    if (!body.stockNumber) errors.push('Stock Number is required')
    if (!body.year || !/^\d{4}$/.test(String(body.year))) errors.push('Year must be a 4-digit number')
    if (body.year) {
      const y = parseInt(body.year)
      if (y < 1990 || y > new Date().getFullYear() + 2) errors.push(`Year must be between 1990 and ${new Date().getFullYear() + 2}`)
    }
    if (!body.make) errors.push('Make is required')
    if (!body.model) errors.push('Model is required')
    if (!body.vin) errors.push('VIN is required')
    if (!body.condition) errors.push('Condition is required')
    if (!body.cdlRequired) errors.push('CDL Required is required')
    if (!body.wheelchairAccessible) errors.push('Wheelchair Accessible is required')
    if (!body.fuelType) errors.push('Fuel Type is required')
    if (body.price && isNaN(parseFloat(body.price))) errors.push('Price must be a valid number')
    if (body.condition === 'Pre-Owned' && !body.mileage) errors.push('Mileage is required for Pre-Owned vehicles')
    if (body.matterportUrl && !/^https?:\/\//.test(body.matterportUrl)) errors.push('Matterport URL must start with http:// or https://')

    // Check unique stock number
    const existing = await prisma.vehicle.findUnique({ where: { stockNumber: body.stockNumber } })
    if (existing) errors.push('Stock Number already exists')

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Warnings
    const warnings: string[] = []
    if (!body.images || (Array.isArray(body.images) && body.images.length === 0)) {
      warnings.push('No gallery images uploaded — unit will use placeholder')
    }
    if (!body.description) warnings.push('No description provided — recommended for better SEO')
    if (body.wheelchairAccessible === 'Yes' && !body.wheelchairPositions) {
      warnings.push('Wheelchair Accessible is Yes but no wheelchair positions specified')
    }

    const slug = generateSlug(body.year, body.make, body.model, body.vehicleType, body.stockNumber)

    const vehicle = await prisma.vehicle.create({
      data: {
        year: parseInt(body.year),
        make: body.make,
        model: body.model,
        vehicleType: body.vehicleType,
        condition: body.condition,
        stockNumber: body.stockNumber,
        vin: body.vin,
        price: body.price ? parseFloat(body.price) : null,
        mileage: body.mileage ? parseInt(body.mileage) : null,
        description: body.description || null,
        cdlRequired: body.cdlRequired,
        maxCapacity: parseInt(body.maxCapacity) || 0,
        standardPassengers: parseInt(body.standardPassengers) || 0,
        crew: body.crew || null,
        wheelchairAccessible: body.wheelchairAccessible,
        liftManufacturer: body.liftManufacturer || null,
        wheelchairPositions: body.wheelchairPositions ? parseInt(body.wheelchairPositions) : null,
        wheelbase: body.wheelbase || null,
        suspensionType: body.suspensionType || null,
        engineMake: body.engineMake || null,
        engineModel: body.engineModel || null,
        fuelType: body.fuelType,
        fuelTankCapacity: body.fuelTankCapacity || null,
        ac: body.ac || null,
        luggage: body.luggage || null,
        brake: body.brake || null,
        transmissionMfr: body.transmissionMfr || null,
        transmissionModel: body.transmissionModel || null,
        exteriorColor: body.exteriorColor || null,
        interiorColor: body.interiorColor || null,
        images: body.images ? JSON.stringify(body.images) : null,
        floorPlan: body.floorPlan || null,
        matterportUrl: body.matterportUrl || null,
        featuredImage: body.featuredImage || null,
        status: body.status || 'Draft',
        visibility: body.visibility || 'Public',
        includeOnWebsite: body.includeOnWebsite !== false,
        locations: body.locations ? JSON.stringify(body.locations) : null,
        industries: body.industries ? JSON.stringify(body.industries) : null,
        contactFormEmbed: body.contactFormEmbed || null,
        slug,
      },
    })

    return NextResponse.json({ vehicle, warnings, previewUrl: `/inventory/${slug}` }, { status: 201 })
  } catch (error) {
    console.error('Create vehicle error:', error)
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
  }
}
