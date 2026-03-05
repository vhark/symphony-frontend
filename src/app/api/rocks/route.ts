import { NextResponse } from "next/server"
import { fetchTable } from "@/lib/nocodb"

interface NocoRock {
  Id: number
  Rock: string
  Owner: string
  Quarter: string
  Status: string
  Notes: string
  "Due Date": string
}

const mockRocks = [
  { id: 1, title: "Launch Cockpit MVP", status: "on-track", progress: 65, owner: "Engineering", quarter: "Q1 2026" },
  { id: 2, title: "100 Qualified Leads", status: "at-risk", progress: 32, owner: "Marketing", quarter: "Q1 2026" },
  { id: 3, title: "Agent Framework v2", status: "on-track", progress: 80, owner: "Platform", quarter: "Q1 2026" },
  { id: 4, title: "SOC2 Compliance", status: "off-track", progress: 15, owner: "Security", quarter: "Q1 2026" },
]

function mapStatus(raw: string): string {
  if (raw?.includes("On Track")) return "on-track"
  if (raw?.includes("At Risk")) return "at-risk"
  if (raw?.includes("Off Track")) return "off-track"
  return "unknown"
}

export async function GET() {
  try {
    const rows = await fetchTable<NocoRock>("m6x6stxsom9yx0i")
    const rocks = rows.map((r) => ({
      id: r.Id,
      title: r.Rock,
      status: mapStatus(r.Status),
      progress: 0,
      owner: r.Owner ?? "",
      quarter: r.Quarter ?? "",
      dueDate: r["Due Date"] ?? null,
      notes: r.Notes ?? "",
    }))
    return NextResponse.json({ rocks })
  } catch (e) {
    console.error("Rocks API error, falling back to mock:", e)
    return NextResponse.json({ rocks: mockRocks })
  }
}
