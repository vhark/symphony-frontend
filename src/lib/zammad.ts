const ZAMMAD_URL = process.env.ZAMMAD_URL
const ZAMMAD_TOKEN = process.env.ZAMMAD_TOKEN

export interface ZammadTicket {
  id: number
  title: string
  state: { name: string }
  priority: { name: string }
  group: { name: string }
  owner: { firstname: string; lastname: string }
  created_at: string
  updated_at: string
}

export async function fetchTickets(): Promise<ZammadTicket[]> {
  if (!ZAMMAD_URL || !ZAMMAD_TOKEN) {
    throw new Error("Zammad env vars not configured")
  }

  const res = await fetch(`${ZAMMAD_URL}/api/v1/tickets?per_page=50`, {
    headers: {
      Authorization: `Token token=${ZAMMAD_TOKEN}`,
    },
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    throw new Error(`Zammad error ${res.status}: ${res.statusText}`)
  }

  return res.json()
}
