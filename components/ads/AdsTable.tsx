"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AdData, AvailableMetric } from "@/types/ads"

interface AdsTableProps {
  ads: AdData[]
  adType: "video" | "static"
  selectedMetrics: AvailableMetric[]
}

interface ColumnConfig {
  id: string
  label: string
  accessor: keyof AdData
  format?: "currency" | "number" | "percentage"
  minWidth: string
}

export function AdsTable({ ads, adType, selectedMetrics }: AdsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200"
      case "paused":
        return "bg-[hsl(var(--accent-20))] text-[hsl(var(--primary))] border border-[hsl(var(--accent-30))]"
      case "completed":
        return "bg-[hsl(var(--primary-10))] text-[hsl(var(--primary))] border border-[hsl(var(--primary-20))]"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  // Define all possible columns
  const allColumns: ColumnConfig[] = [
    { id: "name", label: "Ad Name", accessor: "name", minWidth: "200px" },
    { id: "status", label: "Status", accessor: "status", minWidth: "80px" },
    { id: "spend", label: "Spend", accessor: "spend", format: "currency", minWidth: "100px" },
    { id: "appInstalls", label: "App Installs", accessor: "appInstalls", format: "number", minWidth: "100px" },
    {
      id: "costPerAppInstall",
      label: "Cost/Install",
      accessor: "costPerAppInstall",
      format: "currency",
      minWidth: "100px",
    },
    { id: "purchases", label: "Purchases", accessor: "purchases", format: "number", minWidth: "100px" },
    {
      id: "costPerPurchase",
      label: "Cost/Purchase",
      accessor: "costPerPurchase",
      format: "currency",
      minWidth: "120px",
    },
    { id: "impressions", label: "Impressions", accessor: "impressions", format: "number", minWidth: "100px" },
    { id: "clicks", label: "Clicks", accessor: "clicks", format: "number", minWidth: "80px" },
    { id: "ctr", label: "CTR", accessor: "ctr", format: "percentage", minWidth: "80px" },
    { id: "cpm", label: "CPM", accessor: "cpm", format: "currency", minWidth: "80px" },
    { id: "reach", label: "Reach", accessor: "reach", format: "number", minWidth: "100px" },
    { id: "frequency", label: "Frequency", accessor: "frequency", format: "number", minWidth: "100px" },
    ...(adType === "video"
      ? [
          {
            id: "videoViews",
            label: "Video Views",
            accessor: "videoViews" as keyof AdData,
            format: "number" as const,
            minWidth: "100px",
          },
          {
            id: "videoViewRate",
            label: "View Rate",
            accessor: "videoViewRate" as keyof AdData,
            format: "percentage" as const,
            minWidth: "100px",
          },
        ]
      : []),
  ]

  // Always include name and status columns, then add selected metrics
  const baseColumns = allColumns.filter((col) => col.id === "name" || col.id === "status")
  const metricColumns = allColumns.filter((col) => selectedMetrics.some((metric) => metric.id === col.id))

  const visibleColumns = [...baseColumns, ...metricColumns]

  const formatValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return "N/A"

    switch (format) {
      case "currency":
        return `$${Number(value).toFixed(2)}`
      case "number":
        return Number(value).toLocaleString()
      case "percentage":
        return `${Number(value).toFixed(2)}%`
      default:
        return String(value)
    }
  }

  const renderCellContent = (ad: AdData, column: ColumnConfig) => {
    if (column.id === "name") {
      return (
        <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={ad.name}>
          {ad.name}
        </div>
      )
    }

    if (column.id === "status") {
      return <Badge className={`text-xs ${getStatusColor(ad.status)}`}>{ad.status}</Badge>
    }

    const value = ad[column.accessor]
    return <span className="text-sm text-gray-900">{formatValue(value, column.format)}</span>
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[hsl(var(--accent-10))]">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-[hsl(var(--accent-5))] transition-colors">
                    {visibleColumns.map((column) => (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        {renderCellContent(ad, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
