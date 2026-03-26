import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Vehicle Inventory | Browse Commercial Vehicles',
  description: 'Browse our complete inventory of commercial vehicles including school buses, shuttle buses, vans, and coaches. Filter by type, capacity, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
