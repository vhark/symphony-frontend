import useSWR from "swr"

export interface Agent {
  id: number
  slug?: string
  name: string
  status: string
  emoji?: string
  creature?: string
  vibe?: string
  model?: string
  latestDigest?: string | null
  type?: string
  lastActive?: string
  tasksCompleted?: number
}

export function useAgents() {
  const { data, error, isLoading } = useSWR<{ agents: Agent[] }>("/api/agents")
  return {
    agents: data?.agents ?? [],
    isLoading,
    error,
  }
}
