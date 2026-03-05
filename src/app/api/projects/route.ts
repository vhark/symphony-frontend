import { NextResponse } from "next/server"
import { fetchTable } from "@/lib/nocodb"

interface NocoProject {
  Id: number
  Name: string
  Status: string
  Track: string
  Progress: number
  Owner: string
}

const mockProjects = [
  { id: 1, name: "Symphony Cockpit", status: "active", track: "build", progress: 45, owner: "Engineering" },
  { id: 2, name: "Agent Marketplace", status: "planning", track: "build", progress: 10, owner: "Product" },
  { id: 3, name: "Content Engine", status: "active", track: "build", progress: 72, owner: "AI Team" },
  { id: 4, name: "Enterprise Sales Push", status: "active", track: "sell", progress: 55, owner: "Sales" },
]

export async function GET() {
  try {
    const rows = await fetchTable<NocoProject>("m1wj32l3k95m4mh")
    const projects = rows.map((r) => ({
      id: r.Id,
      name: r.Name ?? "",
      status: (r.Status ?? "").toLowerCase().replace(/\s+/g, "-"),
      track: (r.Track ?? "").toLowerCase(),
      progress: r.Progress ?? 0,
      owner: r.Owner ?? "",
    }))
    return NextResponse.json({ projects })
  } catch (e) {
    console.error("Projects API error, falling back to mock:", e)
    return NextResponse.json({ projects: mockProjects })
  }
}
