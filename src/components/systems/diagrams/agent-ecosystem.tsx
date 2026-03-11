"use client"

import type { Node, Edge } from "@xyflow/react"
import { useAgents, type Agent } from "@/hooks/use-agents"
import { FlowCanvas } from "../flow-canvas"

/* ── Org chart: Nova top → Tier 1 row → Tier 2 grouped under managers ── */

const NODE_W = 170
const NODE_PAD = 30 // gap between Tier 2 nodes within a group
const GROUP_PAD = 60 // gap between Tier 1 columns
const ROW_GAP = 180

const TIER1 = [
  { slug: "pm", name: "Atlas", emoji: "🦅", role: "PM" },
  { slug: "cto", name: "Axiom", emoji: "🐉", role: "CTO" },
  { slug: "coach", name: "Titan", emoji: "🔥", role: "Coach" },
  { slug: "sales", name: "Rex", emoji: "🐺", role: "Sales" },
  { slug: "cmo", name: "Maven", emoji: "🦚", role: "CMO" },
  { slug: "cpo", name: "Forge", emoji: "🔥", role: "CPO" },
  { slug: "finance", name: "Vector", emoji: "📈", role: "CFO" },
]

const TIER2_GROUPS: Record<string, { slug: string; name: string; emoji: string; role: string }[]> = {
  pm: [
    { slug: "km", name: "Scribe", emoji: "🦊", role: "KM" },
  ],
  cto: [
    { slug: "coder", name: "Anvil", emoji: "🛠️", role: "Coder" },
    { slug: "cartographer", name: "Vega", emoji: "🗺️", role: "Diagrams" },
    { slug: "sentinel", name: "Sentinel", emoji: "👁️", role: "Intel" },
  ],
  coach: [
    { slug: "crux", name: "Crux", emoji: "📊", role: "Analysis" },
    { slug: "research", name: "Sage", emoji: "🔬", role: "Research" },
  ],
  sales: [
    { slug: "sourcing", name: "Scout", emoji: "🔍", role: "Sourcing" },
  ],
  cmo: [
    { slug: "content", name: "Pixel", emoji: "🎬", role: "Content" },
    { slug: "comms", name: "Echo", emoji: "🦜", role: "Comms" },
  ],
  cpo: [
    { slug: "kimi", name: "Kimi", emoji: "🌙", role: "Visual" },
    { slug: "volt", name: "Volt", emoji: "🐙", role: "CEA" },
  ],
  finance: [
    { slug: "investor", name: "Oracle", emoji: "🔮", role: "Investor" },
  ],
}

export function AgentEcosystemDiagram() {
  const { agents } = useAgents()

  const getStatus = (slug: string): "green" | "amber" | "gray" => {
    const match = agents.find((a: Agent) => a.slug === slug || a.name?.toLowerCase() === slug)
    if (!match) return "gray"
    return match.status === "active" ? "green" : match.status === "warning" ? "amber" : "gray"
  }

  // Calculate column width for each Tier 1 agent based on how many reports they have
  const colWidths = TIER1.map((mgr) => {
    const reports = TIER2_GROUPS[mgr.slug] || []
    const reportWidth = reports.length * NODE_W + Math.max(0, reports.length - 1) * NODE_PAD
    return Math.max(NODE_W, reportWidth)
  })

  // Calculate x positions for each column (cumulative)
  const colX: number[] = []
  let cursor = 0
  colWidths.forEach((w, i) => {
    colX.push(cursor)
    cursor += w + GROUP_PAD
  })
  const totalWidth = cursor - GROUP_PAD

  // Row 0: Nova centered
  const novaNode: Node = {
    id: "nova",
    type: "hub",
    position: { x: totalWidth / 2 - NODE_W / 2, y: 0 },
    data: { emoji: "✨", label: "Nova", subtitle: "Chief of Staff" },
  }

  // Row 1: Tier 1 — centered within their column
  const tier1Nodes: Node[] = TIER1.map((a, i) => ({
    id: a.slug,
    type: "system" as const,
    position: {
      x: colX[i] + colWidths[i] / 2 - NODE_W / 2,
      y: ROW_GAP,
    },
    data: {
      label: `${a.emoji} ${a.name}`,
      metrics: [{ label: "Role", value: a.role }],
      status: getStatus(a.slug),
    },
  }))

  // Row 2: Tier 2 — spread evenly under their manager's column
  const tier2Nodes: Node[] = []
  TIER1.forEach((mgr, mgrIdx) => {
    const reports = TIER2_GROUPS[mgr.slug] || []
    if (reports.length === 0) return

    const groupWidth = reports.length * NODE_W + (reports.length - 1) * NODE_PAD
    const startX = colX[mgrIdx] + colWidths[mgrIdx] / 2 - groupWidth / 2

    reports.forEach((a, i) => {
      tier2Nodes.push({
        id: a.slug,
        type: "system" as const,
        position: {
          x: startX + i * (NODE_W + NODE_PAD),
          y: ROW_GAP * 2,
        },
        data: {
          label: `${a.emoji} ${a.name}`,
          metrics: [{ label: "Role", value: a.role }],
          status: getStatus(a.slug),
        },
      })
    })
  })

  const nodes: Node[] = [novaNode, ...tier1Nodes, ...tier2Nodes]

  const edges: Edge[] = [
    // Nova → Tier 1
    ...TIER1.map((a) => ({
      id: `nova-${a.slug}`,
      source: "nova",
      target: a.slug,
      type: "delegation",
    })),
    // Tier 1 → Tier 2
    ...TIER1.flatMap((mgr) =>
      (TIER2_GROUPS[mgr.slug] || []).map((report) => ({
        id: `del-${mgr.slug}-${report.slug}`,
        source: mgr.slug,
        target: report.slug,
        type: "delegation",
      }))
    ),
  ]

  return <FlowCanvas nodes={nodes} edges={edges} />
}
