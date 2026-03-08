"use client"

import { useEffect, useState, useCallback } from "react"

export interface LiveEvent {
  type: "log" | "connected" | "error"
  level?: string
  message?: string
  ts: string
}

export function useEvents(maxEvents = 50) {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [connected, setConnected] = useState(false)

  const addEvent = useCallback((event: LiveEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, maxEvents))
  }, [maxEvents])

  useEffect(() => {
    let es: EventSource | null = null
    let retryTimeout: ReturnType<typeof setTimeout> | null = null

    function connect() {
      es = new EventSource("/api/events")

      es.onopen = () => setConnected(true)

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as LiveEvent
          if (data.type === "connected") {
            setConnected(true)
          } else {
            addEvent(data)
          }
        } catch {}
      }

      es.onerror = () => {
        setConnected(false)
        es?.close()
        // Retry after 5s
        retryTimeout = setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      es?.close()
      if (retryTimeout) clearTimeout(retryTimeout)
    }
  }, [addEvent])

  return { events, connected }
}
