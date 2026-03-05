"use client"

import { Badge } from "@/components/ui/badge"
import { useRocks } from "@/hooks/use-rocks"
import { useScorecard } from "@/hooks/use-scorecard"

function statusColor(status: string) {
  switch (status) {
    case "on-track": return "bg-status-active/15 text-status-active border-status-active/30"
    case "at-risk": return "bg-status-warning/15 text-status-warning border-status-warning/30"
    case "off-track": return "bg-status-error/15 text-status-error border-status-error/30"
    default: return "bg-status-idle/15 text-status-idle border-status-idle/30"
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "on-track": return "On Track"
    case "at-risk": return "At Risk"
    case "off-track": return "Off Track"
    default: return "Unknown"
  }
}

function trendIcon(trend: string) {
  return trend === "up" ? "↑" : trend === "down" ? "↓" : "→"
}

function trendColor(trend: string) {
  return trend === "up" ? "text-status-active" : trend === "down" ? "text-status-error" : "text-text-muted"
}

function formatValue(value: number, label: string): string {
  const l = label.toLowerCase()
  if (l.includes("revenue") || l.includes("arr") || l.includes("mrr")) {
    return value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`
  }
  if (l.includes("velocity")) return `${value} pts`
  return String(value)
}

function formatTarget(target: number, label: string): string {
  const l = label.toLowerCase()
  if (l.includes("revenue") || l.includes("arr") || l.includes("mrr")) {
    return target >= 1000 ? `$${(target / 1000).toFixed(0)}k` : `$${target}`
  }
  return String(target)
}

export function RocksBar() {
  const { rocks, isLoading: rocksLoading } = useRocks()
  const { scorecard, isLoading: scorecardLoading } = useScorecard()

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-[#080808]/95 backdrop-blur-md">
      <div className="flex items-center gap-6 px-6 py-3">
        {/* Rocks */}
        <div className="flex items-center gap-2">
          <span className="text-label text-text-muted mr-2">ROCKS</span>
          {rocksLoading ? (
            <span className="text-meta text-text-muted">Loading...</span>
          ) : (
            rocks.map((rock) => (
              <div
                key={rock.id}
                className="group flex items-center gap-2.5 rounded-[12px] border border-border bg-surface px-3 py-2 transition-colors hover:bg-surface-hover hover:border-border-strong cursor-pointer"
              >
                <span className="text-meta text-text-primary font-medium max-w-[120px] truncate">
                  {rock.title}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-5 border ${statusColor(rock.status)}`}
                >
                  {statusLabel(rock.status)}
                </Badge>
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border" />

        {/* Scorecard */}
        <div className="flex items-center gap-4 ml-auto">
          {scorecardLoading ? (
            <span className="text-meta text-text-muted">Loading...</span>
          ) : (
            scorecard.map((metric) => (
              <div key={metric.id ?? metric.label} className="flex flex-col items-center gap-0.5 min-w-[72px]">
                <span className="text-label text-text-muted">{metric.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-card-title text-text-primary font-mono">
                    {formatValue(metric.value, metric.label)}
                  </span>
                  <span className={`text-xs font-medium ${trendColor(metric.trend)}`}>
                    {trendIcon(metric.trend)}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted">/ {formatTarget(metric.target, metric.label)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
