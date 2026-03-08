import useSWR from "swr"

export interface CronJob {
  id: string | number
  name: string
  schedule: string
  enabled: boolean
  timezone: string
  kind: string
  status: string
  lastRunAt?: string | null
  nextRunAt?: string | null
  lastStatus?: string | null
  lastDurationMs?: number | null
}

export function useCron() {
  const { data, error, isLoading } = useSWR<{ jobs: CronJob[] }>("/api/cron")
  return {
    jobs: data?.jobs ?? [],
    isLoading,
    error,
  }
}
