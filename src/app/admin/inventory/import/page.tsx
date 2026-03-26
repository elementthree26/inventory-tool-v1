'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

interface ImportError {
  row: number
  field: string
  message: string
}

interface ParsedRow {
  [key: string]: string
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [mode, setMode] = useState<'add' | 'update'>('add')
  const [importing, setImporting] = useState(false)
  const [errors, setErrors] = useState<ImportError[]>([])
  const [result, setResult] = useState<{ added: number; updated: number; skipped: number } | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)

  const parseCSV = useCallback((text: string): ParsedRow[] => {
    const lines = text.split('\n').filter((l) => l.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
    const rows: ParsedRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values: string[] = []
      let current = ''
      let inQuotes = false

      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const row: ParsedRow = {}
      headers.forEach((h, idx) => {
        row[h] = values[idx] || ''
      })
      rows.push(row)
    }

    return rows
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setFile(f)
    setErrors([])
    setResult(null)

    const text = await f.text()
    const rows = parseCSV(text)
    setParsedData(rows)
    setPreviewVisible(true)
  }

  const handleImport = async () => {
    if (parsedData.length === 0) return

    setImporting(true)
    setErrors([])
    setResult(null)

    try {
      const res = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedData, mode }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors || [])
      } else if (data.success) {
        setResult(data.summary)
      }
    } catch {
      setErrors([{ row: 0, field: '', message: 'Import failed. Please try again.' }])
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'stockNumber', 'year', 'make', 'model', 'vehicleType', 'condition', 'vin',
      'price', 'mileage', 'description', 'cdlRequired', 'maxCapacity',
      'standardPassengers', 'crew', 'wheelchairAccessible', 'liftManufacturer',
      'wheelchairPositions', 'fuelType', 'fuelTankCapacity', 'ac',
      'exteriorColor', 'interiorColor', 'brake', 'transmissionMfr',
      'transmissionModel', 'engineMake', 'engineModel', 'wheelbase',
      'suspensionType', 'luggage', 'locations', 'industries', 'status',
    ]

    const example = [
      '999001', '2025', 'Blue Bird', 'Vision', 'School Bus', 'New',
      '1BAKB000X0F000001', '125000', '', 'Example school bus description',
      'Required', '72', '72', 'Driver', 'No', '', '', 'Diesel', '60 gal',
      '65,000 BTU', 'Yellow', 'Gray', 'Air Disc', 'Allison', '2500 Series',
      'Cummins', 'B6.7', '252"', 'Leaf Spring', '',
      '["Indianapolis, IN"]', '["School District"]', 'Published',
    ]

    const csv = headers.join(',') + '\n' + example.join(',')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin/inventory" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
          &larr; Back to Inventory
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Import Inventory</h1>
        <p className="text-sm text-gray-600 mt-1">Upload a CSV file to add or update inventory units</p>
      </div>

      {/* Template Download */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-800">CSV Template</h3>
            <p className="text-xs text-blue-700 mt-1">Download the template with all required fields and example data</p>
          </div>
          <button onClick={downloadTemplate} className="btn-primary text-sm py-2 px-4">
            Download Template
          </button>
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV File</h3>

        <div className="flex items-center gap-4 mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="add"
              checked={mode === 'add'}
              onChange={() => setMode('add')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Add new only (skip existing stock numbers)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="update"
              checked={mode === 'update'}
              onChange={() => setMode('update')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Update existing (match by stock number)</span>
          </label>
        </div>
      </div>

      {/* Preview */}
      {previewVisible && parsedData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Import Preview: {parsedData.length} units
            </h3>
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn-primary text-sm py-2 px-6 disabled:opacity-50"
            >
              {importing ? 'Importing...' : 'Start Import'}
            </button>
          </div>

          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left">#</th>
                  <th className="px-2 py-2 text-left">Stock #</th>
                  <th className="px-2 py-2 text-left">Year</th>
                  <th className="px-2 py-2 text-left">Make</th>
                  <th className="px-2 py-2 text-left">Model</th>
                  <th className="px-2 py-2 text-left">Type</th>
                  <th className="px-2 py-2 text-left">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parsedData.slice(0, 20).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-2 py-1.5 text-gray-500">{i + 1}</td>
                    <td className="px-2 py-1.5 font-medium">{row.stockNumber}</td>
                    <td className="px-2 py-1.5">{row.year}</td>
                    <td className="px-2 py-1.5">{row.make}</td>
                    <td className="px-2 py-1.5">{row.model}</td>
                    <td className="px-2 py-1.5">{row.vehicleType}</td>
                    <td className="px-2 py-1.5">{row.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 20 && (
              <p className="text-xs text-gray-500 mt-2">...and {parsedData.length - 20} more rows</p>
            )}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            {errors.length} validation error(s) found:
          </h3>
          <div className="max-h-48 overflow-y-auto">
            <ul className="text-xs text-red-700 space-y-1">
              {errors.map((err, i) => (
                <li key={i}>
                  Row {err.row}: <strong>{err.field}</strong> — {err.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Import Complete</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>{result.added} units added</li>
            <li>{result.updated} units updated</li>
            {result.skipped > 0 && <li>{result.skipped} units skipped (existing stock numbers)</li>}
          </ul>
          <Link href="/admin/inventory" className="text-sm text-green-800 font-medium hover:underline mt-2 inline-block">
            View Inventory &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
