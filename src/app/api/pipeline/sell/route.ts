import { NextResponse } from "next/server"

const mockSellPipeline = [
  { id: 1, name: "Acme Corp — Enterprise Plan", status: "negotiation", value: 12000, stage: "Proposal Sent", probability: 65, contact: "John Smith" },
  { id: 2, name: "TechStart Inc — Growth", status: "qualified", value: 4800, stage: "Demo Scheduled", probability: 40, contact: "Jane Doe" },
  { id: 3, name: "DataFlow Labs — Custom", status: "closed-won", value: 8400, stage: "Closed", probability: 100, contact: "Alex Chen" },
]

export async function GET() {
  return NextResponse.json({ deals: mockSellPipeline })
}
