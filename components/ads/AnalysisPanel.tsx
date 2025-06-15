"use client"

import { useState } from "react"
import { X, TrendingUp, BarChart3, Lightbulb, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SelectionData } from "@/types/ads"
import { getAnalysisData } from "@/lib/analysisLogic"
import InsightsTab from "./analysis/InsightsTab"
import VisualizationsTab from "./analysis/VisualizationsTab"
import RecommendationsTab from "./analysis/RecommendationsTab"
import AskAITab from "./analysis/AskAITab"

interface AnalysisPanelProps {
  isOpen: boolean
  onClose: () => void
  selectionData: SelectionData
}

export function AnalysisPanel({ isOpen, onClose, selectionData }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState("insights")

  const analysisData = getAnalysisData(selectionData)

  const getSelectionTitle = () => {
    switch (selectionData.type) {
      case "rows":
        return `${selectionData.selectedAds?.length || 0} campaigns selected`
      case "columns":
        return `${selectionData.selectedMetrics?.length || 0} metrics selected`
      case "cells":
        return `${selectionData.selectedCells?.length || 0} data points selected`
      default:
        return "Selection analysis"
    }
  }

  const tabs = [
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "visualizations", label: "Visualizations", icon: BarChart3 },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "ask-ai", label: "Ask AI", icon: MessageSquare },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop - Darker and less transparent */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel - Double width */}
      <div className="w-[768px] bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Analysis Dashboard</h2>
            <p className="text-sm text-gray-500">{getSelectionTitle()}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {activeTab === "insights" && <InsightsTab selectionData={selectionData} analysisData={analysisData} />}
              {activeTab === "visualizations" && (
                <VisualizationsTab selectionData={selectionData} analysisData={analysisData} />
              )}
              {activeTab === "recommendations" && <RecommendationsTab selectionData={selectionData} />}
              {activeTab === "ask-ai" && <AskAITab selectionData={selectionData} />}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
