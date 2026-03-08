"use client"

import { Badge } from "@/components/ui/badge"

function maskToken(val: string | undefined): string {
  if (!val) return "not set"
  if (val.length <= 8) return "****"
  return val.slice(0, 4) + "****" + val.slice(-4)
}

const ENV_KEYS = [
  "NOCODB_URL",
  "NOCODB_TOKEN",
  "NOCODB_EOS_BASE",
  "NOCODB_MARKETING_BASE",
  "ZAMMAD_URL",
  "ZAMMAD_TOKEN",
  "OPENCLAW_AGENTS_PATH",
  "OPENCLAW_CRON_PATH",
] as const

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-page-title text-text-primary">Settings</h1>
      </div>

      {/* System Info */}
      <section className="mb-6">
        <h2 className="text-label text-text-muted mb-3">System</h2>
        <div className="rounded-[14px] border border-border bg-surface p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-label text-text-muted block mb-1">App</span>
              <span className="text-meta text-text-primary">The Cockpit</span>
            </div>
            <div>
              <span className="text-label text-text-muted block mb-1">Framework</span>
              <span className="text-meta text-text-primary">Next.js 15</span>
            </div>
            <div>
              <span className="text-label text-text-muted block mb-1">Version</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border border-violet/30 text-violet-light">
                Sprint 2
              </Badge>
            </div>
            <div>
              <span className="text-label text-text-muted block mb-1">Theme</span>
              <span className="text-meta text-text-primary">Dark</span>
            </div>
          </div>
        </div>
      </section>

      {/* Environment Configuration */}
      <section className="mb-6">
        <h2 className="text-label text-text-muted mb-3">Environment</h2>
        <div className="rounded-[14px] border border-border bg-surface overflow-hidden">
          <div className="divide-y divide-border">
            {ENV_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-meta text-text-primary font-mono">{key}</span>
                <span className="text-meta text-text-muted font-mono">
                  {maskToken(process.env[`NEXT_PUBLIC_${key}`] ?? (typeof window === "undefined" ? "server-only" : undefined))}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-text-muted mt-2">
          Environment variables are set server-side. Values shown are masked for security.
        </p>
      </section>

      {/* Placeholder */}
      <section>
        <h2 className="text-label text-text-muted mb-3">Preferences</h2>
        <div className="rounded-[14px] border border-border bg-surface p-6 text-center">
          <p className="text-meta text-text-muted">
            More settings coming soon.
          </p>
        </div>
      </section>
    </div>
  )
}
