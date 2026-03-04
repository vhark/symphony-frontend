import { NextResponse } from "next/server"

const mockBuildPipeline = [
  { id: 1, name: "Auth Middleware Refactor", status: "in-progress", progress: 70, assignee: "Code Reviewer Agent", dueDate: "2026-03-08", priority: "high" },
  { id: 2, name: "Payment Integration v2", status: "blocked", progress: 40, assignee: "Dev Team", dueDate: "2026-03-15", priority: "critical" },
  { id: 3, name: "Dashboard Analytics", status: "in-progress", progress: 55, assignee: "Data Pipeline Agent", dueDate: "2026-03-12", priority: "medium" },
]

export async function GET() {
  return NextResponse.json({ projects: mockBuildPipeline })
}
