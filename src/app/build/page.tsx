"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBuildPipeline } from "@/hooks/use-build-pipeline"

const BUILD_STAGES = ["Discovery", "Design", "Develop", "Test", "Release", "Iterate"] as const

function priorityStyle(priority: string) {
  switch (priority.toLowerCase()) {
    case "critical": return "bg-status-error/10 text-status-error border-status-error/25"
    case "high": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "medium": return "bg-violet/10 text-violet-light border-violet/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

export default function BuildPage() {
  const { projects, isLoading } = useBuildPipeline()

  const stageGroups = BUILD_STAGES.map((stage) => ({
    stage,
    items: projects.filter((p) => p.stage === stage),
  }))

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-page-title text-text-primary">Build Backlog</h1>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stageGroups.map(({ stage, items }) => (
            <div key={stage} className="flex flex-col">
              {/* Column header */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-label text-text-muted">{stage}</span>
                <span className="text-[11px] text-text-muted">{items.length}</span>
              </div>

              {/* Column */}
              <div className="flex-1 rounded-[14px] border border-border bg-surface/50 p-2">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="flex flex-col gap-2">
                    {items.length === 0 ? (
                      <div className="px-2 py-8 text-center text-[11px] text-text-muted">
                        No items
                      </div>
                    ) : (
                      items.map((project) => (
                        <div
                          key={project.id}
                          className="rounded-[12px] border border-border bg-surface p-3 transition-colors hover:bg-surface-hover hover:border-border-strong cursor-grab"
                        >
                          {/* Name */}
                          <p className="text-meta font-semibold text-text-primary mb-2 leading-snug">
                            {project.name}
                          </p>

                          {/* Priority badge */}
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-4 border ${priorityStyle(project.priority)}`}
                            >
                              {project.priority}
                            </Badge>
                          </div>

                          {/* Meta */}
                          <div className="flex flex-col gap-0.5">
                            {project.assignee && (
                              <span className="text-[11px] text-text-secondary truncate">
                                {project.assignee}
                              </span>
                            )}
                            {project.complexity && (
                              <span className="text-[11px] text-text-muted">
                                Complexity: {project.complexity}
                              </span>
                            )}
                            {project.impactScore ? (
                              <span className="text-[11px] text-violet-light">
                                Impact: {project.impactScore}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
