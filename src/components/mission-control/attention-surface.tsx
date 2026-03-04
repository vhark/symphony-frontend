"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockAttentionItems = [
  {
    id: 1,
    type: "decision",
    title: "Approve Agent Deploy: Content Writer v3",
    description: "Agent passed all safety checks. Ready for production deployment to content pipeline.",
    urgency: "high",
    source: "Agent Framework",
    timestamp: "2 min ago",
    actions: ["Approve", "Review Details"],
  },
  {
    id: 2,
    type: "escalation",
    title: "Sell Pipeline: Acme Corp deal stalled",
    description: "No activity in 7 days. Last contact was demo follow-up email. Revenue at risk: $12,000 ARR.",
    urgency: "medium",
    source: "CRM Agent",
    timestamp: "15 min ago",
    actions: ["Draft Follow-up", "Reassign"],
  },
  {
    id: 3,
    type: "alert",
    title: "Build Sprint: 3 tasks blocked on API dependency",
    description: "External API provider has been down for 2 hours. Affects Payment Integration, Webhook Sync, and Data Export features.",
    urgency: "high",
    source: "Build Tracker",
    timestamp: "1 hr ago",
    actions: ["View Blocked Tasks", "Notify Team"],
  },
]

function urgencyStyle(urgency: string) {
  switch (urgency) {
    case "high": return "bg-status-error/10 text-status-error border-status-error/25"
    case "medium": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function typeIcon(type: string) {
  switch (type) {
    case "decision": return "⚡"
    case "escalation": return "📈"
    case "alert": return "🚨"
    default: return "📋"
  }
}

export function AttentionSurface() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-section-header text-text-primary">Needs Your Attention</h2>
        <Badge variant="outline" className="border-status-warning/30 bg-status-warning/10 text-status-warning text-meta">
          {mockAttentionItems.length} items
        </Badge>
      </div>

      <div className="grid gap-3">
        {mockAttentionItems.map((item) => (
          <Card
            key={item.id}
            className="border-border bg-surface transition-all duration-150 hover:bg-surface-hover hover:border-border-strong cursor-pointer rounded-[14px]"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{typeIcon(item.type)}</span>
                  <CardTitle className="text-card-title text-text-primary">
                    {item.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 h-5 border ${urgencyStyle(item.urgency)}`}
                  >
                    {item.urgency}
                  </Badge>
                  <span className="text-meta text-text-muted">{item.timestamp}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-size text-text-secondary mb-3 leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-meta text-text-muted">
                  via {item.source}
                </span>
                <div className="flex gap-2">
                  {item.actions.map((action, i) => (
                    <Button
                      key={action}
                      variant={i === 0 ? "default" : "outline"}
                      size="sm"
                      className={
                        i === 0
                          ? "bg-violet hover:bg-violet-light text-white rounded-[10px] h-8 text-meta"
                          : "border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-[10px] h-8 text-meta"
                      }
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
