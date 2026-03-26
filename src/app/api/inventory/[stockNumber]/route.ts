import { NextRequest, NextResponse } from 'next/server'
import { getVehicleByStockNumber, getSimilarVehicles } from '@/lib/inventory'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: { stockNumber: string } }
) {
  try {
    const vehicle = await getVehicleByStockNumber(params.stockNumber)
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const similarVehicles = await getSimilarVehicles(vehicle)

    return NextResponse.json({ vehicle, similarVehicles })
  } catch (error) {
    console.error('Vehicle detail API error:', error)
    return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 })
  }
}
