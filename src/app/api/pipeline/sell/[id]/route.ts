import { NextResponse, NextRequest } from "next/server"
import { updateRecord, deleteRecord } from "@/lib/nocodb"

const SELL_TABLE = "md91oklmw9u9ua6"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const record = await updateRecord(SELL_TABLE, Number(id), body)
    return NextResponse.json(record)
  } catch (e) {
    console.error("Sell update error:", e)
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteRecord(SELL_TABLE, Number(id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Sell delete error:", e)
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 })
  }
}
