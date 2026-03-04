import { NextResponse } from "next/server"

const mockIssues = [
  { id: 101, title: "Login timeout on mobile", status: "open", priority: "high", assignee: "Engineering", created: "2026-03-01" },
  { id: 102, title: "Dashboard chart rendering slow", status: "in-progress", priority: "medium", assignee: "Frontend", created: "2026-02-28" },
  { id: 103, title: "Email notifications delayed", status: "open", priority: "low", assignee: "Infrastructure", created: "2026-03-02" },
]

export async function GET() {
  return NextResponse.json({ issues: mockIssues })
}
