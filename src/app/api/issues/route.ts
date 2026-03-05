import { NextResponse } from "next/server"
import { fetchTickets } from "@/lib/zammad"

const mockIssues = [
  { id: 101, title: "Login timeout on mobile", status: "open", priority: "high", assignee: "Engineering", created: "2026-03-01" },
  { id: 102, title: "Dashboard chart rendering slow", status: "in-progress", priority: "medium", assignee: "Frontend", created: "2026-02-28" },
  { id: 103, title: "Email notifications delayed", status: "open", priority: "low", assignee: "Infrastructure", created: "2026-03-02" },
]

function mapPriority(name: string): string {
  const n = name?.toLowerCase() ?? ""
  if (n.includes("1") || n.includes("high") || n.includes("urgent")) return "high"
  if (n.includes("2") || n.includes("normal") || n.includes("medium")) return "medium"
  return "low"
}

export async function GET() {
  try {
    const tickets = await fetchTickets()
    const issues = tickets.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.state?.name?.toLowerCase().replace(/\s+/g, "-") ?? "open",
      priority: mapPriority(t.priority?.name ?? ""),
      assignee: t.owner ? `${t.owner.firstname} ${t.owner.lastname}`.trim() : "",
      created: t.created_at?.split("T")[0] ?? "",
    }))
    return NextResponse.json({ issues })
  } catch (e) {
    console.error("Issues API error, falling back to mock:", e)
    return NextResponse.json({ issues: mockIssues })
  }
}
