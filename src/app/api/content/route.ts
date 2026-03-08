import { NextResponse } from "next/server"

const NOCODB_URL = process.env.NOCODB_URL
const NOCODB_TOKEN = process.env.NOCODB_TOKEN
const NOCODB_MARKETING_BASE = process.env.NOCODB_MARKETING_BASE

interface NocoContent {
  Id: number
  Title: string
  Type: string
  Status: string
  "Assigned Agent": string
}

const mockContent = [
  { id: 1, title: "Q1 Product Launch Blog Post", type: "Blog", status: "Draft", agent: "Content Writer" },
  { id: 2, title: "Symphony OS Overview Video Script", type: "Video", status: "In Review", agent: "Content Writer" },
  { id: 3, title: "Agent Architecture Deep Dive", type: "Blog", status: "Approved", agent: "Technical Writer" },
  { id: 4, title: "Customer Success Story — Acme Corp", type: "Case Study", status: "Published", agent: "Content Writer" },
  { id: 5, title: "Weekly Newsletter #12", type: "Email", status: "Draft", agent: "Content Writer" },
]

export async function GET() {
  try {
    if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_MARKETING_BASE) {
      throw new Error("NocoDB marketing env vars not configured")
    }

    const url = new URL(
      `/api/v1/db/data/noco/${NOCODB_MARKETING_BASE}/mv7p3oi6foq255m`,
      NOCODB_URL
    )

    const res = await fetch(url.toString(), {
      headers: { "xc-token": NOCODB_TOKEN },
      next: { revalidate: 30 },
    })

    if (!res.ok) throw new Error(`NocoDB error ${res.status}`)

    const data = await res.json()
    const items = (data.list ?? []).map((r: NocoContent) => ({
      id: r.Id,
      title: r.Title ?? "",
      type: r.Type ?? "",
      status: r.Status ?? "Draft",
      agent: r["Assigned Agent"] ?? "",
    }))

    return NextResponse.json({ items })
  } catch (e) {
    console.error("Content API error, falling back to mock:", e)
    return NextResponse.json({ items: mockContent })
  }
}
