"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEvents } from "@/hooks/use-events"

function levelStyle(level?: string) {
  switch ((level || "").toUpperCase()) {
    case "ERROR": return "bg-status-error/10 text-status-error border-status-error/25"
    case "WARN": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "INFO": return "bg-violet/10 text-violet-light border-violet/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function relativeTime(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  return new Date(ts).toLocaleTimeString()
}

export function ActivityStream() {
  const { events, connected } = useEvents(60)

  return (
    <section className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-section-header text-text-primary">Activity Stream</h2>
        <div className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${connected ? "bg-status-active animate-pulse" : "bg-status-idle"}`} />
          <span className="text-meta text-text-muted">{connected ? "Live" : "Reconnecting..."}</span>
        </div>
      </div>

      <div className="rounded-[14px] border border-border bg-surface">
        <ScrollArea className="h-[480px]">
          <div className="divide-y divide-border">
            {events.length === 0 ? (
              <div className="px-4 py-8 text-center text-meta text-text-muted">
                {connected ? "Waiting for events..." : "Connecting to activity stream..."}
              </div>
            ) : (
              events.map((event, i) => (
                <div key={i} className="flex gap-3 px-4 py-3 hover:bg-surface-hover transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border ${levelStyle(event.level)}`}
                      >
                        {event.level || "LOG"}
                      </Badge>
                      <span className="text-[11px] text-text-muted ml-auto shrink-0">
                        {relativeTime(event.ts)}
                      </span>
                    </div>
                    <p className="text-meta text-text-secondary leading-snug break-words">
                      {event.message}
                    </p>
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
