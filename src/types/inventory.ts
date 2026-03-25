export interface Vehicle {
  id: number
  createdAt: string
  updatedAt: string
  year: number
  make: string
  model: string
  vehicleType: string
  condition: string
  stockNumber: string
  vin: string
  mileage: number | null
  price: number | null
  description: string | null
  cdlRequired: string
  maxCapacity: number
  standardPassengers: number
  crew: string | null
  wheelchairAccessible: string
  liftManufacturer: string | null
  wheelchairPositions: number | null
  wheelbase: string | null
  suspensionType: string | null
  engineMake: string | null
  engineModel: string | null
  fuelType: string
  fuelTankCapacity: string | null
  ac: string | null
  luggage: string | null
  brake: string | null
  transmissionMfr: string | null
  transmissionModel: string | null
  exteriorColor: string | null
  interiorColor: string | null
  images: string[] | null
  floorPlan: string | null
  matterportUrl: string | null
  featuredImage: string | null
  status: string
  visibility: string
  includeOnWebsite: boolean
  locations: string[] | null
  industries: string[] | null
  contactFormEmbed: string | null
  slug: string
}

export interface VehicleListResponse {
  vehicles: Vehicle[]
  total: number
  page: number
  perPage: number
  totalPages: number
  filters: AvailableFilters
}

export interface AvailableFilters {
  makes: string[]
  vehicleTypes: string[]
  fuelTypes: string[]
  locations: string[]
  industries: string[]
  yearMin: number
  yearMax: number
  conditions: string[]
}

export interface FilterState {
  condition?: string
  type?: string
  wheelchair?: string
  capacity?: string
  make?: string
  cdl?: string
  fuel?: string
  location?: string
  industry?: string
  yearMin?: string
  yearMax?: string
  search?: string
  sort?: string
  page?: string
}

export type SortOption = 'newest' | 'price-low' | 'price-high'
