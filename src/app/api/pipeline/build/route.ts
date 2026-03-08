import { NextResponse, NextRequest } from "next/server"
import { fetchTable, createRecord } from "@/lib/nocodb"

interface NocoBuild {
  Id: number
  Name: string
  Type: string
  Stage: string
  Status: string
  Owner: string
  Priority: string
  Complexity: string
  "Impact Score": number
  "Linked Sell Stage": string
  "Target Release Date": string
  Notes: string
  "Customer Requested": boolean
}

const mockBuildPipeline = [
  { id: 1, name: "Auth Middleware Refactor", status: "in-progress", progress: 70, assignee: "Code Reviewer Agent", dueDate: "2026-03-08", priority: "high" },
  { id: 2, name: "Payment Integration v2", status: "blocked", progress: 40, assignee: "Dev Team", dueDate: "2026-03-15", priority: "critical" },
  { id: 3, name: "Dashboard Analytics", status: "in-progress", progress: 55, assignee: "Data Pipeline Agent", dueDate: "2026-03-12", priority: "medium" },
]

function mapStageToProgress(stage: string): number {
  const stages: Record<string, number> = {
    Discovery: 10, Design: 25, Develop: 50, Test: 75, Release: 90, Iterate: 100,
  }
  return stages[stage] ?? 0
}

export async function GET() {
  try {
    const rows = await fetchTable<NocoBuild>("mm3e7zzulgzj0fb")
    const projects = rows.map((r) => ({
      id: r.Id,
      name: r.Name,
      status: (r.Status ?? "").toLowerCase().replace(/\s+/g, "-"),
      progress: mapStageToProgress(r.Stage),
      assignee: r.Owner ?? "",
      dueDate: r["Target Release Date"] ?? "",
      priority: (r.Priority ?? "medium").toLowerCase(),
      stage: r.Stage ?? "",
      type: r.Type ?? "",
      complexity: r.Complexity ?? "",
      impactScore: r["Impact Score"] ?? 0,
      notes: r.Notes ?? "",
      customerRequested: r["Customer Requested"] ?? false,
    }))
    return NextResponse.json({ projects })
  } catch (e) {
    console.error("Build pipeline API error, falling back to mock:", e)
    return NextResponse.json({ projects: mockBuildPipeline })
  }
}

const BUILD_TABLE = "mm3e7zzulgzj0fb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const record = await createRecord<NocoBuild>(BUILD_TABLE, body)
    return NextResponse.json(record, { status: 201 })
  } catch (e) {
    console.error("Build create error:", e)
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
  }
}
