"use client"

import type { Node, Edge } from "@xyflow/react"
import { useAgents, type Agent } from "@/hooks/use-agents"
import { FlowCanvas } from "../flow-canvas"

const CX = 500
const CY = 420

const TIER1 = [
  { slug: "pm", name: "Atlas", emoji: "🦅", role: "PM" },
  { slug: "cto", name: "Axiom", emoji: "🐉", role: "CTO" },
  { slug: "coach", name: "Titan", emoji: "🔥", role: "Coach" },
  { slug: "sales", name: "Rex", emoji: "🐺", role: "Sales" },
  { slug: "cmo", name: "Maven", emoji: "🦚", role: "CMO" },
  { slug: "cpo", name: "Forge", emoji: "🔥", role: "CPO" },
  { slug: "finance", name: "Vector", emoji: "📈", role: "CFO" },
]

const TIER2 = [
  { slug: "research", name: "Sage", emoji: "🔬", role: "Research" },
  { slug: "sourcing", name: "Scout", emoji: "🔍", role: "Sourcing" },
  { slug: "km", name: "Scribe", emoji: "🦊", role: "KM" },
  { slug: "comms", name: "Echo", emoji: "🦜", role: "Comms" },
  { slug: "cartographer", name: "Vega", emoji: "🗺️", role: "Diagrams" },
  { slug: "sentinel", name: "Sentinel", emoji: "👁️", role: "Intel" },
  { slug: "volt", name: "Volt", emoji: "🐙", role: "CEA" },
  { slug: "coder", name: "Anvil", emoji: "🛠️", role: "Coder" },
  { slug: "investor", name: "Oracle", emoji: "🔮", role: "Investor" },
  { slug: "content", name: "Pixel", emoji: "🎬", role: "Content" },
  { slug: "kimi", name: "Kimi", emoji: "🌙", role: "Visual" },
  { slug: "crux", name: "Crux", emoji: "📊", role: "Analysis" },
]

// Delegation edges: which Tier1 agents connect to which Tier2
const DELEGATIONS: [string, string][] = [
  ["cmo", "content"], ["cmo", "comms"],
  ["cto", "coder"], ["cto", "cartographer"],
  ["pm", "km"],
  ["sales", "sourcing"],
  ["cpo", "kimi"],
]

function ring(agents: typeof TIER1, radius: number, startAngle = -Math.PI / 2): Node[] {
  const step = (2 * Math.PI) / agents.length
  return agents.map((a, i) => {
    const angle = startAngle + i * step
    return {
      id: a.slug,
      type: "system" as const,
      position: { x: CX + radius * Math.cos(angle) - 80, y: CY + radius * Math.sin(angle) - 30 },
      data: {
        label: `${a.emoji} ${a.name}`,
        metrics: [{ label: "Role", value: a.role }],
        status: "green" as const,
      },
    }
  })
}

export function AgentEcosystemDiagram() {
  const { agents } = useAgents()

  // Merge live status if available
  const getStatus = (slug: string): "green" | "amber" | "gray" => {
    const match = agents.find((a: Agent) => a.slug === slug || a.name?.toLowerCase() === slug)
    if (!match) return "gray"
    return match.status === "active" ? "green" : match.status === "warning" ? "amber" : "gray"
  }

  const innerNodes = ring(TIER1, 200).map((n) => ({
    ...n,
    data: { ...n.data, status: getStatus(n.id) },
  }))

  const outerNodes = ring(TIER2, 380).map((n) => ({
    ...n,
    data: { ...n.data, status: getStatus(n.id) },
  }))

  const novaNode: Node = {
    id: "nova",
    type: "hub",
    position: { x: CX - 80, y: CY - 40 },
    data: { emoji: "✨", label: "Nova", subtitle: "Chief of Staff" },
  }

  const nodes: Node[] = [novaNode, ...innerNodes, ...outerNodes]

  const edges: Edge[] = [
    // Nova → all Tier 1
    ...TIER1.map((a) => ({
      id: `nova-${a.slug}`,
      source: "nova",
      target: a.slug,
      type: "delegation",
    })),
    // Tier 1 → Tier 2 delegations
    ...DELEGATIONS.map(([from, to]) => ({
      id: `del-${from}-${to}`,
      source: from,
      target: to,
      type: "delegation",
    })),
  ]

  return <FlowCanvas nodes={nodes} edges={edges} />
}
