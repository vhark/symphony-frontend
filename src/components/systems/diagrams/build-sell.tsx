"use client"

import type { Node, Edge } from "@xyflow/react"
import { useBuildPipeline } from "@/hooks/use-build-pipeline"
import { useSellPipeline } from "@/hooks/use-sell-pipeline"
import { FlowCanvas } from "../flow-canvas"

const BUILD_STAGES = ["Discovery", "Design", "Develop", "Test", "Release", "Iterate"]
const SELL_STAGES = ["Attract", "Capture", "Nurture", "Close", "Implement", "Succeed"]

function countByStage(items: { stage: string }[], stageName: string): number {
  return items.filter((i) => i.stage?.toLowerCase() === stageName.toLowerCase()).length
}

export function BuildSellDiagram() {
  const { projects } = useBuildPipeline()
  const { deals } = useSellPipeline()

  const nodes: Node[] = [
    // Build track (top)
    ...BUILD_STAGES.map((stage, i) => ({
      id: `build-${stage}`,
      type: "stage" as const,
      position: { x: i * 220, y: 0 },
      data: { label: stage, count: countByStage(projects, stage), track: "build" },
    })),
    // Sell track (bottom)
    ...SELL_STAGES.map((stage, i) => ({
      id: `sell-${stage}`,
      type: "stage" as const,
      position: { x: i * 220, y: 320 },
      data: { label: stage, count: countByStage(deals, stage), track: "sell" },
    })),
    // PMF bridge
    {
      id: "pmf",
      type: "hub",
      position: { x: 440, y: 130 },
      data: { emoji: "🎯", label: "Product-Market Fit", subtitle: "Bridge" },
    },
  ]

  const edges: Edge[] = [
    // Build chain
    ...BUILD_STAGES.slice(0, -1).map((s, i) => ({
      id: `b-${i}`,
      source: `build-${s}`,
      target: `build-${BUILD_STAGES[i + 1]}`,
      type: "dataflow",
    })),
    // Sell chain
    ...SELL_STAGES.slice(0, -1).map((s, i) => ({
      id: `s-${i}`,
      source: `sell-${s}`,
      target: `sell-${SELL_STAGES[i + 1]}`,
      type: "dataflow",
    })),
    // Bridge connections
    { id: "pmf-build", source: "build-Test", target: "pmf", type: "delegation" },
    { id: "pmf-sell", source: "pmf", target: "sell-Close", type: "delegation" },
  ]

  return <FlowCanvas nodes={nodes} edges={edges} />
}
