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
