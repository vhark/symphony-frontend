"use client"

import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react"

export function DataFlowEdge(props: EdgeProps) {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, data } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <>
      <BaseEdge
        {...props}
        path={edgePath}
        style={{
          stroke: "#7c3aed",
          strokeWidth: 2,
          strokeDasharray: "6 4",
          animation: "dash 1.5s linear infinite",
        }}
      />
      {data?.label && (
        <text>
          <textPath
            href={`#${props.id}`}
            startOffset="50%"
            textAnchor="middle"
            className="fill-gray-400 text-[10px]"
          >
            {String(data.label)}
          </textPath>
        </text>
      )}
      <style>{`@keyframes dash { to { stroke-dashoffset: -20; } }`}</style>
    </>
  )
}

export function DelegationEdge(props: EdgeProps) {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition } = props
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <BaseEdge
      {...props}
      path={edgePath}
      style={{ stroke: "#444", strokeWidth: 1.5 }}
    />
  )
}
