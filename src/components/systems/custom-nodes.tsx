"use client"

import { Handle, Position } from "@xyflow/react"
import type { NodeProps, Node } from "@xyflow/react"

/* ---------- SystemNode ---------- */
type SystemNodeData = {
  label: string
  emoji?: string
  metrics?: { label: string; value: string }[]
  status?: "green" | "amber" | "red" | "gray"
}

export function SystemNode({ data }: NodeProps<Node<SystemNodeData>>) {
  const statusColors = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    gray: "bg-gray-600",
  }
  return (
    <div className="relative min-w-[160px] rounded-xl border border-[#2a2a2a] bg-[#111] p-4 shadow-lg transition-colors hover:border-[#7c3aed]">
      <Handle type="target" position={Position.Left} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-2">
        {data.emoji && <span className="text-lg">{data.emoji}</span>}
        <span className="text-[13px] font-semibold text-white">{data.label}</span>
        {data.status && (
          <span className={`ml-auto h-2 w-2 shrink-0 rounded-full ${statusColors[data.status]}`} />
        )}
      </div>
      {data.metrics && data.metrics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.metrics.map((m) => (
            <span key={m.label} className="inline-flex items-center gap-1 rounded-md bg-[#1a1a1a] px-2 py-0.5 text-[11px]">
              <span className="text-gray-400">{m.label}</span>
              <span className="font-medium text-white">{m.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- StageNode ---------- */
type StageNodeData = {
  label: string
  count: number
  track?: "build" | "sell"
}

export function StageNode({ data }: NodeProps<Node<StageNodeData>>) {
  const hasItems = data.count > 0
  const barColor = data.track === "sell" ? "bg-emerald-500" : "bg-[#7c3aed]"
  return (
    <div className="relative min-w-[130px] overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111] shadow-lg transition-colors hover:border-[#7c3aed]">
      <div className={`h-1 w-full ${hasItems ? barColor : "bg-gray-700"}`} />
      <Handle type="target" position={Position.Left} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <div className="p-3 text-center">
        <div className="text-2xl font-bold text-white">{data.count}</div>
        <div className="mt-1 text-[11px] text-gray-400">{data.label}</div>
      </div>
    </div>
  )
}

/* ---------- HubNode ---------- */
type HubNodeData = {
  label: string
  emoji?: string
  subtitle?: string
}

export function HubNode({ data }: NodeProps<Node<HubNodeData>>) {
  return (
    <div className="relative min-w-[160px] rounded-xl border-2 border-[#7c3aed] bg-[#111] p-5 shadow-[0_0_24px_rgba(124,58,237,0.15)] transition-shadow hover:shadow-[0_0_32px_rgba(124,58,237,0.3)]">
      <Handle type="target" position={Position.Top} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <div className="text-center">
        {data.emoji && <div className="text-3xl mb-1">{data.emoji}</div>}
        <div className="text-[14px] font-bold text-white">{data.label}</div>
        {data.subtitle && <div className="mt-0.5 text-[11px] text-gray-400">{data.subtitle}</div>}
      </div>
    </div>
  )
}

/* ---------- MetricNode ---------- */
type MetricNodeData = {
  value: string
  label: string
  trend?: "up" | "down" | "flat"
}

export function MetricNode({ data }: NodeProps<Node<MetricNodeData>>) {
  const trendIcon = { up: "↑", down: "↓", flat: "→" }
  const trendColor = { up: "text-green-400", down: "text-red-400", flat: "text-gray-400" }
  return (
    <div className="relative min-w-[130px] rounded-xl border border-[#2a2a2a] bg-[#111] p-4 text-center shadow-lg transition-colors hover:border-[#7c3aed]">
      <Handle type="target" position={Position.Top} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-[#7c3aed] !border-[#080808] !w-2 !h-2" />
      <div className="flex items-center justify-center gap-1">
        <span className="text-2xl font-bold text-white">{data.value}</span>
        {data.trend && (
          <span className={`text-sm ${trendColor[data.trend]}`}>{trendIcon[data.trend]}</span>
        )}
      </div>
      <div className="mt-1 text-[11px] text-gray-400">{data.label}</div>
    </div>
  )
}

/* ---------- AgentNode (premium card for ecosystem diagram) ---------- */
type AgentNodeData = {
  emoji: string
  name: string
  role: string
  tier: "hub" | "tier1" | "tier2"
  status?: "green" | "amber" | "red" | "gray"
  model?: string
}

const tierStyles = {
  hub: {
    wrapper: "min-w-[180px] border-2 border-[#7c3aed] bg-gradient-to-b from-[#1a1030] to-[#111] shadow-[0_0_40px_rgba(124,58,237,0.25)]",
    emoji: "text-4xl",
    name: "text-[16px]",
    glow: true,
  },
  tier1: {
    wrapper: "min-w-[150px] border border-[#7c3aed]/40 bg-gradient-to-b from-[#161122] to-[#0e0e0e]",
    emoji: "text-2xl",
    name: "text-[13px]",
    glow: false,
  },
  tier2: {
    wrapper: "min-w-[130px] border border-[#2a2a2a] bg-[#0e0e0e]",
    emoji: "text-xl",
    name: "text-[12px]",
    glow: false,
  },
}

const statusGlow: Record<string, string> = {
  green: "shadow-[0_0_8px_rgba(34,197,94,0.4)]",
  amber: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  red: "shadow-[0_0_8px_rgba(239,68,68,0.4)]",
  gray: "",
}

const statusBorder: Record<string, string> = {
  green: "border-green-500",
  amber: "border-amber-500",
  red: "border-red-500",
  gray: "border-gray-600",
}

const statusBg: Record<string, string> = {
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  gray: "bg-gray-600",
}

export function AgentNode({ data }: NodeProps<Node<AgentNodeData>>) {
  const style = tierStyles[data.tier]
  const status = data.status || "gray"

  return (
    <div
      className={`relative rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(124,58,237,0.3)] ${style.wrapper}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#7c3aed] !border-[#080808] !w-2.5 !h-2.5 !-top-1" />
      <Handle type="source" position={Position.Bottom} className="!bg-[#7c3aed] !border-[#080808] !w-2.5 !h-2.5 !-bottom-1" />

      {/* Status ring around emoji */}
      <div className="flex justify-center mb-2">
        <div className={`rounded-full border-2 p-2 ${statusBorder[status]} ${statusGlow[status]}`}>
          <span className={style.emoji}>{data.emoji}</span>
        </div>
      </div>

      {/* Name */}
      <div className={`font-bold text-white ${style.name}`}>{data.name}</div>

      {/* Role badge */}
      <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-2.5 py-0.5">
        <span className={`h-1.5 w-1.5 rounded-full ${statusBg[status]}`} />
        <span className="text-[10px] font-medium text-gray-300">{data.role}</span>
      </div>

      {/* Model chip (hub + tier1 only) */}
      {data.model && data.tier !== "tier2" && (
        <div className="mt-1.5 text-[9px] text-gray-500 font-mono">{data.model}</div>
      )}

      {/* Subtle pulse for hub */}
      {style.glow && (
        <div className="absolute inset-0 rounded-2xl animate-pulse opacity-10 border-2 border-[#7c3aed] pointer-events-none" />
      )}
    </div>
  )
}
