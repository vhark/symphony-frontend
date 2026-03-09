import useSWR from "swr"

export interface ContentItem {
  id: number
  title: string
  contentType: string
  platform: string
  status: string
  body: string
  expertName: string
  publishedUrl: string | null
  publishedAt: string | null
  briefId: string | null
}

export function useContent() {
  const { data, error, isLoading, mutate } = useSWR<{ items: ContentItem[] }>("/api/content")

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Status: status }),
    })
    await mutate()
  }

  async function updateItem(id: number, fields: Record<string, unknown>) {
    await fetch(`/api/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
    await mutate()
  }

  async function createItem(fields: Record<string, unknown>) {
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
    await mutate()
  }

  async function deleteItem(id: number) {
    await fetch(`/api/content/${id}`, { method: "DELETE" })
    await mutate()
  }

  return {
    items: data?.items ?? [],
    isLoading,
    error,
    mutate,
    updateStatus,
    updateItem,
    createItem,
    deleteItem,
  }
}
