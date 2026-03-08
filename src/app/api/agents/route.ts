import { NextResponse } from "next/server"
import { proxyFetch } from "@/lib/proxy"

const mockAgents = [
  { id: 1, name: "Content Writer", status: "active", emoji: "✍️", vibe: "Creates compelling content" },
  { id: 2, name: "SEO Analyzer", status: "running", emoji: "🔍", vibe: "Optimizes for search" },
]

export async function GET() {
  try {
    const res = await proxyFetch("/agents")
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error("Agents API error, falling back to mock:", e)
    return NextResponse.json({ agents: mockAgents })
  }
}
