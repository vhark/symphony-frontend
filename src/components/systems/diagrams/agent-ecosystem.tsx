"use client"

import type { Node, Edge } from "@xyflow/react"
import { useAgents, type Agent } from "@/hooks/use-agents"
import { FlowCanvas } from "../flow-canvas"

/* ── Premium org chart with AgentNode cards ── */

const NODE_W = 160
const NODE_PAD = 30
const GROUP_PAD = 70
const ROW_GAP = 200

const TIER1 = [
  { slug: "pm", name: "Atlas", emoji: "🦅", role: "Project Manager" },
  { slug: "cto", name: "Axiom", emoji: "🐉", role: "Chief Technology Officer" },
  { slug: "coach", name: "Titan", emoji: "🔥", role: "Executive Coach" },
  { slug: "sales", name: "Rex", emoji: "🐺", role: "Head of Sales" },
  { slug: "cmo", name: "Maven", emoji: "🦚", role: "Chief Marketing Officer" },
  { slug: "cpo", name: "Forge", emoji: "🔥", role: "Chief Product Officer" },
  { slug: "finance", name: "Vector", emoji: "📈", role: "Chief Financial Officer" },
]

const TIER2_GROUPS: Record<string, { slug: string; name: string; emoji: string; role: string }[]> = {
  pm: [
    { slug: "km", name: "Scribe", emoji: "🦊", role: "Knowledge Manager" },
  ],
  cto: [
    { slug: "coder", name: "Anvil", emoji: "🛠️", role: "Engineer" },
    { slug: "cartographer", name: "Vega", emoji: "🗺️", role: "Systems Diagrams" },
    { slug: "sentinel", name: "Sentinel", emoji: "👁️", role: "Intelligence" },
  ],
  coach: [
    { slug: "crux", name: "Crux", emoji: "📊", role: "Analysis" },
    { slug: "research", name: "Sage", emoji: "🔬", role: "Deep Research" },
  ],
  sales: [
    { slug: "sourcing", name: "Scout", emoji: "🔍", role: "Sourcing" },
  ],
  cmo: [
    { slug: "content", name: "Pixel", emoji: "🎬", role: "Content Creator" },
    { slug: "comms", name: "Echo", emoji: "🦜", role: "Communications" },
  ],
  cpo: [
    { slug: "kimi", name: "Kimi", emoji: "🌙", role: "Visual Design" },
    { slug: "volt", name: "Volt", emoji: "🐙", role: "CEA Controls" },
  ],
  finance: [
    { slug: "investor", name: "Oracle", emoji: "🔮", role: "Investment Strategy" },
  ],
}

export function AgentEcosystemDiagram() {
  const { agents } = useAgents()

  const getStatus = (slug: string): "green" | "amber" | "gray" => {
    const match = agents.find((a: Agent) => a.slug === slug || a.name?.toLowerCase() === slug)
    if (!match) return "gray"
    return match.status === "active" ? "green" : match.status === "warning" ? "amber" : "gray"
  }

  const getModel = (slug: string): string | undefined => {
    const match = agents.find((a: Agent) => a.slug === slug || a.name?.toLowerCase() === slug)
    return match?.model
  }

  // Dynamic column widths
  const colWidths = TIER1.map((mgr) => {
    const reports = TIER2_GROUPS[mgr.slug] || []
    const reportWidth = reports.length * NODE_W + Math.max(0, reports.length - 1) * NODE_PAD
    return Math.max(NODE_W, reportWidth)
  })

  const colX: number[] = []
  let cursor = 0
  colWidths.forEach((w) => {
    colX.push(cursor)
    cursor += w + GROUP_PAD
  })
  const totalWidth = cursor - GROUP_PAD

  // Nova — centered at top
  const novaNode: Node = {
    id: "nova",
    type: "agent",
    position: { x: totalWidth / 2 - NODE_W / 2, y: 0 },
    data: {
      emoji: "✨",
      name: "Nova",
      role: "Chief of Staff",
      tier: "hub",
      status: "green",
      model: "claude-opus-4",
    },
  }

  // Tier 1 — centered in each column
  const tier1Nodes: Node[] = TIER1.map((a, i) => ({
    id: a.slug,
    type: "agent" as const,
    position: { x: colX[i] + colWidths[i] / 2 - NODE_W / 2, y: ROW_GAP },
    data: {
      emoji: a.emoji,
      name: a.name,
      role: a.role,
      tier: "tier1" as const,
      status: getStatus(a.slug),
      model: getModel(a.slug),
    },
  }))

  // Tier 2 — spread under manager columns
  const tier2Nodes: Node[] = []
  TIER1.forEach((mgr, mgrIdx) => {
    const reports = TIER2_GROUPS[mgr.slug] || []
    if (reports.length === 0) return

    const groupWidth = reports.length * NODE_W + (reports.length - 1) * NODE_PAD
    const startX = colX[mgrIdx] + colWidths[mgrIdx] / 2 - groupWidth / 2

    reports.forEach((a, i) => {
      tier2Nodes.push({
        id: a.slug,
        type: "agent" as const,
        position: { x: startX + i * (NODE_W + NODE_PAD), y: ROW_GAP * 2 },
        data: {
          emoji: a.emoji,
          name: a.name,
          role: a.role,
          tier: "tier2" as const,
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
