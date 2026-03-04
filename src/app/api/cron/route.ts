import { NextResponse } from "next/server"

const mockCronJobs = [
  { id: 1, name: "sync-nocodb", schedule: "*/5 * * * *", lastRun: "2026-03-04T10:55:00Z", status: "ok", nextRun: "2026-03-04T11:00:00Z" },
  { id: 2, name: "agent-health-check", schedule: "*/15 * * * *", lastRun: "2026-03-04T10:45:00Z", status: "ok", nextRun: "2026-03-04T11:00:00Z" },
  { id: 3, name: "daily-report", schedule: "0 9 * * *", lastRun: "2026-03-04T09:00:00Z", status: "ok", nextRun: "2026-03-05T09:00:00Z" },
  { id: 4, name: "pipeline-refresh", schedule: "0 */2 * * *", lastRun: "2026-03-04T10:00:00Z", status: "warning", nextRun: "2026-03-04T12:00:00Z" },
]

export async function GET() {
  return NextResponse.json({ jobs: mockCronJobs })
}
