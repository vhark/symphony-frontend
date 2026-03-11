"use client"

import { useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { BuildSellDiagram } from "@/components/systems/diagrams/build-sell"
import { SalesFunnelDiagram } from "@/components/systems/diagrams/sales-funnel"
import { AgentEcosystemDiagram } from "@/components/systems/diagrams/agent-ecosystem"

const DIAGRAMS = [
  { id: "build-sell", name: "Build / Sell", description: "Two-track operating model with live stage counts", icon: "🔨" },
  { id: "sales-funnel", name: "Sales Funnel", description: "Revenue pipeline from traffic to close", icon: "💰" },
  { id: "agents", name: "Agent Ecosystem", description: "20-agent network with live status", icon: "🤖" },
] as const

type DiagramId = (typeof DIAGRAMS)[number]["id"]

export default function SystemsPage() {
  const [active, setActive] = useState<DiagramId>("build-sell")
  const current = DIAGRAMS.find((d) => d.id === active)!

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#2a2a2a] bg-[#080808] px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold text-white">{current.icon} {current.name}</h1>
          <p className="text-[12px] text-gray-400">{current.description}</p>
        </div>
        <div className="ml-auto flex gap-1">
          {DIAGRAMS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                active === d.id
                  ? "bg-[#7c3aed]/20 text-[#a78bfa]"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              {d.icon} {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlowProvider>
          {active === "build-sell" && <BuildSellDiagram />}
          {active === "sales-funnel" && <SalesFunnelDiagram />}
          {active === "agents" && <AgentEcosystemDiagram />}
        </ReactFlowProvider>
      </div>
    </div>
  )
}
