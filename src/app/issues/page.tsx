"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useIssues } from "@/hooks/use-issues"

const PRIORITY_ORDER = ["high", "medium", "low"] as const

function priorityStyle(priority: string) {
  switch (priority) {
    case "high": return "bg-status-error/10 text-status-error border-status-error/25"
    case "medium": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function statusBadgeStyle(status: string) {
  switch (status) {
    case "open": return "bg-status-active/10 text-status-active border-status-active/25"
    case "in-progress": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "closed": return "bg-status-idle/10 text-status-idle border-status-idle/25"
    case "new": return "bg-violet/10 text-violet-light border-violet/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function daysAgo(dateStr: string): string {
  if (!dateStr) return ""
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diff === 0) return "Today"
  if (diff === 1) return "1d ago"
  return `${diff}d ago`
}

export default function IssuesPage() {
  const { issues, isLoading } = useIssues()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filtered = issues.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false
    if (priorityFilter !== "all" && i.priority !== priorityFilter) return false
    return true
  })

  const grouped = PRIORITY_ORDER.map((p) => ({
    priority: p,
    items: filtered.filter((i) => i.priority === p),
  })).filter((g) => g.items.length > 0)

  const statuses = ["all", ...new Set(issues.map((i) => i.status))]
  const priorities = ["all", ...PRIORITY_ORDER]

  return (
    <div className="flex flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Issues</h1>
        <span className="text-meta text-text-secondary">{filtered.length} issues</span>
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-label text-text-muted mr-1">Status</span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? "bg-violet/15 text-violet-light"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="w-px bg-border mx-2" />
        <div className="flex items-center gap-1.5">
          <span className="text-label text-text-muted mr-1">Priority</span>
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                priorityFilter === p
                  ? "bg-violet/15 text-violet-light"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading issues...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-meta text-text-muted">
          No issues — all clear
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ priority, items }) => (
            <div key={priority}>
              <h2 className="text-label text-text-muted mb-3 capitalize">{priority} priority</h2>
              <div className="rounded-[14px] border border-border bg-surface overflow-hidden">
                <div className="divide-y divide-border">
                  {items.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-hover"
                    >
                      {/* Title */}
                      <span className="text-meta font-semibold text-text-primary flex-1 min-w-0 truncate">
                        {issue.title}
                      </span>

                      {/* Status badge */}
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border shrink-0 ${statusBadgeStyle(issue.status)}`}
                      >
                        {issue.status}
                      </Badge>

                      {/* Priority badge */}
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border shrink-0 ${priorityStyle(issue.priority)}`}
                      >
                        {issue.priority}
                      </Badge>

                      {/* Assignee */}
                      <span className="text-[11px] text-text-secondary w-[100px] truncate hidden sm:block">
                        {issue.assignee || "—"}
                      </span>

                      {/* Created / age */}
                      <span className="text-[11px] text-text-muted w-[60px] text-right shrink-0 hidden md:block">
                        {daysAgo(issue.created)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
