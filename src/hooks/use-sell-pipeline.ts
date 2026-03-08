import useSWR from "swr"

export interface SellDeal {
  id: number
  name: string
  status: string
  value: number
  stage: string
  probability: number
  company: string
  owner: string
  icpMatch: boolean
  budgetConfirmed: boolean
  decisionMakerIdentified?: boolean
  timeline: string
  daysInStage: number
  leadSource: string
  notes: string
}

export interface DealFormData {
  Name: string
  Company: string
  Stage: string
  Status: string
  Owner: string
  "Deal Value": number
  Timeline: string
  "ICP Match": boolean
  "Budget Confirmed": boolean
  "Decision Maker Identified": boolean
  "Lead Source": string
  Notes: string
}

export function useSellPipeline() {
  const { data, error, isLoading, mutate } = useSWR<{ deals: SellDeal[] }>("/api/pipeline/sell")

  async function createDeal(formData: Partial<DealFormData>) {
    await fetch("/api/pipeline/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    await mutate()
  }

  async function updateDeal(id: number, formData: Partial<DealFormData>) {
    await fetch(`/api/pipeline/sell/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    await mutate()
  }

  async function deleteDeal(id: number) {
    await fetch(`/api/pipeline/sell/${id}`, {
      method: "DELETE",
    })
    await mutate()
  }

  return {
    deals: data?.deals ?? [],
    isLoading,
    error,
    mutate,
    createDeal,
    updateDeal,
    deleteDeal,
  }
}
