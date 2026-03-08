import { getProxyUrl, getProxyToken } from "@/lib/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const proxyUrl = getProxyUrl("/events")
  const proxyToken = getProxyToken()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch(proxyUrl, {
          headers: { Authorization: `Bearer ${proxyToken}` },
          cache: "no-store",
        })
        if (!res.ok || !res.body) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: "proxy unavailable" })}\n\n`))
          controller.close()
          return
        }
        const reader = res.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: String(e) })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
