"use client"

import type { Node, Edge } from "@xyflow/react"
import { useSellPipeline } from "@/hooks/use-sell-pipeline"
import { FlowCanvas } from "../flow-canvas"

export function SalesFunnelDiagram() {
  const { deals } = useSellPipeline()
  const pipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0)
  const closedDeals = deals.filter((d) => d.stage?.toLowerCase() === "close" || d.stage?.toLowerCase() === "succeed")
  const closedValue = closedDeals.reduce((sum, d) => sum + (d.value || 0), 0)

  const nodes: Node[] = [
    {
      id: "traffic",
      type: "metric",
      position: { x: 250, y: 0 },
      data: { value: "~2.4K/mo", label: "Website Traffic", trend: "up" as const },
    },
    {
      id: "landing",
      type: "system",
      position: { x: 230, y: 110 },
      data: {
        label: "Landing Pages",
        emoji: "🌐",
        metrics: [{ label: "Sites", value: "3" }, { label: "A/B", value: "Active" }],
        status: "green" as const,
      },
    },
    {
      id: "capture",
      type: "system",
      position: { x: 230, y: 230 },
      data: {
        label: "Mautic Capture",
        emoji: "📧",
        metrics: [{ label: "Contacts", value: "347" }, { label: "Forms", value: "6" }],
        status: "green" as const,
      },
    },
    {
      id: "nurture",
      type: "system",
      position: { x: 230, y: 350 },
      data: {
        label: "Email Nurture",
        emoji: "💌",
        metrics: [{ label: "Campaigns", value: "5" }, { label: "Open Rate", value: "32%" }],
        status: "green" as const,
      },
    },
    {
      id: "crm",
      type: "system",
      position: { x: 230, y: 470 },
      data: {
        label: "EspoCRM Pipeline",
        emoji: "📊",
        metrics: [{ label: "Value", value: `$${Math.round(pipelineValue / 1000)}K` }],
        status: "green" as const,
      },
    },
    {
      id: "pipeline",
      type: "stage",
      position: { x: 260, y: 590 },
      data: { label: "Active Deals", count: deals.length, track: "sell" as const },
    },
    {
      id: "revenue",
      type: "metric",
      position: { x: 250, y: 700 },
      data: {
        value: closedValue > 0 ? `$${Math.round(closedValue / 1000)}K` : "$45K",
        label: "Closed Revenue",
        trend: "up" as const,
      },
    },
  ]

  const ids = ["traffic", "landing", "capture", "nurture", "crm", "pipeline", "revenue"]
  const edges: Edge[] = ids.slice(0, -1).map((id, i) => ({
    id: `funnel-${i}`,
    source: id,
    target: ids[i + 1],
    type: "dataflow",
  }))

  return <FlowCanvas nodes={nodes} edges={edges} />
}
