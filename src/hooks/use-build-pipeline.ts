import useSWR from "swr"

export interface BuildProject {
  id: number
  name: string
  status: string
  progress: number
  assignee: string
  dueDate: string
  priority: string
  stage?: string
}

export function useBuildPipeline() {
  const { data, error, isLoading } = useSWR<{ projects: BuildProject[] }>("/api/pipeline/build")
  return {
    projects: data?.projects ?? [],
    isLoading,
    error,
  }
}
