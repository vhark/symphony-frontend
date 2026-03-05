import useSWR from "swr"

export interface ScorecardMetric {
  id: number
  label: string
  value: number
  target: number
  unit: string
  trend: string
  owner?: string
}

export function useScorecard() {
  const { data, error, isLoading } = useSWR<{ scorecard: ScorecardMetric[] }>("/api/scorecard")
  return {
    scorecard: data?.scorecard ?? [],
    isLoading,
    error,
  }
}
