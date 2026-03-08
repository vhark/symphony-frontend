"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  useSellPipeline,
  type SellDeal,
  type DealFormData,
} from "@/hooks/use-sell-pipeline"

const SELL_STAGES = ["Attract", "Capture", "Nurture", "Close", "Implement", "Succeed"] as const
const STATUSES = ["Active", "Stalled", "Lost", "Won"] as const
const LEAD_SOURCES = ["Inbound", "Outbound", "Referral", "Partner", "Event", "Organic"] as const

const STAGE_PROBABILITY: Record<string, number> = {
  Attract: 5,
  Capture: 15,
  Nurture: 35,
  Close: 70,
  Implement: 90,
  Succeed: 100,
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`
  return `$${value}`
}

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "active": return "bg-status-active/10 text-status-active border-status-active/25"
    case "stalled": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "lost": return "bg-status-error/10 text-status-error border-status-error/25"
    case "won": return "bg-violet/10 text-violet-light border-violet/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function dealToForm(d: SellDeal): DealFormData {
  return {
    Name: d.name,
    Company: d.company,
    Stage: d.stage,
    Status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
    Owner: d.owner,
    "Deal Value": d.value,
    Timeline: d.timeline,
    "ICP Match": d.icpMatch,
    "Budget Confirmed": d.budgetConfirmed,
    "Decision Maker Identified": d.decisionMakerIdentified ?? false,
    "Lead Source": d.leadSource,
    Notes: d.notes,
  }
}

const emptyForm: DealFormData = {
  Name: "",
  Company: "",
  Stage: "Attract",
  Status: "Active",
  Owner: "",
  "Deal Value": 0,
  Timeline: "",
  "ICP Match": false,
  "Budget Confirmed": false,
  "Decision Maker Identified": false,
  "Lead Source": "Inbound",
  Notes: "",
}

export default function SellPage() {
  const { deals, isLoading, createDeal, updateDeal, deleteDeal } = useSellPipeline()
  const [selected, setSelected] = useState<SellDeal | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<DealFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const sheetOpen = !!selected || isCreating

  function openEdit(deal: SellDeal) {
    setSelected(deal)
    setForm(dealToForm(deal))
    setIsCreating(false)
    setConfirmDelete(false)
  }

  function openCreate() {
    setSelected(null)
    setForm({ ...emptyForm })
    setIsCreating(true)
    setConfirmDelete(false)
  }

  function closeSheet() {
    setSelected(null)
    setIsCreating(false)
    setConfirmDelete(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (isCreating) {
        await createDeal(form)
      } else if (selected) {
        await updateDeal(selected.id, form)
      }
      closeSheet()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    setSaving(true)
    try {
      await deleteDeal(selected.id)
      closeSheet()
    } finally {
      setSaving(false)
    }
  }

  const stageGroups = SELL_STAGES.map((stage) => {
    const items = deals.filter((d) => d.stage === stage)
    const totalValue = items.reduce((sum, d) => sum + (d.value ?? 0), 0)
    return { stage, items, totalValue }
  })

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Sell Pipeline</h1>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={openCreate}
        >
          <Plus className="size-4" />
          New
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stageGroups.map(({ stage, items, totalValue }) => (
            <div key={stage} className="flex flex-col">
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

              <div className="flex-1 rounded-[14px] border border-border bg-surface/50 p-2">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="flex flex-col gap-2">
                    {items.length === 0 ? (
                      <div className="px-2 py-8 text-center text-[11px] text-text-muted">
                        No deals
                      </div>
                    ) : (
                      items.map((deal) => (
                        <button
                          key={deal.id}
                          onClick={() => openEdit(deal)}
                          className={`rounded-[12px] border p-3 transition-colors hover:bg-surface-hover cursor-pointer bg-surface text-left w-full ${
                            deal.status === "stalled"
                              ? "border-status-warning/50 hover:border-status-warning/70"
                              : "border-border hover:border-border-strong"
                          }`}
                        >
                          {/* Name */}
                          <p className="text-meta font-semibold text-text-primary mb-1 leading-snug">
                            {deal.name}
                          </p>

                          {/* Probability bar */}
                          <div className="mb-2">
                            <div className="h-1 w-full rounded-full bg-border">
                              <div
                                className="h-1 rounded-full bg-violet-light transition-all"
                                style={{ width: `${STAGE_PROBABILITY[deal.stage] ?? 0}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-text-muted">
                              {STAGE_PROBABILITY[deal.stage] ?? 0}% probability
                            </span>
                          </div>

                          {/* Company */}
                          {deal.company && (
                            <p className="text-[11px] text-text-secondary mb-1">
                              {deal.company}
                            </p>
                          )}

                          {/* Deal value */}
                          <span className="text-meta font-semibold text-violet-light block mb-2">
                            {formatCurrency(deal.value)}
                          </span>

                          {/* Status badge */}
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-4 border ${statusStyle(deal.status)}`}
                            >
                              {deal.status}
                            </Badge>
                          </div>

                          {/* Meta */}
                          <div className="flex flex-col gap-0.5">
                            {deal.daysInStage ? (
                              <span className="text-[11px] text-text-muted">
                                {deal.daysInStage}d in stage
                              </span>
                            ) : null}
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className={deal.icpMatch ? "text-status-active" : "text-status-error"}>
                                ICP {deal.icpMatch ? "\u2705" : "\u274C"}
                              </span>
                              <span className={deal.budgetConfirmed ? "text-status-active" : "text-status-error"}>
                                Budget {deal.budgetConfirmed ? "\u2705" : "\u274C"}
                              </span>
                            </div>
                            {deal.leadSource && (
                              <span className="text-[11px] text-text-muted">
                                {deal.leadSource}
                              </span>
                            )}
                            {deal.owner && (
                              <span className="text-[11px] text-text-secondary truncate">
                                {deal.owner}
                              </span>
                            )}
                          </div>

                          {/* Notes (2 lines truncated) */}
                          {deal.notes && (
                            <p className="mt-2 text-[11px] text-text-muted line-clamp-2">
                              {deal.notes}
                            </p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-[#080808] border-border">
          <SheetHeader>
            <SheetTitle className="text-text-primary">
              {isCreating ? "New Deal" : "Edit Deal"}
            </SheetTitle>
            <SheetDescription className="text-text-secondary">
              {isCreating
                ? "Add a new deal to the sell pipeline."
                : `Editing: ${selected?.name}`}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="flex flex-col gap-4 px-4 pb-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Name</Label>
                <Input
                  value={form.Name}
                  onChange={(e) => setForm({ ...form, Name: e.target.value })}
                  className="bg-surface border-border text-text-primary"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Company</Label>
                <Input
                  value={form.Company}
                  onChange={(e) => setForm({ ...form, Company: e.target.value })}
                  className="bg-surface border-border text-text-primary"
                />
              </div>

              {/* Stage */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Stage</Label>
                <Select value={form.Stage} onValueChange={(v) => setForm({ ...form, Stage: v })}>
                  <SelectTrigger className="bg-surface border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    {SELL_STAGES.map((s) => (
                      <SelectItem key={s} value={s} className="text-text-primary">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Status</Label>
                <Select value={form.Status} onValueChange={(v) => setForm({ ...form, Status: v })}>
                  <SelectTrigger className="bg-surface border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-text-primary">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Owner */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Owner</Label>
                <Input
                  value={form.Owner}
                  onChange={(e) => setForm({ ...form, Owner: e.target.value })}
                  className="bg-surface border-border text-text-primary"
                />
              </div>

              {/* Deal Value */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Deal Value ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form["Deal Value"]}
                  onChange={(e) => setForm({ ...form, "Deal Value": Number(e.target.value) })}
                  className="bg-surface border-border text-text-primary"
                />
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Timeline</Label>
                <Input
                  type="date"
                  value={form.Timeline}
                  onChange={(e) => setForm({ ...form, Timeline: e.target.value })}
                  className="bg-surface border-border text-text-primary"
                />
              </div>

              {/* Lead Source */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Lead Source</Label>
                <Select value={form["Lead Source"]} onValueChange={(v) => setForm({ ...form, "Lead Source": v })}>
                  <SelectTrigger className="bg-surface border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    {LEAD_SOURCES.map((s) => (
                      <SelectItem key={s} value={s} className="text-text-primary">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Notes</Label>
                <Textarea
                  value={form.Notes}
                  onChange={(e) => setForm({ ...form, Notes: e.target.value })}
                  rows={4}
                  className="bg-surface border-border text-text-primary resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="icpMatch"
                    checked={form["ICP Match"]}
                    onCheckedChange={(v) => setForm({ ...form, "ICP Match": !!v })}
                  />
                  <Label htmlFor="icpMatch" className="text-text-muted cursor-pointer">
                    ICP Match
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="budgetConfirmed"
                    checked={form["Budget Confirmed"]}
                    onCheckedChange={(v) => setForm({ ...form, "Budget Confirmed": !!v })}
                  />
                  <Label htmlFor="budgetConfirmed" className="text-text-muted cursor-pointer">
                    Budget Confirmed
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="decisionMaker"
                    checked={form["Decision Maker Identified"]}
                    onCheckedChange={(v) => setForm({ ...form, "Decision Maker Identified": !!v })}
                  />
                  <Label htmlFor="decisionMaker" className="text-text-muted cursor-pointer">
                    Decision Maker Identified
                  </Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button onClick={handleSave} disabled={saving || !form.Name} className="flex-1">
                  {saving ? "Saving..." : "Save"}
                </Button>
                {!isCreating && selected && (
                  <>
                    {confirmDelete ? (
                      <div className="flex items-center gap-2">
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                          Confirm
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => setConfirmDelete(true)}
                        disabled={saving}
                      >
                        Delete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
