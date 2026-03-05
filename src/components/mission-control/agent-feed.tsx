"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAgents } from "@/hooks/use-agents"

function statusDot(status: string) {
  switch (status) {
    case "completed": return "bg-status-active"
    case "running": return "bg-status-warning animate-pulse"
    case "error": return "bg-status-error"
    case "active": return "bg-status-active"
    default: return "bg-status-idle"
  }
}

function statusBadgeStyle(status: string) {
  switch (status) {
    case "completed": return "bg-status-active/10 text-status-active border-status-active/25"
    case "running": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "error": return "bg-status-error/10 text-status-error border-status-error/25"
    case "active": return "bg-status-active/10 text-status-active border-status-active/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

export function AgentFeed() {
  const { agents, isLoading } = useAgents()

  return (
    <section className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-section-header text-text-primary">Agent Feed</h2>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-status-active animate-pulse" />
          <span className="text-meta text-text-muted">Live</span>
        </div>
      </div>

      <div className="rounded-[14px] border border-border bg-surface">
        <ScrollArea className="h-[520px]">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-meta text-text-muted">Loading agents...</div>
            ) : agents.length === 0 ? (
              <div className="px-4 py-8 text-center text-meta text-text-muted">No agents found</div>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-surface-hover cursor-pointer"
                >
                  {/* Status dot */}
                  <div className="mt-1.5 shrink-0">
                    <div className={`size-2 rounded-full ${statusDot(agent.status)}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {agent.emoji && <span className="text-sm">{agent.emoji}</span>}
                      <span className="text-meta font-semibold text-text-primary">
                        {agent.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border ${statusBadgeStyle(agent.status)}`}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    {agent.vibe && (
                      <p className="text-meta text-text-secondary leading-relaxed truncate">
                        {agent.vibe}
                      </p>
                    )}
                    {agent.latestDigest && (
                      <p className="text-[11px] text-text-muted mt-0.5 truncate">
                        {agent.latestDigest.split("\n")[0]}
                      </p>
                    )}
                    {agent.model && (
                      <span className="text-[11px] text-text-muted mt-0.5 block">
                        {agent.model}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </section>
  )
}
