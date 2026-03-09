import { NextRequest, NextResponse } from "next/server"
import { fetchTicket, updateTicket, deleteTicket, type ZammadTicket } from "@/lib/zammad"

function timeAgo(dateStr: string): string {
  if (!dateStr) return ""
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function mapPriority(name: string): string {
  const n = (name ?? "").toLowerCase()
  if (n.includes("4") || n.includes("critical")) return "critical"
  if (n.includes("3") || n.includes("high")) return "high"
  if (n.includes("2") || n.includes("normal")) return "normal"
  return "low"
}

function mapStatus(name: string): string {
  return (name ?? "new").toLowerCase().replace(/\s+/g, "-")
}

function mapTicket(t: ZammadTicket) {
  return {
    id: t.id,
    number: t.number,
    title: t.title,
    status: mapStatus(t.state),
    priority: mapPriority(t.priority),
    group: t.group,
    groupId: t.group_id,
    type: t.ticket_type ?? "",
    source: t.intake_source ?? "",
    productArea: t.product_area ?? "",
    impact: t.impact ?? "",
    owner: t.owner,
    customer: t.customer,
    customerEmail: "",
    created: t.created_at,
    updated: t.updated_at,
    age: timeAgo(t.created_at),
    tags: t.tags,
    articleCount: t.article_count,
  }
}

// Zammad state name → state_id mapping
const STATE_MAP: Record<string, number> = {
  new: 1,
  open: 2,
  "pending-reminder": 3,
  "pending-close": 3,
  pending: 3,
  closed: 4,
  merged: 5,
}

// Zammad priority name → priority_id mapping
const PRIORITY_MAP: Record<string, number> = {
  low: 1,
  normal: 2,
  high: 3,
  critical: 4,
}

// Group name → group_id mapping
const GROUP_MAP: Record<string, number> = {
  Support: 2,
  Sales: 3,
  Technical: 4,
  Internal: 5,
}

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    const ticket = await fetchTicket(Number(id))
    return NextResponse.json({ issue: mapTicket(ticket) })
  } catch (e) {
    console.error("Issue GET error:", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    const body = await req.json()

    // Build Zammad update payload from clean field names
    const update: Record<string, unknown> = {}
    if (body.title !== undefined) update.title = body.title
    if (body.status !== undefined) update.state_id = STATE_MAP[body.status] ?? 1
    if (body.priority !== undefined) update.priority_id = PRIORITY_MAP[body.priority] ?? 2
    if (body.group !== undefined) update.group_id = GROUP_MAP[body.group] ?? body.groupId
    if (body.groupId !== undefined) update.group_id = body.groupId
    if (body.type !== undefined) update.ticket_type = body.type
    if (body.productArea !== undefined) update.product_area = body.productArea
    if (body.impact !== undefined) update.impact = body.impact
    if (body.source !== undefined) update.intake_source = body.source

    const ticket = await updateTicket(Number(id), update)
    return NextResponse.json({ issue: mapTicket(ticket) })
  } catch (e) {
    console.error("Issue PUT error:", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    await deleteTicket(Number(id))
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Issue DELETE error:", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
