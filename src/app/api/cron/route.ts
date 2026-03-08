import { NextResponse } from "next/server"
import { proxyFetch } from "@/lib/proxy"

const mockCronJobs = [
  { id: "1", name: "daily-pulse", schedule: "0 9 * * 1-5", enabled: true, status: "ok" },
  { id: "2", name: "weekly-review", schedule: "0 12 * * 5", enabled: true, status: "ok" },
]

export async function GET() {
  try {
    const res = await proxyFetch("/cron")
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error("Cron API error, falling back to mock:", e)
    return NextResponse.json({ jobs: mockCronJobs })
  }
}
