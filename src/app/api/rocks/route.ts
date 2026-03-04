import { NextResponse } from "next/server"

const mockRocks = [
  { id: 1, title: "Launch Cockpit MVP", status: "on-track", progress: 65, owner: "Engineering", quarter: "Q1 2026" },
  { id: 2, title: "100 Qualified Leads", status: "at-risk", progress: 32, owner: "Marketing", quarter: "Q1 2026" },
  { id: 3, title: "Agent Framework v2", status: "on-track", progress: 80, owner: "Platform", quarter: "Q1 2026" },
  { id: 4, title: "SOC2 Compliance", status: "off-track", progress: 15, owner: "Security", quarter: "Q1 2026" },
]

export async function GET() {
  return NextResponse.json({ rocks: mockRocks })
}
