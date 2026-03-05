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
