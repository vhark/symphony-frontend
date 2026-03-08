/**
 * Cockpit proxy client — calls nova2601:3031 for filesystem-backed data
 * (agents, cron jobs, SSE events)
 */

const PROXY_URL = process.env.COCKPIT_PROXY_URL || "http://192.168.1.30:3031"
const PROXY_TOKEN = process.env.COCKPIT_PROXY_TOKEN || ""

export async function proxyFetch(path: string, options: RequestInit = {}) {
  const url = `${PROXY_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${PROXY_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    // Don't cache proxy responses at build time
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Proxy ${path} → ${res.status}`)
  return res
}

export function getProxyUrl(path: string) {
  return `${PROXY_URL}${path}`
}

export function getProxyToken() {
  return PROXY_TOKEN
}
