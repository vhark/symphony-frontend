"use client"

import { Badge } from "@/components/ui/badge"
import { useContent } from "@/hooks/use-content"

function statusBadgeStyle(status: string) {
  switch (status) {
    case "Published": return "bg-status-active/10 text-status-active border-status-active/25"
    case "Approved": return "bg-violet/10 text-violet-light border-violet/25"
    case "In Review": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "Draft": return "bg-status-idle/10 text-status-idle border-status-idle/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function typeIcon(type: string): string {
  switch (type.toLowerCase()) {
    case "blog": return "📝"
    case "video": return "🎬"
    case "email": return "📧"
    case "case study": return "📊"
    case "social": return "📱"
    default: return "📄"
  }
}

export default function ContentPage() {
  const { items, isLoading } = useContent()

  const statusCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Content Queue</h1>
        <div className="flex items-center gap-4">
          <span className="text-meta text-text-secondary">{items.length} items</span>
          {statusCounts["Draft"] && (
            <span className="text-meta text-text-muted">{statusCounts["Draft"]} drafts</span>
          )}
          {statusCounts["Published"] && (
            <span className="text-meta text-status-active">{statusCounts["Published"]} published</span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading content...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-meta text-text-muted">No content items found</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-[12px] border border-border bg-surface p-4 transition-colors hover:bg-surface-hover hover:border-border-strong"
            >
              {/* Type icon + title */}
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0">{typeIcon(item.type)}</span>
                <p className="text-meta font-semibold text-text-primary leading-snug">
                  {item.title}
                </p>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-4 border ${statusBadgeStyle(item.status)}`}
                >
                  {item.status}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 border border-border text-text-muted"
                >
                  {item.type}
                </Badge>
              </div>

              {/* Agent */}
              {item.agent && (
                <span className="text-[11px] text-text-secondary">
                  {item.agent}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
