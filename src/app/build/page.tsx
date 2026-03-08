"use client"

import { useState } from "react"
import { Star, Plus } from "lucide-react"
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
  useBuildPipeline,
  type BuildProject,
  type ProjectFormData,
} from "@/hooks/use-build-pipeline"

const BUILD_STAGES = ["Discovery", "Design", "Develop", "Test", "Release", "Iterate"] as const
const TYPES = ["Research", "Feature", "Bug", "Improvement", "Infra"] as const
const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const
const COMPLEXITIES = ["S", "M", "L", "XL"] as const

function priorityStyle(priority: string) {
  switch (priority.toLowerCase()) {
    case "critical": return "bg-status-error/10 text-status-error border-status-error/25"
    case "high": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "medium": return "bg-violet/10 text-violet-light border-violet/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function typeStyle(type: string) {
  switch (type.toLowerCase()) {
    case "bug": return "bg-status-error/10 text-status-error border-status-error/25"
    case "feature": return "bg-status-active/10 text-status-active border-status-active/25"
    case "research": return "bg-violet/10 text-violet-light border-violet/25"
    case "infra": return "bg-status-idle/10 text-status-idle border-status-idle/25"
    default: return "bg-status-warning/10 text-status-warning border-status-warning/25"
  }
}

function projectToForm(p: BuildProject): ProjectFormData {
  return {
    Name: p.name,
    Type: p.type,
    Stage: p.stage,
    Priority: p.priority.charAt(0).toUpperCase() + p.priority.slice(1),
    Owner: p.assignee,
    Complexity: p.complexity,
    "Impact Score": p.impactScore,
    "Target Release Date": p.dueDate,
    Notes: p.notes,
    "Customer Requested": p.customerRequested ?? false,
  }
}

const emptyForm: ProjectFormData = {
  Name: "",
  Type: "Feature",
  Stage: "Discovery",
  Priority: "Medium",
  Owner: "",
  Complexity: "M",
  "Impact Score": 5,
  "Target Release Date": "",
  Notes: "",
  "Customer Requested": false,
}

export default function BuildPage() {
  const { projects, isLoading, createProject, updateProject, deleteProject } = useBuildPipeline()
  const [selected, setSelected] = useState<BuildProject | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState<ProjectFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const sheetOpen = !!selected || isCreating

  function openEdit(project: BuildProject) {
    setSelected(project)
    setForm(projectToForm(project))
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
        await createProject(form)
      } else if (selected) {
        await updateProject(selected.id, form)
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
      await deleteProject(selected.id)
      closeSheet()
    } finally {
      setSaving(false)
    }
  }

  const stageGroups = BUILD_STAGES.map((stage) => ({
    stage,
    items: projects.filter((p) => p.stage === stage),
  }))

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Build Backlog</h1>
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
          {stageGroups.map(({ stage, items }) => (
            <div key={stage} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-label text-text-muted">{stage}</span>
                <span className="text-[11px] text-text-muted">{items.length}</span>
              </div>

              <div className="flex-1 rounded-[14px] border border-border bg-surface/50 p-2">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="flex flex-col gap-2">
                    {items.length === 0 ? (
                      <div className="px-2 py-8 text-center text-[11px] text-text-muted">
                        No items
                      </div>
                    ) : (
                      items.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => openEdit(project)}
                          className="rounded-[12px] border border-border bg-surface p-3 transition-colors hover:bg-surface-hover hover:border-border-strong cursor-pointer text-left w-full"
                        >
                          {/* Name + Customer Requested star */}
                          <div className="flex items-start gap-1 mb-2">
                            <p className="text-meta font-semibold text-text-primary leading-snug flex-1">
                              {project.name}
                            </p>
                            {project.customerRequested && (
                              <Star className="size-3.5 text-status-warning fill-status-warning shrink-0 mt-0.5" />
                            )}
                          </div>

                          {/* Type + Priority badges */}
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {project.type && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 h-4 border ${typeStyle(project.type)}`}
                              >
                                {project.type}
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-4 border ${priorityStyle(project.priority)}`}
                            >
                              {project.priority}
                            </Badge>
                          </div>

                          {/* Meta */}
                          <div className="flex flex-col gap-0.5">
                            {project.complexity && (
                              <span className="text-[11px] text-text-muted">
                                Complexity: {project.complexity}
                              </span>
                            )}
                            {project.impactScore ? (
                              <span className="text-[11px] text-violet-light">
                                Impact: {project.impactScore}/10
                              </span>
                            ) : null}
                            {project.assignee && (
                              <span className="text-[11px] text-text-secondary truncate">
                                {project.assignee}
                              </span>
                            )}
                            {project.dueDate && (
                              <span className="text-[11px] text-text-muted">
                                Due: {project.dueDate}
                              </span>
                            )}
                          </div>

                          {/* Notes (2 lines truncated) */}
                          {project.notes && (
                            <p className="mt-2 text-[11px] text-text-muted line-clamp-2">
                              {project.notes}
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
              {isCreating ? "New Project" : "Edit Project"}
            </SheetTitle>
            <SheetDescription className="text-text-secondary">
              {isCreating
                ? "Add a new item to the build backlog."
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

              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Type</Label>
                <Select value={form.Type} onValueChange={(v) => setForm({ ...form, Type: v })}>
                  <SelectTrigger className="bg-surface border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-text-primary">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stage */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Stage</Label>
                <Select value={form.Stage} onValueChange={(v) => setForm({ ...form, Stage: v })}>
                  <SelectTrigger className="bg-surface border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    {BUILD_STAGES.map((s) => (
                      <SelectItem key={s} value={s} className="text-text-primary">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Priority</Label>
                <Select value={form.Priority} onValueChange={(v) => setForm({ ...form, Priority: v })}>
                  <SelectTrigger className="bg-surface border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="text-text-primary">{p}</SelectItem>
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

              {/* Complexity */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Complexity</Label>
                <Select value={form.Complexity} onValueChange={(v) => setForm({ ...form, Complexity: v })}>
                  <SelectTrigger className="bg-surface border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    {COMPLEXITIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-text-primary">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Impact Score */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Impact Score (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={form["Impact Score"]}
                  onChange={(e) => setForm({ ...form, "Impact Score": Number(e.target.value) })}
                  className="bg-surface border-border text-text-primary"
                />
              </div>

              {/* Target Release Date */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-text-muted">Target Release Date</Label>
                <Input
                  type="date"
                  value={form["Target Release Date"]}
                  onChange={(e) => setForm({ ...form, "Target Release Date": e.target.value })}
                  className="bg-surface border-border text-text-primary"
                />
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

              {/* Customer Requested */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="customerRequested"
                  checked={form["Customer Requested"]}
                  onCheckedChange={(v) => setForm({ ...form, "Customer Requested": !!v })}
                />
                <Label htmlFor="customerRequested" className="text-text-muted cursor-pointer">
                  Customer Requested
                </Label>
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
