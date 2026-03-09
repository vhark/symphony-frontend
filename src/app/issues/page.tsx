"use client"

import { useState, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  useIssues,
  useCreateIssue,
  useUpdateIssue,
  useDeleteIssue,
  type Issue,
} from "@/hooks/use-issues"

// ── Constants ──────────────────────────────────────────────────────

const PRIORITY_ORDER = ["critical", "high", "normal", "low"] as const
const STATUSES = ["all", "new", "open", "pending", "closed"] as const
const PRIORITIES = ["all", "critical", "high", "normal", "low"] as const
const GROUPS = [
  { label: "All", value: "all" },
  { label: "Support", value: "Support", id: 2 },
  { label: "Sales", value: "Sales", id: 3 },
  { label: "Technical", value: "Technical", id: 4 },
  { label: "Internal", value: "Internal", id: 5 },
] as const
const TYPES = ["all", "Bug", "Feature", "Question", "Task", "Improvement", "Onboarding"] as const
const PRODUCT_AREAS = ["", "Grownetics OS", "CropVision", "Unity", "GP-10", "Symphony OS", "Infrastructure", "General"] as const
const IMPACTS = ["", "Critical", "High", "Medium", "Low"] as const
const SOURCES = ["Manual", "Email", "Chat", "Form", "API", "Agent Triage"] as const

const GROUP_ID_MAP: Record<string, number> = { Support: 2, Sales: 3, Technical: 4, Internal: 5 }
const PRIORITY_ID_MAP: Record<string, number> = { low: 1, normal: 2, high: 3, critical: 4 }

// ── Badge Styles ───────────────────────────────────────────────────

