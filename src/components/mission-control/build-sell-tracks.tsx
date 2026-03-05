"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBuildPipeline } from "@/hooks/use-build-pipeline"
import { useSellPipeline } from "@/hooks/use-sell-pipeline"

function buildStatusStyle(status: string) {
  switch (status) {
    case "in-progress": return "bg-status-active/10 text-status-active border-status-active/25"
    case "blocked": return "bg-status-error/10 text-status-error border-status-error/25"
    case "done": return "bg-violet/10 text-violet-light border-violet/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function sellStatusStyle(status: string) {
  switch (status) {
    case "qualified": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "negotiation": return "bg-violet/10 text-violet-light border-violet/25"
    case "closed-won": return "bg-status-active/10 text-status-active border-status-active/25"
    case "closed-lost": return "bg-status-error/10 text-status-error border-status-error/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
  return `$${value}`
}

export function BuildSellTracks() {
  const { projects, isLoading: buildLoading } = useBuildPipeline()
  const { deals, isLoading: sellLoading } = useSellPipeline()

  const totalPipeline = deals.reduce((sum, d) => sum + (d.value ?? 0), 0)
  const wonDeals = deals.filter((d) => d.status === "closed-won")
  const winRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0
  const forecast = deals
    .filter((d) => d.status !== "closed-won" && d.status !== "closed-lost")
    .reduce((sum, d) => sum + (d.value ?? 0) * (d.probability / 100), 0)

  const completedProjects = projects.filter((p) => p.status === "done" || p.progress >= 100).length
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0

  return (
    <section>
      <h2 className="text-section-header text-text-primary mb-4">Build & Sell</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Build Track */}
        <div className="space-y-3">
          <Card className="border-border bg-surface rounded-[14px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-card-title text-text-primary flex items-center gap-2">
                <span>🔨</span> Build Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-label text-text-muted">Progress</span>
                  <span className="text-card-title text-text-primary font-mono">{avgProgress}%</span>
                  <span className="text-[10px] text-text-muted">avg across items</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-text-muted">Items</span>
                  <span className="text-card-title text-text-primary font-mono">{completedProjects}/{projects.length}</span>
                  <span className="text-[10px] text-text-muted">completed</span>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet transition-all"
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {buildLoading ? (
            <div className="text-meta text-text-muted px-4 py-3">Loading build items...</div>
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                className="border-border bg-surface transition-all hover:bg-surface-hover hover:border-border-strong cursor-pointer rounded-[12px]"
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-meta font-medium text-text-primary">{project.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-5 border ${buildStatusStyle(project.status)}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>{project.assignee}</span>
                    {project.dueDate && <span>Due {project.dueDate}</span>}
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet/70 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sell Track */}
        <div className="space-y-3">
          <Card className="border-border bg-surface rounded-[14px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-card-title text-text-primary flex items-center gap-2">
                <span>💰</span> Sell Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-label text-text-muted">Pipeline</span>
                  <span className="text-card-title text-text-primary font-mono">{formatCurrency(totalPipeline)}</span>
                  <span className="text-[10px] text-text-muted">total value</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-text-muted">Win Rate</span>
                  <span className="text-card-title text-text-primary font-mono">{winRate}%</span>
                  <span className="text-[10px] text-text-muted">{deals.length} deals</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-text-muted">Forecast</span>
                <span className="text-meta font-mono text-status-active font-medium">{formatCurrency(forecast)}</span>
              </div>
            </CardContent>
          </Card>

          {sellLoading ? (
            <div className="text-meta text-text-muted px-4 py-3">Loading deals...</div>
          ) : (
            deals.map((deal) => (
              <Card
                key={deal.id}
                className="border-border bg-surface transition-all hover:bg-surface-hover hover:border-border-strong cursor-pointer rounded-[12px]"
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-meta font-medium text-text-primary">{deal.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-5 border ${sellStatusStyle(deal.status)}`}
                    >
                      {deal.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>{deal.stage}</span>
                    <span className="font-mono font-medium text-text-secondary">{formatCurrency(deal.value)}</span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-status-active/60 transition-all"
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
