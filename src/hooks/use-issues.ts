import useSWR from "swr"

export interface Issue {
  id: number
  title: string
  status: string
  priority: string
  assignee: string
  created: string
}

export function useIssues() {
  const { data, error, isLoading } = useSWR<{ issues: Issue[] }>("/api/issues")
  return {
    issues: data?.issues ?? [],
    isLoading,
    error,
  }
}
