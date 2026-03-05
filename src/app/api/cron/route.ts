import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { resolve } from "path"

const mockCronJobs = [
  { id: 1, name: "sync-nocodb", schedule: "*/5 * * * *", lastRun: "2026-03-04T10:55:00Z", status: "ok", nextRun: "2026-03-04T11:00:00Z" },
  { id: 2, name: "agent-health-check", schedule: "*/15 * * * *", lastRun: "2026-03-04T10:45:00Z", status: "ok", nextRun: "2026-03-04T11:00:00Z" },
  { id: 3, name: "daily-report", schedule: "0 9 * * *", lastRun: "2026-03-04T09:00:00Z", status: "ok", nextRun: "2026-03-05T09:00:00Z" },
  { id: 4, name: "pipeline-refresh", schedule: "0 */2 * * *", lastRun: "2026-03-04T10:00:00Z", status: "warning", nextRun: "2026-03-04T12:00:00Z" },
]

interface CronJob {
  id: string
  name: string
  enabled: boolean
  schedule: { kind: string; expr: string; tz: string }
}

export async function GET() {
  try {
    const cronPath = process.env.OPENCLAW_CRON_PATH
      ? resolve(process.env.OPENCLAW_CRON_PATH.replace(/^~/, process.env.HOME ?? ""))
      : null

    if (!cronPath) throw new Error("OPENCLAW_CRON_PATH not set")

    const raw = readFileSync(cronPath, "utf-8")
    const data = JSON.parse(raw) as { version: number; jobs: CronJob[] }

    const jobs = data.jobs.map((j) => ({
      id: j.id,
      name: j.name,
      schedule: j.schedule.expr,
      enabled: j.enabled,
      timezone: j.schedule.tz,
      kind: j.schedule.kind,
      status: j.enabled ? "ok" : "disabled",
    }))

    return NextResponse.json({ jobs })
  } catch (e) {
    console.error("Cron API error, falling back to mock:", e)
    return NextResponse.json({ jobs: mockCronJobs })
  }
}
