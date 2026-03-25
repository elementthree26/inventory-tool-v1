import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'stockNumber', 'year', 'make', 'model', 'vehicleType', 'condition', 'vin',
      'price', 'mileage', 'description', 'cdlRequired', 'maxCapacity',
      'standardPassengers', 'crew', 'wheelchairAccessible', 'liftManufacturer',
      'wheelchairPositions', 'fuelType', 'fuelTankCapacity', 'ac',
      'exteriorColor', 'interiorColor', 'brake', 'transmissionMfr',
      'transmissionModel', 'engineMake', 'engineModel', 'wheelbase',
      'suspensionType', 'luggage', 'locations', 'industries', 'status',
    ]

    const csvRows = [headers.join(',')]

    for (const v of vehicles) {
      const row = headers.map((h) => {
        const val = (v as Record<string, unknown>)[h]
        if (val === null || val === undefined) return ''
        const str = String(val)
        // Escape CSV values with commas or quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      })
      csvRows.push(row.join(','))
    }

    const csv = csvRows.join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=inventory-export-${new Date().toISOString().split('T')[0]}.csv`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
