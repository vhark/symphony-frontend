"use client"

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { SystemNode, StageNode, HubNode, MetricNode, AgentNode } from "./custom-nodes"
import { DataFlowEdge, DelegationEdge } from "./custom-edges"

const nodeTypes = {
  system: SystemNode,
  stage: StageNode,
  hub: HubNode,
  metric: MetricNode,
  agent: AgentNode,
}

const edgeTypes = {
  dataflow: DataFlowEdge,
  delegation: DelegationEdge,
}

interface FlowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  fitView?: boolean
}

export function FlowCanvas({ nodes, edges, fitView = true }: FlowCanvasProps) {
  return (
    <div className="h-full w-full" style={{ background: "#080808" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={fitView}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "dataflow" }}
        nodesDraggable={true}
        nodesConnectable={false}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} color="#1a1a1a" gap={20} size={1} />
        <MiniMap
          style={{ background: "#111" }}
          nodeColor="#333"
          maskColor="rgba(8,8,8,0.8)"
          pannable
          zoomable
        />
        <Controls
          showInteractive={false}
          style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 12 }}
        />
      </ReactFlow>
    </div>
  )
}
