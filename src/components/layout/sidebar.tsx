"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { href: "/", label: "Mission Control", icon: "🎯" },
  { href: "/agents", label: "Agents", icon: "🤖" },
  { href: "/automations", label: "Automations", icon: "⚡" },
  { href: "/build", label: "Build Backlog", icon: "🔨" },
  { href: "/sell", label: "Sell Pipeline", icon: "💰" },
  { href: "/issues", label: "Issues", icon: "🎫" },
  { href: "/content", label: "Content Queue", icon: "📝" },
  { href: "/systems", label: "Systems", icon: "🗺️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

export function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-[#080808] transition-all duration-200 ease-out",
        expanded ? "w-[220px]" : "w-[56px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet font-bold text-white text-sm">
          S
        </div>
        <span
          className={cn(
            "text-card-title text-text-primary whitespace-nowrap transition-opacity duration-200",
            expanded ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          Symphony
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-10 items-center gap-3 rounded-[12px] px-3 text-sm transition-all duration-150",
                isActive
                  ? "bg-violet/15 text-violet-light"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <span className="shrink-0 text-base leading-none">{item.icon}</span>
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity duration-200",
                  expanded ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-0 h-5 w-[3px] rounded-r-full bg-violet" />
              )}
            </Link>
          )

          if (expanded) return <div key={item.href}>{linkContent}</div>

          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-1">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs text-text-secondary">
            V
          </div>
          <span
            className={cn(
              "text-meta text-text-secondary whitespace-nowrap transition-opacity duration-200",
              expanded ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            vvaves
          </span>
        </div>
      </div>
    </aside>
  )
}
