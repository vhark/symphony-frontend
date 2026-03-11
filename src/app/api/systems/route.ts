import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    diagrams: [
      { id: "build-sell", name: "Build / Sell Framework", description: "Two-track operating model with live stage counts", category: "Operations" },
      { id: "sales-funnel", name: "Sales Funnel", description: "Full revenue pipeline from traffic to close", category: "Revenue" },
      { id: "agents", name: "Agent Ecosystem", description: "20-agent network with status and delegation", category: "Infrastructure" },
    ],
  })
}
