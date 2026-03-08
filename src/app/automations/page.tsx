"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCron, type CronJob } from "@/hooks/use-cron"

function humanCron(expr: string | undefined | null): string {
  if (!expr || typeof expr !== "string") return "—"
  if (expr.startsWith("once:")) return `One-time: ${new Date(expr.slice(5)).toLocaleString()}`
  const parts = expr.split(" ")
  if (parts.length !== 5) return expr

  const [min, hour, dom, mon, dow] = parts

  if (min.startsWith("*/") && hour === "*") return `Every ${min.slice(2)} minutes`
  if (min === "0" && hour.startsWith("*/")) return `Every ${hour.slice(2)} hours`
  if (min === "0" && hour !== "*" && dom === "*") {
    const h = parseInt(hour)
    const ampm = h >= 12 ? "PM" : "AM"
    const h12 = h % 12 || 12
    if (dow !== "*") return `${h12}:00 ${ampm} on weekdays`
    return `Daily at ${h12}:00 ${ampm}`
  }
  return expr
}

function statusBadgeStyle(status: string) {
  switch (status) {
    case "ok": return "bg-status-active/10 text-status-active border-status-active/25"
    case "warning": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "error": return "bg-status-error/10 text-status-error border-status-error/25"
    case "disabled": return "bg-status-idle/10 text-status-idle border-status-idle/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function groupJobsByAgent(jobs: CronJob[]): Record<string, CronJob[]> {
  const groups: Record<string, CronJob[]> = {}
  for (const job of jobs) {
    const parts = job.name.split("-")
    const agent = parts.length > 1 ? parts.slice(0, -1).join("-") : "general"
    if (!groups[agent]) groups[agent] = []
    groups[agent].push(job)
  }
  return groups
}

export default function AutomationsPage() {
  const { jobs, isLoading } = useCron()

  const enabledCount = jobs.filter((j) => j.enabled !== false).length
  const disabledCount = jobs.length - enabledCount
  const grouped = groupJobsByAgent(jobs)

  return (
    <div className="flex flex-col p-6">
      {/* Summary bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Automations</h1>
        <div className="flex items-center gap-4">
          <span className="text-meta text-text-secondary">{jobs.length} total</span>
          <span className="text-meta text-status-active">{enabledCount} enabled</span>
          <span className="text-meta text-text-muted">{disabledCount} disabled</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading automations...</div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center text-meta text-text-muted">No cron jobs found</div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([group, groupJobs]) => (
            <div key={group}>
              <h2 className="text-label text-text-muted mb-3">{group}</h2>
              <div className="rounded-[14px] border border-border bg-surface overflow-hidden">
                <div className="divide-y divide-border">
                  {groupJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-hover"
                    >
                      {/* Enabled indicator */}
                      <div
                        className={`size-2 shrink-0 rounded-full ${
                          job.enabled !== false ? "bg-status-active" : "bg-status-idle"
                        }`}
                      />

                      {/* Name */}
                      <span className="text-meta font-semibold text-text-primary min-w-[160px]">
                        {job.name}
                      </span>

                      {/* Cron expression with human-readable tooltip */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-meta text-text-secondary font-mono cursor-help">
                            {job.schedule}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{humanCron(job.schedule)}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Timezone */}
                      {job.timezone && (
                        <span className="text-[11px] text-text-muted hidden sm:block">
                          {job.timezone}
                        </span>
                      )}

                      <div className="flex-1" />

                      {/* Enabled toggle visual */}
                      <div
                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                          job.enabled !== false ? "bg-status-active/25" : "bg-status-idle/15"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 size-4 rounded-full transition-all ${
                            job.enabled !== false
                              ? "left-[18px] bg-status-active"
                              : "left-0.5 bg-status-idle"
                          }`}
                        />
                      </div>

                      {/* Status badge */}
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border ${statusBadgeStyle(job.status)}`}
                      >
                        {job.status}
                      </Badge>
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
