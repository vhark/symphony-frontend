const ZAMMAD_URL = process.env.ZAMMAD_URL
const ZAMMAD_TOKEN = process.env.ZAMMAD_TOKEN

export interface ZammadTicket {
  id: number
  number: string
  title: string
  state: string
  priority: string
  group: string
  group_id: number
  owner: string
  customer: string
  customer_id: number
  created_at: string
  updated_at: string
  ticket_type: string | null
  intake_source: string | null
  product_area: string | null
  impact: string | null
  article_count: number
  tags: string[]
}

// The expanded Zammad response shape (expand=true flattens associations to strings)
interface ZammadExpandedTicket {
  id: number
  number: string
  title: string
  state: string
  priority: string
  group: string
  group_id: number
  owner: string
  customer: string
  customer_id: number
  created_at: string
  updated_at: string
  ticket_type?: string | null
  intake_source?: string | null
  product_area?: string | null
  impact?: string | null
  article_count?: number
  tags?: string[] | string
}

function headers() {
  return {
    Authorization: `Token token=${ZAMMAD_TOKEN}`,
    "Content-Type": "application/json",
  }
}

function assertEnv() {
  if (!ZAMMAD_URL || !ZAMMAD_TOKEN) {
    throw new Error("Zammad env vars not configured")
  }
}

function normalizeTicket(t: ZammadExpandedTicket): ZammadTicket {
  let tags: string[] = []
  if (Array.isArray(t.tags)) tags = t.tags
  else if (typeof t.tags === "string" && t.tags) tags = t.tags.split(",").map((s) => s.trim()).filter(Boolean)

  return {
    id: t.id,
    number: t.number ?? String(t.id),
    title: t.title,
    state: t.state ?? "new",
    priority: t.priority ?? "2 normal",
    group: t.group ?? "",
    group_id: t.group_id,
    owner: t.owner ?? "",
    customer: t.customer ?? "",
    customer_id: t.customer_id,
    created_at: t.created_at,
    updated_at: t.updated_at,
    ticket_type: t.ticket_type ?? null,
    intake_source: t.intake_source ?? null,
    product_area: t.product_area ?? null,
    impact: t.impact ?? null,
    article_count: t.article_count ?? 0,
    tags,
  }
}

export interface FetchTicketsParams {
  per_page?: number
  page?: number
  order_by?: string
  sort_by?: string
}

export async function fetchTickets(params?: FetchTicketsParams): Promise<ZammadTicket[]> {
  assertEnv()
  const sp = new URLSearchParams({ expand: "true", per_page: String(params?.per_page ?? 100) })
  if (params?.page) sp.set("page", String(params.page))
  if (params?.order_by) sp.set("order_by", params.order_by)
  if (params?.sort_by) sp.set("sort_by", params.sort_by)

  const res = await fetch(`${ZAMMAD_URL}/api/v1/tickets?${sp}`, {
    headers: headers(),
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Zammad error ${res.status}: ${res.statusText}`)
  const data: ZammadExpandedTicket[] = await res.json()
  return data.map(normalizeTicket)
}

export async function fetchTicket(id: number): Promise<ZammadTicket> {
  assertEnv()
  const res = await fetch(`${ZAMMAD_URL}/api/v1/tickets/${id}?expand=true`, {
    headers: headers(),
  })
  if (!res.ok) throw new Error(`Zammad error ${res.status}: ${res.statusText}`)
  const data: ZammadExpandedTicket = await res.json()
  return normalizeTicket(data)
}

export interface CreateTicketData {
  title: string
  group_id: number
  priority_id?: number
  state_id?: number
  article: { body: string; type?: string }
  ticket_type?: string
  product_area?: string
  impact?: string
  intake_source?: string
  customer_id?: number
}

export async function createTicket(data: CreateTicketData): Promise<ZammadTicket> {
  assertEnv()
  const body = {
    ...data,
    article: { ...data.article, type: data.article.type ?? "note" },
  }
  const res = await fetch(`${ZAMMAD_URL}/api/v1/tickets?expand=true`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Zammad create error ${res.status}: ${text}`)
  }
  const result: ZammadExpandedTicket = await res.json()
  return normalizeTicket(result)
}

export async function updateTicket(id: number, data: Record<string, unknown>): Promise<ZammadTicket> {
  assertEnv()
  const res = await fetch(`${ZAMMAD_URL}/api/v1/tickets/${id}?expand=true`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Zammad update error ${res.status}: ${text}`)
  }
  const result: ZammadExpandedTicket = await res.json()
  return normalizeTicket(result)
}

export async function deleteTicket(id: number): Promise<void> {
  assertEnv()
  const res = await fetch(`${ZAMMAD_URL}/api/v1/tickets/${id}`, {
    method: "DELETE",
    headers: headers(),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Zammad delete error ${res.status}: ${text}`)
  }
}

export async function searchTickets(query: string): Promise<ZammadTicket[]> {
  assertEnv()
  const sp = new URLSearchParams({ query, expand: "true", per_page: "50" })
  const res = await fetch(`${ZAMMAD_URL}/api/v1/tickets/search?${sp}`, {
    headers: headers(),
  })
  if (!res.ok) throw new Error(`Zammad search error ${res.status}: ${res.statusText}`)
  const data = await res.json()
  // Search returns { tickets: [...], assets: {...} } or just array depending on version
  const tickets: ZammadExpandedTicket[] = Array.isArray(data) ? data : (data.assets?.Ticket ? Object.values(data.assets.Ticket) : [])
  return tickets.map(normalizeTicket)
}
