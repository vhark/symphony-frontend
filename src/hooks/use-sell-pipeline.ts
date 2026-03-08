import useSWR from "swr"

export interface SellDeal {
  id: number
  name: string
  status: string
  value: number
  stage: string
  probability: number
  company?: string
  owner?: string
  icpMatch?: string
  budgetConfirmed?: boolean
  timeline?: string
  daysInStage?: number
  leadSource?: string
  notes?: string
}

export function useSellPipeline() {
  const { data, error, isLoading } = useSWR<{ deals: SellDeal[] }>("/api/pipeline/sell")
  return {
    deals: data?.deals ?? [],
    isLoading,
    error,
  }
}
