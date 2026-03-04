import { NextResponse } from "next/server"

const mockScorecard = [
  { id: 1, label: "Revenue", value: 42800, target: 50000, unit: "$", trend: "up", week: "2026-W10" },
  { id: 2, label: "Active Agents", value: 12, target: 15, unit: "", trend: "up", week: "2026-W10" },
  { id: 3, label: "Build Velocity", value: 34, target: 40, unit: "pts", trend: "down", week: "2026-W10" },
  { id: 4, label: "CSAT", value: 4.7, target: 4.5, unit: "", trend: "up", week: "2026-W10" },
]

export async function GET() {
  return NextResponse.json({ scorecard: mockScorecard })
}
