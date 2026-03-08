const NOCODB_URL = process.env.NOCODB_URL
const NOCODB_TOKEN = process.env.NOCODB_TOKEN
const NOCODB_EOS_BASE = process.env.NOCODB_EOS_BASE

interface FetchTableOptions {
  fields?: string[]
  where?: string
  sort?: string[]
  limit?: number
}

export interface NocoDBResponse<T = Record<string, unknown>> {
  list: T[]
  pageInfo: {
    totalRows: number
    page: number
    pageSize: number
    isFirstPage: boolean
    isLastPage: boolean
  }
}

export async function fetchTable<T = Record<string, unknown>>(
  tableId: string,
  options: FetchTableOptions = {}
): Promise<T[]> {
  if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_EOS_BASE) {
    throw new Error("NocoDB env vars not configured")
  }

  const url = new URL(
    `/api/v1/db/data/noco/${NOCODB_EOS_BASE}/${tableId}`,
    NOCODB_URL
  )

  if (options.fields?.length) {
    url.searchParams.set("fields", options.fields.join(","))
  }
  if (options.where) {
    url.searchParams.set("where", options.where)
  }
  if (options.sort?.length) {
    url.searchParams.set("sort", options.sort.join(","))
  }
  if (options.limit) {
    url.searchParams.set("limit", String(options.limit))
  }

  const res = await fetch(url.toString(), {
    headers: {
      "xc-token": NOCODB_TOKEN,
    },
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    throw new Error(`NocoDB error ${res.status}: ${res.statusText}`)
  }

  const data: NocoDBResponse<T> = await res.json()
  return data.list
}

export async function createRecord<T = Record<string, unknown>>(
  tableId: string,
  data: Record<string, unknown>
): Promise<T> {
  if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_EOS_BASE) {
    throw new Error("NocoDB env vars not configured")
  }

  const url = `${NOCODB_URL}/api/v1/db/data/noco/${NOCODB_EOS_BASE}/${tableId}`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xc-token": NOCODB_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`NocoDB create error ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export async function updateRecord<T = Record<string, unknown>>(
  tableId: string,
  id: number,
  data: Record<string, unknown>
): Promise<T> {
  if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_EOS_BASE) {
    throw new Error("NocoDB env vars not configured")
  }

  const url = `${NOCODB_URL}/api/v1/db/data/noco/${NOCODB_EOS_BASE}/${tableId}`
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "xc-token": NOCODB_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Id: id, ...data }),
  })

  if (!res.ok) {
    throw new Error(`NocoDB update error ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export async function deleteRecord(
  tableId: string,
  id: number
): Promise<void> {
  if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_EOS_BASE) {
    throw new Error("NocoDB env vars not configured")
  }

  const url = `${NOCODB_URL}/api/v1/db/data/noco/${NOCODB_EOS_BASE}/${tableId}/${id}`
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "xc-token": NOCODB_TOKEN,
    },
  })

  if (!res.ok) {
    throw new Error(`NocoDB delete error ${res.status}: ${res.statusText}`)
  }
}
