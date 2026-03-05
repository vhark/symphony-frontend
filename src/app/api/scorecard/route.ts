import { NextResponse } from "next/server"
import { fetchTable } from "@/lib/nocodb"

interface NocoScorecard {
  Id: number
  Measurable: string
  Owner: string
  Goal: number
  Actual: number
  Target: number
  Status: string
}

const mockScorecard = [
  { id: 1, label: "Revenue", value: 42800, target: 50000, unit: "$", trend: "up", week: "2026-W10" },
  { id: 2, label: "Active Agents", value: 12, target: 15, unit: "", trend: "up", week: "2026-W10" },
  { id: 3, label: "Build Velocity", value: 34, target: 40, unit: "pts", trend: "down", week: "2026-W10" },
  { id: 4, label: "CSAT", value: 4.7, target: 4.5, unit: "", trend: "up", week: "2026-W10" },
]

function deriveTrend(actual: number, target: number): string {
  if (actual >= target) return "up"
  return "down"
}

export async function GET() {
  try {
    const rows = await fetchTable<NocoScorecard>("mcqmr6cylpy0tca")
    const scorecard = rows.map((r) => ({
      id: r.Id,
      label: r.Measurable,
      value: r.Actual ?? 0,
      target: r.Target ?? r.Goal ?? 0,
      unit: "",
      trend: deriveTrend(r.Actual ?? 0, r.Target ?? r.Goal ?? 0),
      owner: r.Owner ?? "",
    }))
    return NextResponse.json({ scorecard })
  } catch (e) {
    console.error("Scorecard API error, falling back to mock:", e)
    return NextResponse.json({ scorecard: mockScorecard })
  }
}
