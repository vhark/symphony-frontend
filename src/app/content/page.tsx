"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"
import { useContent, type ContentItem } from "@/hooks/use-content"

// ── Column definitions ──────────────────────────────────────────────────────
const COLUMNS = [
  {
    id: "idea",
    label: "Idea Backlog",
    emoji: "💡",
    statuses: ["idea"],
    nextStatus: "draft",
    nextLabel: "Move to Editing →",
    color: "text-text-muted",
    bg: "bg-surface/40",
  },
  {
    id: "editing",
    label: "Editing",
    emoji: "✍️",
    statuses: ["draft", "editing", "in_review"],
    nextStatus: "ready",
    nextLabel: "Mark Ready →",
    prevStatus: "idea",
    prevLabel: "← Back to Backlog",
    color: "text-status-warning",
    bg: "bg-status-warning/5",
  },
  {
    id: "ready",
    label: "Ready to Publish",
    emoji: "🚀",
    statuses: ["ready", "approved", "scheduled"],
    nextStatus: "published",
    nextLabel: "Mark Published ✓",
    prevStatus: "draft",
    prevLabel: "← Back to Editing",
    color: "text-status-active",
    bg: "bg-status-active/5",
  },
] as const

// ── Helpers ─────────────────────────────────────────────────────────────────
function platformIcon(platform: string) {
  const map: Record<string, string> = {
    blog: "📝", linkedin: "💼", twitter: "🐦", email: "📧", podcast: "🎙️",
  }
  return map[platform?.toLowerCase()] ?? "📄"
}

