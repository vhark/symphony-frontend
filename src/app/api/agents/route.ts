import { NextResponse } from "next/server"

const mockAgents = [
  { id: 1, name: "Content Writer", status: "active", type: "creator", lastActive: "2026-03-04T10:58:00Z", tasksCompleted: 142 },
  { id: 2, name: "SEO Analyzer", status: "running", type: "analyzer", lastActive: "2026-03-04T10:56:00Z", tasksCompleted: 89 },
  { id: 3, name: "CRM Sync", status: "active", type: "integrator", lastActive: "2026-03-04T10:51:00Z", tasksCompleted: 1204 },
  { id: 4, name: "Code Reviewer", status: "running", type: "reviewer", lastActive: "2026-03-04T10:47:00Z", tasksCompleted: 67 },
  { id: 5, name: "Deploy Bot", status: "error", type: "devops", lastActive: "2026-03-04T10:41:00Z", tasksCompleted: 312 },
  { id: 6, name: "Data Pipeline", status: "active", type: "processor", lastActive: "2026-03-04T10:34:00Z", tasksCompleted: 2891 },
]

export async function GET() {
  return NextResponse.json({ agents: mockAgents })
}
