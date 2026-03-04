import { NextResponse } from "next/server"

const mockProjects = [
  { id: 1, name: "Symphony Cockpit", status: "active", track: "build", progress: 45, owner: "Engineering" },
  { id: 2, name: "Agent Marketplace", status: "planning", track: "build", progress: 10, owner: "Product" },
  { id: 3, name: "Content Engine", status: "active", track: "build", progress: 72, owner: "AI Team" },
  { id: 4, name: "Enterprise Sales Push", status: "active", track: "sell", progress: 55, owner: "Sales" },
]

export async function GET() {
  return NextResponse.json({ projects: mockProjects })
}
