import useSWR, { mutate as globalMutate } from "swr"
import { useCallback, useState } from "react"

export interface Issue {
  id: number
  number: string
  title: string
  status: string
  priority: string
  group: string
  groupId: number
  type: string
  source: string
  productArea: string
  impact: string
  owner: string
  customer: string
  customerEmail: string
  created: string
  updated: string
  age: string
  tags: string[]
  articleCount: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useIssues(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : ""
  const key = `/api/issues${params}`
  const { data, error, isLoading, mutate } = useSWR<{ issues: Issue[] }>(key, fetcher, {
    refreshInterval: 30000,
  })
  return {
    issues: data?.issues ?? [],
    isLoading,
    error,
    mutate,
  }
}

export function useIssue(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<{ issue: Issue }>(
    id ? `/api/issues/${id}` : null,
    fetcher
  )
  return {
    issue: data?.issue ?? null,
    isLoading,
    error,
    mutate,
  }
}

export function useCreateIssue() {
  const [loading, setLoading] = useState(false)

  const create = useCallback(async (data: {
    title: string
    description: string
    groupId: number
    priorityId?: number
    type?: string
    productArea?: string
    impact?: string
    source?: string
  }) => {
    setLoading(true)
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`Create failed: ${res.status}`)
      const result = await res.json()
      // Revalidate issues list
      await globalMutate((key: unknown) => typeof key === "string" && key.startsWith("/api/issues"), undefined, { revalidate: true })
      return result.issue as Issue
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading }
}

export function useUpdateIssue() {
  const [loading, setLoading] = useState(false)

  const update = useCallback(async (id: number, data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`Update failed: ${res.status}`)
      const result = await res.json()
      await globalMutate((key: unknown) => typeof key === "string" && key.startsWith("/api/issues"), undefined, { revalidate: true })
      return result.issue as Issue
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading }
}

export function useDeleteIssue() {
  const [loading, setLoading] = useState(false)

  const remove = useCallback(async (id: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/issues/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
      await globalMutate((key: unknown) => typeof key === "string" && key.startsWith("/api/issues"), undefined, { revalidate: true })
    } finally {
      setLoading(false)
    }
  }, [])

  return { remove, loading }
}
