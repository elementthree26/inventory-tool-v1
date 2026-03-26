import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const taxonomies = await prisma.taxonomy.findMany({
      orderBy: [{ type: 'asc' }, { value: 'asc' }],
    })
    return NextResponse.json(taxonomies)
  } catch (error) {
    console.error('Taxonomies error:', error)
    return NextResponse.json({ error: 'Failed to fetch taxonomies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, value, parentId } = await request.json()

    if (!type || !value) {
      return NextResponse.json({ error: 'Type and value are required' }, { status: 400 })
    }

    const taxonomy = await prisma.taxonomy.create({
      data: { type, value, parentId: parentId || null },
    })

    return NextResponse.json(taxonomy, { status: 201 })
  } catch (error) {
    console.error('Create taxonomy error:', error)
    return NextResponse.json({ error: 'Failed to create taxonomy' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    await prisma.taxonomy.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete taxonomy error:', error)
    return NextResponse.json({ error: 'Failed to delete taxonomy' }, { status: 500 })
  }
}