function typeLabel(contentType: string) {
  return contentType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

function typeBadgeStyle(contentType: string) {
  switch (contentType) {
    case "blog_post": return "border-violet/30 text-violet-light"
    case "linkedin_post": return "border-blue-500/30 text-blue-400"
    case "twitter_post": return "border-sky-400/30 text-sky-400"
    case "email_newsletter": return "border-amber-400/30 text-amber-400"
    case "podcast_talking_points": return "border-pink-400/30 text-pink-400"
    case "faq": return "border-border text-text-muted"
    default: return "border-border text-text-muted"
  }
}

// ── Card component ───────────────────────────────────────────────────────────
function ContentCard({
  item,
  column,
  onSelect,
  onMove,
}: {
  item: ContentItem
  column: typeof COLUMNS[number]
  onSelect: (item: ContentItem) => void
  onMove: (id: number, status: string) => void
}) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group rounded-[12px] border border-border bg-surface p-3.5 cursor-pointer transition-all hover:bg-surface-hover hover:border-border-strong"
    >
      {/* Platform + type */}
      <div className="flex items-start gap-2 mb-2">
        <span className="text-base shrink-0">{platformIcon(item.platform)}</span>
        <p className="text-meta font-semibold text-text-primary leading-snug line-clamp-2 flex-1">
          {item.title}
        </p>
      </div>

      {/* Type badge */}
      <div className="flex flex-wrap gap-1 mb-3">
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border ${typeBadgeStyle(item.contentType)}`}>
          {typeLabel(item.contentType)}
        </Badge>
        {item.platform && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border border-border text-text-muted">
            {item.platform}
          </Badge>
        )}
      </div>

      {/* Expert name */}
      {item.expertName && (
        <p className="text-[11px] text-text-secondary mb-3 truncate">👤 {item.expertName}</p>
      )}

      {/* Published URL */}
      {item.publishedUrl && (
        <a
          href={item.publishedUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-[11px] text-violet-light hover:underline truncate block mb-2"
        >
          🔗 {item.publishedUrl}
        </a>
      )}

      {/* Move buttons */}
      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        {"prevStatus" in column && column.prevStatus && (
          <button
            onClick={() => onMove(item.id, column.prevStatus!)}
            className="text-[10px] text-text-muted hover:text-text-primary transition-colors px-2 py-1 rounded border border-border hover:border-border-strong"
          >
            {column.prevLabel}
          </button>
        )}
        {column.nextStatus !== "published" ? (
          <button
            onClick={() => onMove(item.id, column.nextStatus)}
            className="text-[10px] text-text-muted hover:text-status-active transition-colors px-2 py-1 rounded border border-border hover:border-border-strong ml-auto"
          >
            {column.nextLabel}
          </button>
        ) : (
          <button
            onClick={() => onMove(item.id, "published")}
            className="text-[10px] text-status-active px-2 py-1 rounded border border-status-active/30 hover:bg-status-active/10 transition-colors ml-auto"
          >
            {column.nextLabel}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Edit sheet ───────────────────────────────────────────────────────────────
function EditSheet({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: ContentItem | null
  onClose: () => void
  onSave: (id: number, fields: Record<string, unknown>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  const [form, setForm] = useState<Partial<ContentItem>>(item ?? {})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!item) return null

  const set = (k: keyof ContentItem, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!item) return
    setSaving(true)
    await onSave(item.id, {
      Title: form.title,
      "Content Type": form.contentType,
      Platform: form.platform,
      Status: form.status,
      "Expert Name": form.expertName,
      "Published URL": form.publishedUrl,
      Body: form.body,
    })
    setSaving(false)
    onClose()
  }

  async function handleDelete() {
    if (!item) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    await onDelete(item.id)
    setDeleting(false)
    onClose()
  }

  return (
    <Sheet open={!!item} onOpenChange={open => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-[#080808] border-border flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-text-primary">{item.title}</SheetTitle>
          <SheetDescription className="text-text-secondary">
            {platformIcon(item.platform)} {typeLabel(item.contentType)}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="text-label text-text-muted block mb-1">Title</label>
              <input
                value={form.title ?? ""}
                onChange={e => set("title", e.target.value)}
                className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-meta text-text-primary focus:outline-none focus:border-violet/50"
              />
            </div>

            {/* Content Type + Platform */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label text-text-muted block mb-1">Content Type</label>
                <select
                  value={form.contentType ?? ""}
                  onChange={e => set("contentType", e.target.value)}
                  className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-meta text-text-primary focus:outline-none focus:border-violet/50"
                >
                  {["blog_post","linkedin_post","twitter_post","email_newsletter","faq","podcast_talking_points"].map(t => (
                    <option key={t} value={t}>{typeLabel(t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-label text-text-muted block mb-1">Platform</label>
                <select
                  value={form.platform ?? ""}
                  onChange={e => set("platform", e.target.value)}
                  className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-meta text-text-primary focus:outline-none focus:border-violet/50"
                >
                  {["blog","linkedin","twitter","email","podcast"].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-label text-text-muted block mb-1">Status</label>
              <select
                value={form.status ?? "idea"}
                onChange={e => set("status", e.target.value)}
                className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-meta text-text-primary focus:outline-none focus:border-violet/50"
              >
                {["idea","draft","editing","in_review","ready","approved","scheduled","published"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Expert Name */}
            <div>
              <label className="text-label text-text-muted block mb-1">Expert Name</label>
              <input
                value={form.expertName ?? ""}
                onChange={e => set("expertName", e.target.value)}
                className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-meta text-text-primary focus:outline-none focus:border-violet/50"
              />
            </div>

            {/* Published URL */}
            <div>
              <label className="text-label text-text-muted block mb-1">Published URL</label>
              <input
                value={form.publishedUrl ?? ""}
                onChange={e => set("publishedUrl", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-meta text-text-primary focus:outline-none focus:border-violet/50"
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-label text-text-muted block mb-1">Body / Copy</label>
              <textarea
                value={form.body ?? ""}
                onChange={e => set("body", e.target.value)}
                rows={8}
                className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-meta text-text-primary focus:outline-none focus:border-violet/50 resize-y font-mono text-[11px]"
              />
            </div>
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`text-meta px-3 py-1.5 rounded-[8px] border transition-colors ${
              confirmDelete
                ? "border-status-error/50 text-status-error hover:bg-status-error/10"
                : "border-border text-text-muted hover:text-status-error hover:border-status-error/30"
            }`}
          >
            {deleting ? "Deleting..." : confirmDelete ? "Confirm delete?" : "Delete"}
          </button>
          <div className="flex-1" />
          <button onClick={onClose} className="text-meta text-text-muted px-3 py-1.5">Cancel</button>
          <Button onClick={handleSave} disabled={saving} className="bg-violet hover:bg-violet/90 text-white">
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const { items, isLoading, updateStatus, updateItem, createItem, deleteItem } = useContent()
  const [selected, setSelected] = useState<ContentItem | null>(null)

  const totalPublished = items.filter(i => i.status === "published").length

  function getColumnItems(col: typeof COLUMNS[number]) {
    return items.filter(i => col.statuses.includes(i.status as never))
  }

  async function handleMove(id: number, status: string) {
    await updateStatus(id, status)
  }

  async function handleSave(id: number, fields: Record<string, unknown>) {
    await updateItem(id, fields)
  }

  async function handleDelete(id: number) {
    await deleteItem(id)
  }

  return (
    <div className="flex flex-col p-6 h-[calc(100vh-0px)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <h1 className="text-page-title text-text-primary">Content Queue</h1>
        <div className="flex items-center gap-4">
          <span className="text-meta text-text-secondary">{items.length} items</span>
          {totalPublished > 0 && (
            <span className="text-meta text-status-active">{totalPublished} published</span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-meta text-text-muted">Loading content queue...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {COLUMNS.map(col => {
            const colItems = getColumnItems(col)
            return (
              <div key={col.id} className="flex flex-col min-h-0">
                {/* Column header */}
                <div className={`mb-3 flex items-center gap-2 px-1`}>
                  <span className="text-base">{col.emoji}</span>
                  <span className={`text-label font-semibold ${col.color}`}>{col.label}</span>
                  <span className="text-[11px] text-text-muted ml-auto">{colItems.length}</span>
                </div>

                {/* Column body */}
                <div className={`flex-1 rounded-[14px] border border-border ${col.bg} p-2 min-h-0`}>
                  <ScrollArea className="h-full">
                    <div className="flex flex-col gap-2 pb-2">
                      {colItems.length === 0 ? (
                        <div className="py-12 text-center text-[11px] text-text-muted">Empty</div>
                      ) : (
                        colItems.map(item => (
                          <ContentCard
                            key={item.id}
                            item={item}
                            column={col}
                            onSelect={setSelected}
                            onMove={handleMove}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit sheet */}
      <EditSheet
        item={selected}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
