"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useAgents, type Agent } from "@/hooks/use-agents"

function statusRing(status: string) {
  switch (status) {
    case "active": return "ring-status-active/60 ring-2"
    case "running": return "ring-status-warning/60 ring-2 animate-pulse"
    case "error": return "ring-status-error/60 ring-2"
    default: return "ring-status-idle/40 ring-1"
  }
}

function statusBadgeStyle(status: string) {
  switch (status) {
    case "active": return "bg-status-active/10 text-status-active border-status-active/25"
    case "running": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "error": return "bg-status-error/10 text-status-error border-status-error/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

export default function AgentsPage() {
  const { agents, isLoading } = useAgents()
  const [selected, setSelected] = useState<Agent | null>(null)

  const activeCount = agents.filter((a) => a.status === "active" || a.status === "running").length

  return (
    <div className="flex flex-col p-6">
      {/* Summary bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Agents</h1>
        <div className="flex items-center gap-4">
          <span className="text-meta text-text-secondary">
            {agents.length} total
          </span>
          <span className="text-meta text-status-active">
            {activeCount} active
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="py-20 text-center text-meta text-text-muted">No agents found</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelected(agent)}
              className="flex flex-col items-center gap-3 rounded-[12px] border border-border bg-surface p-5 text-left transition-colors hover:bg-surface-hover hover:border-border-strong cursor-pointer"
            >
              {/* Emoji with status ring */}
              <div
                className={`flex size-14 items-center justify-center rounded-full bg-surface ${statusRing(agent.status)}`}
              >
                <span className="text-2xl">{agent.emoji || "🤖"}</span>
              </div>

              {/* Name */}
              <span className="text-card-title text-text-primary text-center">
                {agent.name}
              </span>

              {/* Vibe / role */}
              {agent.vibe && (
                <p className="text-meta text-text-secondary text-center line-clamp-2">
                  {agent.vibe}
                </p>
              )}

              {/* Creature + model badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {agent.creature && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 border border-border text-text-muted"
                  >
                    {agent.creature}
                  </Badge>
                )}
                {agent.model && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 border border-violet/30 text-violet-light"
                  >
                    {agent.model}
                  </Badge>
                )}
              </div>

              {/* Status badge */}
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 h-4 border ${statusBadgeStyle(agent.status)}`}
              >
                {agent.status}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Agent detail drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-[#080808] border-border">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-12 items-center justify-center rounded-full bg-surface ${statusRing(selected.status)}`}
                  >
                    <span className="text-xl">{selected.emoji || "🤖"}</span>
                  </div>
                  <div>
                    <SheetTitle className="text-text-primary">{selected.name}</SheetTitle>
                    <SheetDescription className="text-text-secondary">
                      {selected.vibe || selected.slug || "Agent"}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-4 px-4">
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 rounded-[12px] border border-border bg-surface p-4">
                  <div>
                    <span className="text-label text-text-muted block mb-1">Status</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 border ${statusBadgeStyle(selected.status)}`}
                    >
                      {selected.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-label text-text-muted block mb-1">Creature</span>
                    <span className="text-meta text-text-primary">{selected.creature || "—"}</span>
                  </div>
                  <div>
                    <span className="text-label text-text-muted block mb-1">Model</span>
                    <span className="text-meta text-violet-light">{selected.model || "—"}</span>
                  </div>
                  <div>
                    <span className="text-label text-text-muted block mb-1">Slug</span>
                    <span className="text-meta text-text-primary font-mono">{selected.slug || "—"}</span>
                  </div>
                </div>

                {/* Latest digest */}
                {selected.latestDigest && (
                  <div className="rounded-[12px] border border-border bg-surface p-4">
                    <span className="text-label text-text-muted block mb-2">Latest Digest</span>
                    <ScrollArea className="h-[300px]">
                      <pre className="text-meta text-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
                        {selected.latestDigest}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
