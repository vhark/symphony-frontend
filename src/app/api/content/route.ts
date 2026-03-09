import { NextResponse } from "next/server"

const NOCODB_URL = process.env.NOCODB_URL
const NOCODB_TOKEN = process.env.NOCODB_TOKEN
const NOCODB_MARKETING_BASE = process.env.NOCODB_MARKETING_BASE
const TABLE_ID = "mv7p3oi6foq255m"

export interface ContentItem {
  id: number
  title: string
  contentType: string
  platform: string
  status: string
  body: string
  expertName: string
  publishedUrl: string | null
  publishedAt: string | null
  briefId: string | null
}

interface NocoContent {
  Id: number
  Title: string
  "Content Type": string
  Platform: string
  Status: string
  Body: string
  "Expert Name": string
  "Published URL": string | null
  "Published At": string | null
  "Brief ID": string | null
}

function baseUrl() {
  return `${NOCODB_URL}/api/v1/db/data/noco/${NOCODB_MARKETING_BASE}/${TABLE_ID}`
}

function headers() {
  return { "xc-token": NOCODB_TOKEN!, "Content-Type": "application/json" }
}

function mapRow(r: NocoContent): ContentItem {
  return {
    id: r.Id,
    title: r.Title ?? "",
    contentType: r["Content Type"] ?? "",
    platform: r.Platform ?? "",
    status: r.Status ?? "idea",
    body: r.Body ?? "",
    expertName: r["Expert Name"] ?? "",
    publishedUrl: r["Published URL"] ?? null,
    publishedAt: r["Published At"] ?? null,
    briefId: r["Brief ID"] ?? null,
  }
}

export async function GET() {
  try {
    if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_MARKETING_BASE) throw new Error("NocoDB env not set")
    const res = await fetch(`${baseUrl()}?limit=200`, { headers: headers(), cache: "no-store" })
    if (!res.ok) throw new Error(`NocoDB ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ items: (data.list ?? []).map(mapRow) })
  } catch (e) {
    console.error("Content GET error:", e)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(req: Request) {
  try {
    if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_MARKETING_BASE) throw new Error("NocoDB env not set")
    const body = await req.json()
    const res = await fetch(baseUrl(), {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`NocoDB POST ${res.status}`)
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
