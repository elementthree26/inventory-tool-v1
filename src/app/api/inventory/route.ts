import { NextRequest, NextResponse } from 'next/server'
import { getInventory } from '@/lib/inventory'
import type { FilterState } from '@/types/inventory'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const filters: FilterState = {
    condition: searchParams.get('condition') || undefined,
    type: searchParams.get('type') || undefined,
    wheelchair: searchParams.get('wheelchair') || undefined,
    capacity: searchParams.get('capacity') || undefined,
    make: searchParams.get('make') || undefined,
    cdl: searchParams.get('cdl') || undefined,
    fuel: searchParams.get('fuel') || undefined,
    location: searchParams.get('location') || undefined,
    industry: searchParams.get('industry') || undefined,
    yearMin: searchParams.get('yearMin') || undefined,
    yearMax: searchParams.get('yearMax') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
    page: searchParams.get('page') || undefined,
  }

  try {
    const result = await getInventory(filters)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Inventory API error:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}
