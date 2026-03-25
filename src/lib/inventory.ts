import { prisma } from './prisma'
import type { Vehicle, VehicleListResponse, AvailableFilters, FilterState } from '@/types/inventory'

function parseJsonField(value: string | null): string[] | null {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function transformVehicle(raw: Record<string, unknown>): Vehicle {
  return {
    ...raw,
    images: parseJsonField(raw.images as string | null),
    locations: parseJsonField(raw.locations as string | null),
    industries: parseJsonField(raw.industries as string | null),
    createdAt: (raw.createdAt as Date).toISOString(),
    updatedAt: (raw.updatedAt as Date).toISOString(),
  } as Vehicle
}

export async function getAvailableFilters(): Promise<AvailableFilters> {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'Published', includeOnWebsite: true, visibility: 'Public' },
    select: {
      make: true,
      vehicleType: true,
      fuelType: true,
      locations: true,
      industries: true,
      year: true,
      condition: true,
    },
  })

  const makes = new Set<string>()
  const vehicleTypes = new Set<string>()
  const fuelTypes = new Set<string>()
  const locations = new Set<string>()
  const industries = new Set<string>()
  const conditions = new Set<string>()
  let yearMin = 9999
  let yearMax = 0

  for (const v of vehicles) {
    makes.add(v.make)
    vehicleTypes.add(v.vehicleType)
    fuelTypes.add(v.fuelType)
    conditions.add(v.condition)
    if (v.year < yearMin) yearMin = v.year
    if (v.year > yearMax) yearMax = v.year

    const locs = parseJsonField(v.locations)
    if (locs) locs.forEach((l) => locations.add(l))
    const inds = parseJsonField(v.industries)
    if (inds) inds.forEach((i) => industries.add(i))
  }

  return {
    makes: Array.from(makes).sort(),
    vehicleTypes: Array.from(vehicleTypes).sort(),
    fuelTypes: Array.from(fuelTypes).sort(),
    locations: Array.from(locations).sort(),
    industries: Array.from(industries).sort(),
    yearMin,
    yearMax,
    conditions: Array.from(conditions).sort(),
  }
}

export async function getInventory(filters: FilterState): Promise<VehicleListResponse> {
  const where: Record<string, unknown> = {
    status: 'Published',
    includeOnWebsite: true,
    visibility: 'Public',
  }

  // Condition filter
  if (filters.condition) {
    const conditionMap: Record<string, string> = { new: 'New', 'pre-owned': 'Pre-Owned' }
    where.condition = conditionMap[filters.condition] || filters.condition
  }

  // Vehicle type filter
  if (filters.type) {
    const types = filters.type.split(',').map((t) => {
      const typeMap: Record<string, string> = {
        'school-bus': 'School Bus',
        'shuttle-bus': 'Shuttle Bus',
        van: 'Van',
        coach: 'Coach',
      }
      return typeMap[t] || t
    })
    where.vehicleType = { in: types }
  }

  // Wheelchair filter
  if (filters.wheelchair) {
    where.wheelchairAccessible = filters.wheelchair === 'yes' ? 'Yes' : 'No'
  }

  // Capacity filter
  if (filters.capacity) {
    const caps = filters.capacity.split(',')
    const capacityConditions: Array<Record<string, unknown>> = []
    for (const cap of caps) {
      if (cap === 'small') capacityConditions.push({ maxCapacity: { lt: 15 } })
      if (cap === 'medium') capacityConditions.push({ maxCapacity: { gte: 16, lte: 28 } })
      if (cap === 'large') capacityConditions.push({ maxCapacity: { gte: 29 } })
    }
    if (capacityConditions.length > 0) {
      where.OR = capacityConditions
    }
  }

  // Make filter
  if (filters.make) {
    const makes = filters.make.split(',')
    where.make = { in: makes }
  }

  // CDL filter
  if (filters.cdl) {
    const cdls = filters.cdl.split(',').map((c) => {
      return c === 'required' ? 'Required' : 'Not Required'
    })
    where.cdlRequired = { in: cdls }
  }

  // Fuel type filter
  if (filters.fuel) {
    const fuels = filters.fuel.split(',').map((f) => f.charAt(0).toUpperCase() + f.slice(1))
    where.fuelType = { in: fuels }
  }

  // Year range
  if (filters.yearMin || filters.yearMax) {
    where.year = {}
    if (filters.yearMin) (where.year as Record<string, number>).gte = parseInt(filters.yearMin)
    if (filters.yearMax) (where.year as Record<string, number>).lte = parseInt(filters.yearMax)
  }

  // Stock number search
  if (filters.search) {
    where.stockNumber = { contains: filters.search }
  }

  // Location filter
  if (filters.location) {
    where.locations = { contains: filters.location }
  }

  // Industry filter
  if (filters.industry) {
    where.industries = { contains: filters.industry }
  }

  // Sorting
  let orderBy: Record<string, string> = { createdAt: 'desc' }
  if (filters.sort === 'price-low') orderBy = { price: 'asc' }
  if (filters.sort === 'price-high') orderBy = { price: 'desc' }

  const page = parseInt(filters.page || '1')
  const perPage = 12
  const skip = (page - 1) * perPage

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where: where as never,
      orderBy: orderBy as never,
      skip,
      take: perPage,
    }),
    prisma.vehicle.count({ where: where as never }),
  ])

  const availableFilters = await getAvailableFilters()

  return {
    vehicles: vehicles.map((v) => transformVehicle(v as unknown as Record<string, unknown>)),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    filters: availableFilters,
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicle = await prisma.vehicle.findUnique({ where: { slug } })
  if (!vehicle) return null
  return transformVehicle(vehicle as unknown as Record<string, unknown>)
}

export async function getVehicleByStockNumber(stockNumber: string): Promise<Vehicle | null> {
  const vehicle = await prisma.vehicle.findUnique({ where: { stockNumber } })
  if (!vehicle) return null
  return transformVehicle(vehicle as unknown as Record<string, unknown>)
}

export async function getSimilarVehicles(vehicle: Vehicle, limit = 3): Promise<Vehicle[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: 'Published',
      includeOnWebsite: true,
      visibility: 'Public',
      vehicleType: vehicle.vehicleType,
      stockNumber: { not: vehicle.stockNumber },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  // Sort by closest passenger count
  const sorted = vehicles
    .map((v) => ({
      vehicle: transformVehicle(v as unknown as Record<string, unknown>),
      diff: Math.abs(v.maxCapacity - vehicle.maxCapacity),
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, limit)
    .map((s) => s.vehicle)

  return sorted
}

export async function getAllVehiclesAdmin() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { updatedAt: 'desc' },
  })
  return vehicles.map((v) => transformVehicle(v as unknown as Record<string, unknown>))
}
