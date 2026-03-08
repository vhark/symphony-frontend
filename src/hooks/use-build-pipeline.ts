import useSWR from "swr"

export interface BuildProject {
  id: number
  name: string
  status: string
  progress: number
  assignee: string
  dueDate: string
  priority: string
  stage: string
  type: string
  complexity: string
  impactScore: number
  notes: string
  customerRequested?: boolean
}

export interface ProjectFormData {
  Name: string
  Type: string
  Stage: string
  Priority: string
  Owner: string
  Complexity: string
  "Impact Score": number
  "Target Release Date": string
  Notes: string
  "Customer Requested": boolean
}

export function useBuildPipeline() {
  const { data, error, isLoading, mutate } = useSWR<{ projects: BuildProject[] }>("/api/pipeline/build")

  async function createProject(formData: Partial<ProjectFormData>) {
    await fetch("/api/pipeline/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    await mutate()
  }

  async function updateProject(id: number, formData: Partial<ProjectFormData>) {
    await fetch(`/api/pipeline/build/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    await mutate()
  }

  async function deleteProject(id: number) {
    await fetch(`/api/pipeline/build/${id}`, {
      method: "DELETE",
    })
    await mutate()
  }

  return {
    projects: data?.projects ?? [],
    isLoading,
    error,
    mutate,
    createProject,
    updateProject,
    deleteProject,
  }
}
