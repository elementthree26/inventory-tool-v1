import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, ids } = await request.json() as { action: string; ids: number[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No vehicle IDs provided' }, { status: 400 })
    }

    switch (action) {
      case 'delete':
        await prisma.vehicle.deleteMany({ where: { id: { in: ids } } })
        return NextResponse.json({ success: true, message: `${ids.length} vehicles deleted` })

      case 'draft':
        await prisma.vehicle.updateMany({
          where: { id: { in: ids } },
          data: { status: 'Draft' },
        })
        return NextResponse.json({ success: true, message: `${ids.length} vehicles set to Draft` })

      case 'publish':
        await prisma.vehicle.updateMany({
          where: { id: { in: ids } },
          data: { status: 'Published' },
        })
        return NextResponse.json({ success: true, message: `${ids.length} vehicles published` })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Bulk action error:', error)
    return NextResponse.json({ error: 'Bulk action failed' }, { status: 500 })
  }
}
