import { NextResponse, NextRequest } from "next/server"
import { updateRecord, deleteRecord } from "@/lib/nocodb"

const BUILD_TABLE = "mm3e7zzulgzj0fb"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const record = await updateRecord(BUILD_TABLE, Number(id), body)
    return NextResponse.json(record)
  } catch (e) {
    console.error("Build update error:", e)
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteRecord(BUILD_TABLE, Number(id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Build delete error:", e)
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 })
  }
}
