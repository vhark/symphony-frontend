import { NextResponse } from "next/server"

const NOCODB_URL = process.env.NOCODB_URL
const NOCODB_TOKEN = process.env.NOCODB_TOKEN
const NOCODB_MARKETING_BASE = process.env.NOCODB_MARKETING_BASE
const TABLE_ID = "mv7p3oi6foq255m"

function baseUrl() {
  return `${NOCODB_URL}/api/v1/db/data/noco/${NOCODB_MARKETING_BASE}/${TABLE_ID}`
}
function hdr() {
  return { "xc-token": NOCODB_TOKEN!, "Content-Type": "application/json" }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const res = await fetch(baseUrl(), {
      method: "PATCH",
      headers: hdr(),
      body: JSON.stringify({ Id: Number(id), ...body }),
    })
    if (!res.ok) throw new Error(`NocoDB PATCH ${res.status}`)
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await fetch(`${baseUrl()}/${id}`, { method: "DELETE", headers: hdr() })
    if (!res.ok) throw new Error(`NocoDB DELETE ${res.status}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
