"use client"

import type { Node, Edge } from "@xyflow/react"
import { useAgents, type Agent } from "@/hooks/use-agents"
import { FlowCanvas } from "../flow-canvas"

/* ── Org chart layout: Nova at top, Tier 1 below, Tier 2 grouped under their managers ── */

const NODE_W = 160
const COL_GAP = 200
const ROW_GAP = 160

const TIER1 = [
  { slug: "pm", name: "Atlas", emoji: "🦅", role: "PM" },
  { slug: "cto", name: "Axiom", emoji: "🐉", role: "CTO" },
  { slug: "coach", name: "Titan", emoji: "🔥", role: "Coach" },
  { slug: "sales", name: "Rex", emoji: "🐺", role: "Sales" },
  { slug: "cmo", name: "Maven", emoji: "🦚", role: "CMO" },
  { slug: "cpo", name: "Forge", emoji: "🔥", role: "CPO" },
  { slug: "finance", name: "Vector", emoji: "📈", role: "CFO" },
]

// Tier 2 grouped by their Tier 1 manager
const TIER2_GROUPS: Record<string, { slug: string; name: string; emoji: string; role: string }[]> = {
  pm: [
    { slug: "km", name: "Scribe", emoji: "🦊", role: "KM" },
  ],
  cto: [
    { slug: "coder", name: "Anvil", emoji: "🛠️", role: "Coder" },
    { slug: "cartographer", name: "Vega", emoji: "🗺️", role: "Diagrams" },
    { slug: "sentinel", name: "Sentinel", emoji: "👁️", role: "Intel" },
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
  coach: [
    { slug: "crux", name: "Crux", emoji: "📊", role: "Analysis" },
    { slug: "research", name: "Sage", emoji: "🔬", role: "Research" },
  ],
}

export function AgentEcosystemDiagram() {
  const { agents } = useAgents()

  const getStatus = (slug: string): "green" | "amber" | "gray" => {
    const match = agents.find((a: Agent) => a.slug === slug || a.name?.toLowerCase() === slug)
    if (!match) return "gray"
    return match.status === "active" ? "green" : match.status === "warning" ? "amber" : "gray"
  }

  // Row 0: Nova (centered above Tier 1)
  const tier1Width = TIER1.length * COL_GAP
  const novaX = tier1Width / 2 - NODE_W / 2

  const novaNode: Node = {
    id: "nova",
    type: "hub",
    position: { x: novaX, y: 0 },
    data: { emoji: "✨", label: "Nova", subtitle: "Chief of Staff" },
  }

  // Row 1: Tier 1 agents evenly spaced
  const tier1Nodes: Node[] = TIER1.map((a, i) => ({
    id: a.slug,
    type: "system" as const,
    position: { x: i * COL_GAP, y: ROW_GAP },
    data: {
      label: `${a.emoji} ${a.name}`,
      metrics: [{ label: "Role", value: a.role }],
      status: getStatus(a.slug),
    },
  }))

  // Row 2: Tier 2 agents positioned below their Tier 1 manager
  const tier2Nodes: Node[] = []
  TIER1.forEach((mgr, mgrIdx) => {
    const reports = TIER2_GROUPS[mgr.slug] || []
    const mgrX = mgrIdx * COL_GAP
    // Center the reports under the manager
    const groupWidth = reports.length * (NODE_W + 20)
    const startX = mgrX + NODE_W / 2 - groupWidth / 2

    reports.forEach((a, i) => {
      tier2Nodes.push({
        id: a.slug,
        type: "system" as const,
        position: { x: startX + i * (NODE_W + 20), y: ROW_GAP * 2 + 20 },
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
