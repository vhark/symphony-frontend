import { NextResponse, NextRequest } from "next/server"
import { fetchTable, createRecord } from "@/lib/nocodb"

interface NocoSell {
  Id: number
  Name: string
  Company: string
  Stage: string
  Status: string
  Owner: string
  "Deal Value": number
  "ICP Match": boolean
  "Budget Confirmed": boolean
  "Decision Maker Identified": boolean
  Timeline: string
  "Days in Stage": number
  "Lead Source": string
  Notes: string
}

const mockSellPipeline = [
  { id: 1, name: "Acme Corp — Enterprise Plan", status: "negotiation", value: 12000, stage: "Proposal Sent", probability: 65, contact: "John Smith" },
  { id: 2, name: "TechStart Inc — Growth", status: "qualified", value: 4800, stage: "Demo Scheduled", probability: 40, contact: "Jane Doe" },
  { id: 3, name: "DataFlow Labs — Custom", status: "closed-won", value: 8400, stage: "Closed", probability: 100, contact: "Alex Chen" },
]

function stageToProbability(stage: string): number {
  const map: Record<string, number> = {
    Attract: 5, Capture: 15, Nurture: 35, Close: 70, Implement: 90, Succeed: 100,
  }
  return map[stage] ?? 0
}

export async function GET() {
  try {
    const rows = await fetchTable<NocoSell>("md91oklmw9u9ua6")
    const deals = rows.map((r) => ({
      id: r.Id,
      name: r.Name,
      company: r.Company ?? "",
      status: (r.Status ?? "").toLowerCase().replace(/\s+/g, "-"),
      value: r["Deal Value"] ?? 0,
      stage: r.Stage ?? "",
      probability: stageToProbability(r.Stage),
      owner: r.Owner ?? "",
      icpMatch: !!r["ICP Match"],
      budgetConfirmed: !!r["Budget Confirmed"],
      decisionMakerIdentified: !!r["Decision Maker Identified"],
      timeline: r.Timeline ?? "",
      daysInStage: r["Days in Stage"] ?? 0,
      leadSource: r["Lead Source"] ?? "",
      notes: r.Notes ?? "",
    }))
    return NextResponse.json({ deals })
  } catch (e) {
    console.error("Sell pipeline API error, falling back to mock:", e)
    return NextResponse.json({ deals: mockSellPipeline })
  }
}

const SELL_TABLE = "md91oklmw9u9ua6"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const record = await createRecord<NocoSell>(SELL_TABLE, body)
    return NextResponse.json(record, { status: 201 })
  } catch (e) {
    console.error("Sell create error:", e)
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
  }
}
