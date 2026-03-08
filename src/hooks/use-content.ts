import useSWR from "swr"

export interface ContentItem {
  id: number
  title: string
  type: string
  status: string
  agent: string
}

export function useContent() {
  const { data, error, isLoading } = useSWR<{ items: ContentItem[] }>("/api/content")
  return {
    items: data?.items ?? [],
    isLoading,
    error,
  }
}
