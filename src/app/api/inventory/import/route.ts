import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateSlug(year: number, make: string, model: string, vehicleType: string, stockNumber: string): string {
  return `${year}-${make}-${model}-${vehicleType}-${stockNumber}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface CsvRow {
  year?: string
  make?: string
  model?: string
  vehicleType?: string
  condition?: string
  stockNumber?: string
  vin?: string
  price?: string
  mileage?: string
  description?: string
  cdlRequired?: string
  maxCapacity?: string
  standardPassengers?: string
  crew?: string
  wheelchairAccessible?: string
  liftManufacturer?: string
  wheelchairPositions?: string
  fuelType?: string
  fuelTankCapacity?: string
  ac?: string
  exteriorColor?: string
  interiorColor?: string
  brake?: string
  transmissionMfr?: string
  transmissionModel?: string
  engineMake?: string
  engineModel?: string
  wheelbase?: string
  suspensionType?: string
  luggage?: string
  locations?: string
  industries?: string
  status?: string
}

interface ImportError {
  row: number
  field: string
  message: string
}

function validateRow(row: CsvRow, index: number): ImportError[] {
  const errors: ImportError[] = []
  const rowNum = index + 2 // +2 for header row and 0-indexing

  if (!row.year || !/^\d{4}$/.test(row.year)) {
    errors.push({ row: rowNum, field: 'year', message: 'Year must be a 4-digit number' })
  } else {
    const year = parseInt(row.year)
    if (year < 1990 || year > new Date().getFullYear() + 2) {
      errors.push({ row: rowNum, field: 'year', message: `Year must be between 1990 and ${new Date().getFullYear() + 2}` })
    }
  }

  if (!row.make) errors.push({ row: rowNum, field: 'make', message: 'Make is required' })
  if (!row.model) errors.push({ row: rowNum, field: 'model', message: 'Model is required' })
  if (!row.vehicleType) errors.push({ row: rowNum, field: 'vehicleType', message: 'Vehicle Type is required' })
  if (!row.condition || !['New', 'Pre-Owned'].includes(row.condition)) {
    errors.push({ row: rowNum, field: 'condition', message: 'Condition must be "New" or "Pre-Owned"' })
  }
  if (!row.stockNumber) errors.push({ row: rowNum, field: 'stockNumber', message: 'Stock Number is required' })
  if (!row.vin) errors.push({ row: rowNum, field: 'vin', message: 'VIN is required' })
  if (!row.cdlRequired || !['Required', 'Not Required'].includes(row.cdlRequired)) {
    errors.push({ row: rowNum, field: 'cdlRequired', message: 'CDL Required must be "Required" or "Not Required"' })
  }
  if (!row.wheelchairAccessible || !['Yes', 'No'].includes(row.wheelchairAccessible)) {
    errors.push({ row: rowNum, field: 'wheelchairAccessible', message: 'Wheelchair Accessible must be "Yes" or "No"' })
  }
  if (!row.fuelType || !['Diesel', 'Electric', 'Gas'].includes(row.fuelType)) {
    errors.push({ row: rowNum, field: 'fuelType', message: 'Fuel Type must be "Diesel", "Electric", or "Gas"' })
  }
  if (!row.maxCapacity || isNaN(parseInt(row.maxCapacity))) {
    errors.push({ row: rowNum, field: 'maxCapacity', message: 'Max Capacity is required and must be a number' })
  }
  if (!row.standardPassengers || isNaN(parseInt(row.standardPassengers))) {
    errors.push({ row: rowNum, field: 'standardPassengers', message: 'Standard Passengers is required and must be a number' })
  }
  if (row.price && isNaN(parseFloat(row.price))) {
    errors.push({ row: rowNum, field: 'price', message: 'Price must be a valid number' })
  }
  if (row.condition === 'Pre-Owned' && !row.mileage) {
    errors.push({ row: rowNum, field: 'mileage', message: 'Mileage is required for Pre-Owned vehicles' })
  }

  return errors
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rows, mode = 'add' } = body as { rows: CsvRow[]; mode: 'add' | 'update' }

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }

    // Validate all rows
    const allErrors: ImportError[] = []
    for (let i = 0; i < rows.length; i++) {
      const errors = validateRow(rows[i], i)
      allErrors.push(...errors)
    }

    if (allErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: allErrors,
        summary: { toAdd: 0, toUpdate: 0, errors: allErrors.length },
      }, { status: 400 })
    }

    // Check for existing stock numbers
    const stockNumbers = rows.map((r) => r.stockNumber!).filter(Boolean)
    const existing = await prisma.vehicle.findMany({
      where: { stockNumber: { in: stockNumbers } },
      select: { stockNumber: true },
    })
    const existingSet = new Set(existing.map((e) => e.stockNumber))

    let added = 0
    let updated = 0
    const skipped: string[] = []

    for (const row of rows) {
      const slug = generateSlug(
        parseInt(row.year!),
        row.make!,
        row.model!,
        row.vehicleType!,
        row.stockNumber!,
      )

      const data = {
        year: parseInt(row.year!),
        make: row.make!,
        model: row.model!,
        vehicleType: row.vehicleType!,
        condition: row.condition!,
        stockNumber: row.stockNumber!,
        vin: row.vin!,
        price: row.price ? parseFloat(row.price) : null,
        mileage: row.mileage ? parseInt(row.mileage) : null,
        description: row.description || null,
        cdlRequired: row.cdlRequired!,
        maxCapacity: parseInt(row.maxCapacity!),
        standardPassengers: parseInt(row.standardPassengers!),
        crew: row.crew || null,
        wheelchairAccessible: row.wheelchairAccessible!,
        liftManufacturer: row.liftManufacturer || null,
        wheelchairPositions: row.wheelchairPositions ? parseInt(row.wheelchairPositions) : null,
        fuelType: row.fuelType!,
        fuelTankCapacity: row.fuelTankCapacity || null,
        ac: row.ac || null,
        exteriorColor: row.exteriorColor || null,
        interiorColor: row.interiorColor || null,
        brake: row.brake || null,
        transmissionMfr: row.transmissionMfr || null,
        transmissionModel: row.transmissionModel || null,
        engineMake: row.engineMake || null,
        engineModel: row.engineModel || null,
        wheelbase: row.wheelbase || null,
        suspensionType: row.suspensionType || null,
        luggage: row.luggage || null,
        locations: row.locations || null,
        industries: row.industries || null,
        status: row.status || 'Draft',
        slug,
        visibility: 'Public',
        includeOnWebsite: true,
      }

      if (existingSet.has(row.stockNumber!)) {
        if (mode === 'update') {
          await prisma.vehicle.update({
            where: { stockNumber: row.stockNumber! },
            data,
          })
          updated++
        } else {
          skipped.push(row.stockNumber!)
        }
      } else {
        await prisma.vehicle.create({ data })
        added++
      }
    }

    return NextResponse.json({
      success: true,
      summary: { added, updated, skipped: skipped.length, errors: 0 },
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
