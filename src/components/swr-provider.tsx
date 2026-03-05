"use client"

import { SWRConfig } from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 30_000,
        revalidateOnFocus: true,
      }}
    >
      {children}
    </SWRConfig>
  )
}
