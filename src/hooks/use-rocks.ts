import useSWR from "swr"

export interface Rock {
  id: number
  title: string
  status: string
  progress: number
  owner: string
  quarter: string
}

export function useRocks() {
  const { data, error, isLoading } = useSWR<{ rocks: Rock[] }>("/api/rocks")
  return {
    rocks: data?.rocks ?? [],
    isLoading,
    error,
  }
}
