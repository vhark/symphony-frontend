"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSellPipeline } from "@/hooks/use-sell-pipeline"

const SELL_STAGES = ["Attract", "Capture", "Nurture", "Close", "Implement", "Succeed"] as const

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`
  return `$${value}`
}

export default function SellPage() {
  const { deals, isLoading } = useSellPipeline()

  const stageGroups = SELL_STAGES.map((stage) => {
    const items = deals.filter((d) => d.stage === stage)
    const totalValue = items.reduce((sum, d) => sum + (d.value ?? 0), 0)
    return { stage, items, totalValue }
  })

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-page-title text-text-primary">Sell Pipeline</h1>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stageGroups.map(({ stage, items, totalValue }) => (
            <div key={stage} className="flex flex-col">
              {/* Column header */}
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-label text-text-muted">{stage}</span>
                  <span className="text-[11px] text-text-muted">{items.length}</span>
                </div>
                {totalValue > 0 && (
                  <span className="text-[11px] text-violet-light">
                    {formatCurrency(totalValue)}
                  </span>
                )}
              </div>

              {/* Column */}
              <div className="flex-1 rounded-[14px] border border-border bg-surface/50 p-2">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="flex flex-col gap-2">
                    {items.length === 0 ? (
                      <div className="px-2 py-8 text-center text-[11px] text-text-muted">
                        No deals
                      </div>
                    ) : (
                      items.map((deal) => (
                        <div
                          key={deal.id}
                          className={`rounded-[12px] border p-3 transition-colors hover:bg-surface-hover cursor-grab bg-surface ${
                            deal.status === "stalled"
                              ? "border-status-warning/50 hover:border-status-warning/70"
                              : "border-border hover:border-border-strong"
                          }`}
                        >
                          {/* Name */}
                          <p className="text-meta font-semibold text-text-primary mb-1 leading-snug">
                            {deal.name}
                          </p>

                          {/* Company */}
                          {deal.company && (
                            <p className="text-[11px] text-text-secondary mb-2">
                              {deal.company}
                            </p>
                          )}

                          {/* Deal value */}
                          <span className="text-meta font-semibold text-violet-light block mb-2">
                            {formatCurrency(deal.value)}
                          </span>

                          {/* Meta */}
                          <div className="flex flex-col gap-0.5">
                            {deal.owner && (
                              <span className="text-[11px] text-text-secondary truncate">
                                {deal.owner}
                              </span>
                            )}
                            {deal.daysInStage ? (
                              <span className="text-[11px] text-text-muted">
                                {deal.daysInStage}d in stage
                              </span>
                            ) : null}
                          </div>

                          {/* ICP Match badge */}
                          {deal.icpMatch && (
                            <Badge
                              variant="outline"
                              className="mt-2 text-[10px] px-1.5 py-0 h-4 border border-violet/30 text-violet-light"
                            >
                              ICP: {deal.icpMatch}
                            </Badge>
                          )}
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
