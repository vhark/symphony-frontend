import { NextResponse } from "next/server"
import { readdirSync, readFileSync, existsSync } from "fs"
import { join, resolve } from "path"

const mockAgents = [
  { id: 1, name: "Content Writer", status: "active", type: "creator", lastActive: "2026-03-04T10:58:00Z", tasksCompleted: 142 },
  { id: 2, name: "SEO Analyzer", status: "running", type: "analyzer", lastActive: "2026-03-04T10:56:00Z", tasksCompleted: 89 },
  { id: 3, name: "CRM Sync", status: "active", type: "integrator", lastActive: "2026-03-04T10:51:00Z", tasksCompleted: 1204 },
  { id: 4, name: "Code Reviewer", status: "running", type: "reviewer", lastActive: "2026-03-04T10:47:00Z", tasksCompleted: 67 },
  { id: 5, name: "Deploy Bot", status: "error", type: "devops", lastActive: "2026-03-04T10:41:00Z", tasksCompleted: 312 },
  { id: 6, name: "Data Pipeline", status: "active", type: "processor", lastActive: "2026-03-04T10:34:00Z", tasksCompleted: 2891 },
]

function parseIdentity(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of content.split("\n")) {
    const match = line.match(/^[-*]\s*\*\*(.+?)\*\*:\s*(.+)/)
    if (match) {
      result[match[1].trim()] = match[2].trim()
    }
  }
  return result
}

function getLatestDigest(agentDir: string): string | null {
  const reportsDir = join(agentDir, "reports")
  if (!existsSync(reportsDir)) return null

  try {
    const files = readdirSync(reportsDir)
      .filter((f) => f.endsWith("-digest.md"))
      .sort()
      .reverse()

    if (files.length === 0) return null
    return readFileSync(join(reportsDir, files[0]), "utf-8")
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const agentsPath = process.env.OPENCLAW_AGENTS_PATH
      ? resolve(process.env.OPENCLAW_AGENTS_PATH.replace(/^~/, process.env.HOME ?? ""))
      : null

    if (!agentsPath || !existsSync(agentsPath)) throw new Error("OPENCLAW_AGENTS_PATH not found")

    const dirs = readdirSync(agentsPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())

    const agents = dirs.map((dir, i) => {
      const agentDir = join(agentsPath, dir.name)
      const identityPath = join(agentDir, "IDENTITY.md")
      let identity: Record<string, string> = {}

      if (existsSync(identityPath)) {
        identity = parseIdentity(readFileSync(identityPath, "utf-8"))
      }

      const digest = getLatestDigest(agentDir)

      return {
        id: i + 1,
        slug: dir.name,
        name: identity["Name"] ?? dir.name,
        creature: identity["Creature"] ?? "",
        vibe: identity["Vibe"] ?? "",
        emoji: identity["Emoji"] ?? "",
        model: identity["Model"] ?? "",
        status: "active",
        latestDigest: digest ? digest.slice(0, 500) : null,
      }
    })

    return NextResponse.json({ agents })
  } catch (e) {
    console.error("Agents API error, falling back to mock:", e)
    return NextResponse.json({ agents: mockAgents })
  }
}