function priorityStyle(priority: string) {
  switch (priority) {
    case "critical": return "bg-red-500/10 text-red-400 border-red-500/25"
    case "high": return "bg-status-error/10 text-status-error border-status-error/25"
    case "normal": return "bg-status-warning/10 text-status-warning border-status-warning/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function statusBadgeStyle(status: string) {
  switch (status) {
    case "new": return "bg-violet-500/10 text-violet-400 border-violet-500/25"
    case "open": return "bg-status-active/10 text-status-active border-status-active/25"
    case "pending": case "pending-reminder": case "pending-close":
      return "bg-status-warning/10 text-status-warning border-status-warning/25"
    case "closed": case "merged":
      return "bg-status-idle/10 text-status-idle border-status-idle/25"
    default: return "bg-status-idle/10 text-status-idle border-status-idle/25"
  }
}

function typeBadgeStyle(type: string) {
  switch (type) {
    case "Bug": return "bg-red-500/10 text-red-400 border-red-500/25"
    case "Feature": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
    case "Question": return "bg-blue-500/10 text-blue-400 border-blue-500/25"
    case "Task": return "bg-amber-500/10 text-amber-400 border-amber-500/25"
    case "Improvement": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/25"
    case "Onboarding": return "bg-purple-500/10 text-purple-400 border-purple-500/25"
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/25"
  }
}

// ── Filter Button ──────────────────────────────────────────────────

function FilterBtn({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors capitalize ${
        active
          ? "bg-violet-500/15 text-violet-400"
          : "text-text-muted hover:text-text-secondary"
      }`}
    >
      {label}
    </button>
  )
}

// ── Main Page ──────────────────────────────────────────────────────

export default function IssuesPage() {
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const { issues, isLoading, mutate } = useIssues(debouncedSearch || undefined)
  const { create, loading: creating } = useCreateIssue()
  const { update, loading: updating } = useUpdateIssue()
  const { remove, loading: deleting } = useDeleteIssue()

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [groupFilter, setGroupFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // UI state
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Edit state for detail sheet
  const [editTitle, setEditTitle] = useState("")
  const [editStatus, setEditStatus] = useState("")
  const [editPriority, setEditPriority] = useState("")
  const [editGroup, setEditGroup] = useState("")
  const [editType, setEditType] = useState("")
  const [editProductArea, setEditProductArea] = useState("")
  const [editImpact, setEditImpact] = useState("")

  // Create form state
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newGroup, setNewGroup] = useState("2")
  const [newPriority, setNewPriority] = useState("2")
  const [newType, setNewType] = useState("")
  const [newProductArea, setNewProductArea] = useState("")
  const [newImpact, setNewImpact] = useState("")

  // Search debounce
  const handleSearch = useCallback((value: string) => {
    setSearchInput(value)
    const timeout = setTimeout(() => setDebouncedSearch(value), 400)
    return () => clearTimeout(timeout)
  }, [])

  // Filter issues
  const filtered = useMemo(() => {
    return issues.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false
      if (priorityFilter !== "all" && i.priority !== priorityFilter) return false
      if (groupFilter !== "all" && i.group !== groupFilter) return false
      if (typeFilter !== "all" && i.type !== typeFilter) return false
      return true
    })
  }, [issues, statusFilter, priorityFilter, groupFilter, typeFilter])

  // Group by priority
  const grouped = useMemo(() => {
    return PRIORITY_ORDER.map((p) => ({
      priority: p,
      items: filtered.filter((i) => i.priority === p),
    })).filter((g) => g.items.length > 0)
  }, [filtered])

  // Open detail sheet
  function openDetail(issue: Issue) {
    setSelectedIssue(issue)
    setEditTitle(issue.title)
    setEditStatus(issue.status)
    setEditPriority(issue.priority)
    setEditGroup(issue.group)
    setEditType(issue.type)
    setEditProductArea(issue.productArea)
    setEditImpact(issue.impact)
    setSheetOpen(true)
  }

  // Save edits
  async function handleSave() {
    if (!selectedIssue) return
    await update(selectedIssue.id, {
      title: editTitle,
      status: editStatus,
      priority: editPriority,
      group: editGroup,
      type: editType,
      productArea: editProductArea,
      impact: editImpact,
    })
    setSheetOpen(false)
    mutate()
  }

  // Delete
  async function handleDelete() {
    if (!selectedIssue) return
    await remove(selectedIssue.id)
    setDeleteConfirmOpen(false)
    setSheetOpen(false)
    mutate()
  }

  // Create
  async function handleCreate() {
    if (!newTitle.trim() || !newType) return
    await create({
      title: newTitle,
      description: newDescription,
      groupId: Number(newGroup),
      priorityId: Number(newPriority),
      type: newType,
      productArea: newProductArea || undefined,
      impact: newImpact || undefined,
      source: "Manual",
    })
    setCreateOpen(false)
    resetCreateForm()
    mutate()
  }

  function resetCreateForm() {
    setNewTitle("")
    setNewDescription("")
    setNewGroup("2")
    setNewPriority("2")
    setNewType("")
    setNewProductArea("")
    setNewImpact("")
  }

  return (
    <div className="flex flex-col p-6">
      {/* ── Header ────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-page-title text-text-primary">Issues</h1>
          <span className="text-meta text-text-secondary">{filtered.length}</span>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white text-[12px] h-8 px-3 rounded-[8px]"
        >
          + New Issue
        </Button>
      </div>

      {/* ── Filter bar ────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-label text-text-muted mr-1">Status</span>
          {STATUSES.map((s) => (
            <FilterBtn key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
          ))}
        </div>
        <div className="w-px bg-border mx-2 h-5" />
        <div className="flex items-center gap-1.5">
          <span className="text-label text-text-muted mr-1">Priority</span>
          {PRIORITIES.map((p) => (
            <FilterBtn key={p} label={p} active={priorityFilter === p} onClick={() => setPriorityFilter(p)} />
          ))}
        </div>
        <div className="w-px bg-border mx-2 h-5" />
        <div className="flex items-center gap-1.5">
          <span className="text-label text-text-muted mr-1">Group</span>
          {GROUPS.map((g) => (
            <FilterBtn key={g.value} label={g.label} active={groupFilter === g.value} onClick={() => setGroupFilter(g.value)} />
          ))}
        </div>
        <div className="w-px bg-border mx-2 h-5" />
        <div className="flex items-center gap-1.5">
          <span className="text-label text-text-muted mr-1">Type</span>
          {TYPES.map((t) => (
            <FilterBtn key={t} label={t} active={typeFilter === t} onClick={() => setTypeFilter(t)} />
          ))}
        </div>
        <div className="ml-auto w-[200px]">
          <Input
            placeholder="Search issues..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8 text-[12px] bg-surface border-border rounded-[8px]"
          />
        </div>
      </div>

      {/* ── Issue list ────────────────────────────────── */}
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
                      onClick={() => openDetail(issue)}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover cursor-pointer"
                    >
                      <span className="text-meta font-semibold text-text-primary flex-1 min-w-0 truncate">
                        {issue.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border shrink-0 ${statusBadgeStyle(issue.status)}`}
                      >
                        {issue.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 border shrink-0 ${priorityStyle(issue.priority)}`}
                      >
                        {issue.priority}
                      </Badge>
                      {issue.type && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 h-4 border shrink-0 ${typeBadgeStyle(issue.type)}`}
                        >
                          {issue.type}
                        </Badge>
                      )}
                      <span className="text-[11px] text-text-secondary w-[70px] truncate hidden sm:block">
                        {issue.group || "—"}
                      </span>
                      <span className="text-[11px] text-text-secondary w-[80px] truncate hidden lg:block">
                        {issue.productArea || "—"}
                      </span>
                      <span className="text-[11px] text-text-secondary w-[80px] truncate hidden sm:block">
                        {issue.owner || "—"}
                      </span>
                      <span className="text-[11px] text-text-muted w-[55px] text-right shrink-0 hidden md:block">
                        {issue.age}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail Sheet ──────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:max-w-[400px] bg-[#080808] border-border p-0">
          <SheetHeader className="p-5 pb-0">
            <SheetTitle className="text-text-primary text-sm">
              Issue #{selectedIssue?.number}
            </SheetTitle>
            <SheetDescription className="sr-only">Edit issue details</SheetDescription>
          </SheetHeader>
          {selectedIssue && (
            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col gap-4 pb-4">
                {/* Title */}
                <div>
                  <Label className="text-[11px] text-text-muted mb-1 block">Title</Label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-8 text-[12px] bg-surface border-border rounded-[8px]"
                  />
                </div>

                <Separator className="bg-border" />

                {/* Status */}
                <div>
                  <Label className="text-[11px] text-text-muted mb-1 block">Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080808] border-border">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div>
                  <Label className="text-[11px] text-text-muted mb-1 block">Priority</Label>
                  <Select value={editPriority} onValueChange={setEditPriority}>
                    <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080808] border-border">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Group */}
                <div>
                  <Label className="text-[11px] text-text-muted mb-1 block">Group</Label>
                  <Select value={editGroup} onValueChange={setEditGroup}>
                    <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080808] border-border">
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type */}
                <div>
                  <Label className="text-[11px] text-text-muted mb-1 block">Type</Label>
                  <Select value={editType || "_none"} onValueChange={(v) => setEditType(v === "_none" ? "" : v)}>
                    <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080808] border-border">
                      <SelectItem value="_none">None</SelectItem>
                      <SelectItem value="Bug">Bug</SelectItem>
                      <SelectItem value="Feature">Feature</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Task">Task</SelectItem>
                      <SelectItem value="Improvement">Improvement</SelectItem>
                      <SelectItem value="Onboarding">Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Area */}
                <div>
                  <Label className="text-[11px] text-text-muted mb-1 block">Product Area</Label>
                  <Select value={editProductArea || "_none"} onValueChange={(v) => setEditProductArea(v === "_none" ? "" : v)}>
                    <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080808] border-border">
                      <SelectItem value="_none">None</SelectItem>
                      {PRODUCT_AREAS.filter(Boolean).map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Impact */}
                <div>
                  <Label className="text-[11px] text-text-muted mb-1 block">Impact</Label>
                  <Select value={editImpact || "_none"} onValueChange={(v) => setEditImpact(v === "_none" ? "" : v)}>
                    <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080808] border-border">
                      <SelectItem value="_none">None</SelectItem>
                      {IMPACTS.filter(Boolean).map((i) => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border" />

                {/* Read-only info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-text-muted mb-0.5 block">Owner</Label>
                    <p className="text-[12px] text-text-secondary">{selectedIssue.owner || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-[11px] text-text-muted mb-0.5 block">Customer</Label>
                    <p className="text-[12px] text-text-secondary">{selectedIssue.customer || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-[11px] text-text-muted mb-0.5 block">Created</Label>
                    <p className="text-[12px] text-text-secondary">{selectedIssue.age}</p>
                  </div>
                  <div>
                    <Label className="text-[11px] text-text-muted mb-0.5 block">Updated</Label>
                    <p className="text-[12px] text-text-secondary">
                      {selectedIssue.updated ? new Date(selectedIssue.updated).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-[11px] text-text-muted mb-0.5 block">Source</Label>
                    <p className="text-[12px] text-text-secondary">{selectedIssue.source || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-[11px] text-text-muted mb-0.5 block">Articles</Label>
                    <p className="text-[12px] text-text-secondary">{selectedIssue.articleCount}</p>
                  </div>
                </div>

                {/* Tags */}
                {selectedIssue.tags.length > 0 && (
                  <div>
                    <Label className="text-[11px] text-text-muted mb-1 block">Tags</Label>
                    <div className="flex flex-wrap gap-1">
                      {selectedIssue.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4 border bg-zinc-500/10 text-zinc-400 border-zinc-500/25">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <SheetFooter className="border-t border-border p-4 flex-row gap-2">
            <Button
              variant="outline"
              className="text-red-400 border-red-500/25 hover:bg-red-500/10 text-[12px] h-8 rounded-[8px]"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={deleting}
            >
              Delete
            </Button>
            <Button
              onClick={handleSave}
              disabled={updating}
              className="bg-violet-600 hover:bg-violet-700 text-white text-[12px] h-8 px-4 rounded-[8px] ml-auto"
            >
              {updating ? "Saving..." : "Save"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ── Delete Confirmation ───────────────────────── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-[#080808] border-border sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Delete Issue</DialogTitle>
            <DialogDescription className="text-text-secondary text-[13px]">
              Are you sure you want to delete &ldquo;{selectedIssue?.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="text-[12px] h-8 rounded-[8px] border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white text-[12px] h-8 rounded-[8px]"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create Dialog ─────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetCreateForm() }}>
        <DialogContent className="bg-[#080808] border-border sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-text-primary">New Issue</DialogTitle>
            <DialogDescription className="text-text-secondary text-[13px]">
              Create a new support issue
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <Label className="text-[11px] text-text-muted mb-1 block">Title *</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Issue title"
                className="h-8 text-[12px] bg-surface border-border rounded-[8px]"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-[11px] text-text-muted mb-1 block">Description *</Label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe the issue..."
                className="text-[12px] bg-surface border-border rounded-[8px] min-h-[80px]"
              />
            </div>

            {/* Row: Group + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] text-text-muted mb-1 block">Group *</Label>
                <Select value={newGroup} onValueChange={setNewGroup}>
                  <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    <SelectItem value="2">Support</SelectItem>
                    <SelectItem value="3">Sales</SelectItem>
                    <SelectItem value="4">Technical</SelectItem>
                    <SelectItem value="5">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px] text-text-muted mb-1 block">Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="2">Normal</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                    <SelectItem value="4">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: Type + Product Area */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] text-text-muted mb-1 block">Type *</Label>
                <Select value={newType || "_placeholder"} onValueChange={(v) => setNewType(v === "_placeholder" ? "" : v)}>
                  <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    <SelectItem value="_placeholder" disabled>Select type</SelectItem>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Feature">Feature</SelectItem>
                    <SelectItem value="Question">Question</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Improvement">Improvement</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px] text-text-muted mb-1 block">Product Area</Label>
                <Select value={newProductArea || "_none"} onValueChange={(v) => setNewProductArea(v === "_none" ? "" : v)}>
                  <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#080808] border-border">
                    <SelectItem value="_none">None</SelectItem>
                    {PRODUCT_AREAS.filter(Boolean).map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Impact */}
            <div>
              <Label className="text-[11px] text-text-muted mb-1 block">Impact</Label>
              <Select value={newImpact || "_none"} onValueChange={(v) => setNewImpact(v === "_none" ? "" : v)}>
                <SelectTrigger className="h-8 text-[12px] bg-surface border-border rounded-[8px] w-full">
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent className="bg-[#080808] border-border">
                  <SelectItem value="_none">None</SelectItem>
                  {IMPACTS.filter(Boolean).map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setCreateOpen(false); resetCreateForm() }}
              className="text-[12px] h-8 rounded-[8px] border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !newTitle.trim() || !newType}
              className="bg-violet-600 hover:bg-violet-700 text-white text-[12px] h-8 rounded-[8px]"
            >
              {creating ? "Creating..." : "Create Issue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
