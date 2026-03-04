import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockAgentActivity = [
  {
    id: 1,
    agent: "Content Writer",
    action: "Published blog post: 'AI Agent Best Practices'",
    status: "completed",
    timestamp: "1 min ago",
  },
  {
    id: 2,
    agent: "SEO Analyzer",
    action: "Running keyword analysis for Q2 content plan",
    status: "running",
    timestamp: "3 min ago",
  },
  {
    id: 3,
    agent: "CRM Sync",
    action: "Synced 24 new contacts from inbound forms",
    status: "completed",
    timestamp: "8 min ago",
  },
  {
    id: 4,
    agent: "Code Reviewer",
    action: "Reviewing PR #142: Auth middleware refactor",
    status: "running",
    timestamp: "12 min ago",
  },
  {
    id: 5,
    agent: "Deploy Bot",
    action: "Failed: staging deploy — test suite error",
    status: "error",
    timestamp: "18 min ago",
  },
  {
    id: 6,
    agent: "Data Pipeline",
    action: "Processed 12,847 events from analytics stream",
    status: "completed",
    timestamp: "25 min ago",
  },
]

function statusDot(status: string) {
  switch (status) {
    case "completed": return "bg-status-active"
    case "running": return "bg-status-warning animate-pulse"
    case "error": return "bg-status-error"
    default: return "bg-status-idle"
  }
}

function statusBadgeStyle(status: string) {
  switch (status) {
    case "completed": return "bg-status-active/10 text-status-active border-status-active/25"
    case "running": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "error": return "bg-status-error/10 text-status-error border-status-error/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

export function AgentFeed() {
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
            {mockAgentActivity.map((entry) => (
              <div
                key={entry.id}
                className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-surface-hover cursor-pointer"
              >
                {/* Status dot */}
                <div className="mt-1.5 shrink-0">
                  <div className={`size-2 rounded-full ${statusDot(entry.status)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-meta font-semibold text-text-primary">
                      {entry.agent}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 border ${statusBadgeStyle(entry.status)}`}
                    >
                      {entry.status}
                    </Badge>
                  </div>
                  <p className="text-meta text-text-secondary leading-relaxed truncate">
                    {entry.action}
                  </p>
                  <span className="text-[11px] text-text-muted mt-0.5 block">
                    {entry.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  )
}
