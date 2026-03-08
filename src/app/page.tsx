import { RocksBar } from "@/components/mission-control/rocks-bar"
import { AttentionSurface } from "@/components/mission-control/attention-surface"
import { AgentFeed } from "@/components/mission-control/agent-feed"
import { ActivityStream } from "@/components/mission-control/activity-stream"
import { BuildSellTracks } from "@/components/mission-control/build-sell-tracks"

export default function MissionControl() {
  return (
    <div className="flex flex-col">
      {/* Zone 1: RocksBar — sticky top */}
      <RocksBar />

      {/* Main content grid */}
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Zone 2: Attention Surface */}
          <AttentionSurface />

          {/* Zone 4: Build & Sell Tracks */}
          <BuildSellTracks />
        </div>

        {/* Right column — Agent Feed + Activity Stream */}
        <div className="flex flex-col gap-6">
          <AgentFeed />
          <ActivityStream />
        </div>
      </div>
    </div>
  )
}
