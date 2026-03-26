import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function generateSlug(year: number, make: string, model: string, vehicleType: string, stockNumber: string): string {
  return `${year}-${make}-${model}-${vehicleType}-${stockNumber}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(params.id) },
    })
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Get vehicle error:', error)
    return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const id = parseInt(params.id)

    const existing = await prisma.vehicle.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Validation
    const errors: string[] = []
    if (body.stockNumber && body.stockNumber !== existing.stockNumber) {
      const dup = await prisma.vehicle.findUnique({ where: { stockNumber: body.stockNumber } })
      if (dup) errors.push('Stock Number already exists')
    }
    if (body.price && isNaN(parseFloat(body.price))) errors.push('Price must be a valid number')
    if (body.matterportUrl && !/^https?:\/\//.test(body.matterportUrl)) errors.push('Matterport URL must start with http:// or https://')

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const year = body.year ? parseInt(body.year) : existing.year
    const make = body.make || existing.make
    const model = body.model || existing.model
    const vehicleType = body.vehicleType || existing.vehicleType
    const stockNumber = body.stockNumber || existing.stockNumber
    const slug = generateSlug(year, make, model, vehicleType, stockNumber)

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...(body.year !== undefined && { year: parseInt(body.year) }),
        ...(body.make !== undefined && { make: body.make }),
        ...(body.model !== undefined && { model: body.model }),
        ...(body.vehicleType !== undefined && { vehicleType: body.vehicleType }),
        ...(body.condition !== undefined && { condition: body.condition }),
        ...(body.stockNumber !== undefined && { stockNumber: body.stockNumber }),
        ...(body.vin !== undefined && { vin: body.vin }),
        ...(body.price !== undefined && { price: body.price ? parseFloat(body.price) : null }),
        ...(body.mileage !== undefined && { mileage: body.mileage ? parseInt(body.mileage) : null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.cdlRequired !== undefined && { cdlRequired: body.cdlRequired }),
        ...(body.maxCapacity !== undefined && { maxCapacity: parseInt(body.maxCapacity) }),
        ...(body.standardPassengers !== undefined && { standardPassengers: parseInt(body.standardPassengers) }),
        ...(body.crew !== undefined && { crew: body.crew || null }),
        ...(body.wheelchairAccessible !== undefined && { wheelchairAccessible: body.wheelchairAccessible }),
        ...(body.liftManufacturer !== undefined && { liftManufacturer: body.liftManufacturer || null }),
        ...(body.wheelchairPositions !== undefined && { wheelchairPositions: body.wheelchairPositions ? parseInt(body.wheelchairPositions) : null }),
        ...(body.fuelType !== undefined && { fuelType: body.fuelType }),
        ...(body.fuelTankCapacity !== undefined && { fuelTankCapacity: body.fuelTankCapacity || null }),
        ...(body.ac !== undefined && { ac: body.ac || null }),
        ...(body.exteriorColor !== undefined && { exteriorColor: body.exteriorColor || null }),
        ...(body.interiorColor !== undefined && { interiorColor: body.interiorColor || null }),
        ...(body.brake !== undefined && { brake: body.brake || null }),
        ...(body.transmissionMfr !== undefined && { transmissionMfr: body.transmissionMfr || null }),
        ...(body.transmissionModel !== undefined && { transmissionModel: body.transmissionModel || null }),
        ...(body.engineMake !== undefined && { engineMake: body.engineMake || null }),
        ...(body.engineModel !== undefined && { engineModel: body.engineModel || null }),
        ...(body.wheelbase !== undefined && { wheelbase: body.wheelbase || null }),
        ...(body.suspensionType !== undefined && { suspensionType: body.suspensionType || null }),
        ...(body.luggage !== undefined && { luggage: body.luggage || null }),
        ...(body.images !== undefined && { images: body.images ? JSON.stringify(body.images) : null }),
        ...(body.floorPlan !== undefined && { floorPlan: body.floorPlan || null }),
        ...(body.matterportUrl !== undefined && { matterportUrl: body.matterportUrl || null }),
        ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage || null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.visibility !== undefined && { visibility: body.visibility }),
        ...(body.includeOnWebsite !== undefined && { includeOnWebsite: body.includeOnWebsite }),
        ...(body.locations !== undefined && { locations: body.locations ? JSON.stringify(body.locations) : null }),
        ...(body.industries !== undefined && { industries: body.industries ? JSON.stringify(body.industries) : null }),
        ...(body.contactFormEmbed !== undefined && { contactFormEmbed: body.contactFormEmbed || null }),
        slug,
      },
    })

    return NextResponse.json({ vehicle, previewUrl: `/inventory/${slug}` })
  } catch (error) {
    console.error('Update vehicle error:', error)
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.vehicle.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete vehicle error:', error)
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 })
  }
}
