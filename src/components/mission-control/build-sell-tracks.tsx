import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockBuildProjects = [
  {
    id: 1,
    name: "Auth Middleware Refactor",
    status: "in-progress",
    progress: 70,
    assignee: "Code Reviewer Agent",
    dueDate: "Mar 8",
  },
  {
    id: 2,
    name: "Payment Integration v2",
    status: "blocked",
    progress: 40,
    assignee: "Dev Team",
    dueDate: "Mar 15",
  },
  {
    id: 3,
    name: "Dashboard Analytics",
    status: "in-progress",
    progress: 55,
    assignee: "Data Pipeline Agent",
    dueDate: "Mar 12",
  },
]

const mockSellProjects = [
  {
    id: 1,
    name: "Acme Corp — Enterprise Plan",
    status: "negotiation",
    value: "$12,000",
    stage: "Proposal Sent",
    probability: 65,
  },
  {
    id: 2,
    name: "TechStart Inc — Growth",
    status: "qualified",
    value: "$4,800",
    stage: "Demo Scheduled",
    probability: 40,
  },
  {
    id: 3,
    name: "DataFlow Labs — Custom",
    status: "closed-won",
    value: "$8,400",
    stage: "Closed",
    probability: 100,
  },
]

const buildHealth = { velocity: 34, sprintGoal: 40, completed: 17, total: 24 }
const sellHealth = { pipeline: "$25,200", forecast: "$18,600", winRate: "32%", avgCycle: "18 days" }

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

export function BuildSellTracks() {
  return (
    <section>
      <h2 className="text-section-header text-text-primary mb-4">Build & Sell</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Build Track */}
        <div className="space-y-3">
          {/* Health metrics */}
          <Card className="border-border bg-surface rounded-[14px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-card-title text-text-primary flex items-center gap-2">
                <span>🔨</span> Build Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-label text-text-muted">Velocity</span>
                  <span className="text-card-title text-text-primary font-mono">{buildHealth.velocity} pts</span>
                  <span className="text-[10px] text-text-muted">/ {buildHealth.sprintGoal} goal</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-text-muted">Sprint</span>
                  <span className="text-card-title text-text-primary font-mono">{buildHealth.completed}/{buildHealth.total}</span>
                  <span className="text-[10px] text-text-muted">tasks done</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet transition-all"
                  style={{ width: `${(buildHealth.completed / buildHealth.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Build projects */}
          {mockBuildProjects.map((project) => (
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
                  <span>Due {project.dueDate}</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet/70 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sell Track */}
        <div className="space-y-3">
          {/* Health metrics */}
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
                  <span className="text-card-title text-text-primary font-mono">{sellHealth.pipeline}</span>
                  <span className="text-[10px] text-text-muted">total value</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-text-muted">Win Rate</span>
                  <span className="text-card-title text-text-primary font-mono">{sellHealth.winRate}</span>
                  <span className="text-[10px] text-text-muted">{sellHealth.avgCycle} avg</span>
                </div>
              </div>
              {/* Forecast bar */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-text-muted">Forecast</span>
                <span className="text-meta font-mono text-status-active font-medium">{sellHealth.forecast}</span>
              </div>
            </CardContent>
          </Card>

          {/* Sell projects */}
          {mockSellProjects.map((deal) => (
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
                  <span className="font-mono font-medium text-text-secondary">{deal.value}</span>
                </div>
                {/* Probability bar */}
                <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-status-active/60 transition-all"
                    style={{ width: `${deal.probability}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
