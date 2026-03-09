import { NextRequest, NextResponse } from "next/server"
import {
  fetchTickets,
  searchTickets,
  createTicket,
  type ZammadTicket,
} from "@/lib/zammad"

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

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search")
    let tickets: ZammadTicket[]

    if (search) {
      tickets = await searchTickets(search)
    } else {
      tickets = await fetchTickets({ per_page: 100, order_by: "created_at", sort_by: "desc" })
    }

    const issues = tickets.map(mapTicket)
    return NextResponse.json({ issues })
  } catch (e) {
    console.error("Issues API error:", e)
    return NextResponse.json({ issues: [], error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ticket = await createTicket({
      title: body.title,
      group_id: body.groupId ?? body.group_id ?? 2,
      priority_id: body.priorityId ?? body.priority_id ?? 2,
      state_id: body.stateId ?? body.state_id ?? 1,
      article: {
        body: body.description ?? body.body ?? "",
        type: "note",
      },
      ticket_type: body.type ?? undefined,
      product_area: body.productArea ?? undefined,
      impact: body.impact ?? undefined,
      intake_source: body.source ?? "Manual",
      customer_id: body.customerId ?? undefined,
    })
    return NextResponse.json({ issue: mapTicket(ticket) }, { status: 201 })
  } catch (e) {
    console.error("Issues create error:", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
