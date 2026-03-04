# Symphony OS — The Cockpit
## Project Specification for Initial Scaffold

### Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui components
- No additional UI frameworks

### Design System

```css
/* Base palette */
--background: #080808;
--surface: rgba(255,255,255,0.06);
--surface-hover: rgba(255,255,255,0.09);
--border: rgba(255,255,255,0.10);
--border-strong: rgba(255,255,255,0.18);
--text-primary: rgba(255,255,255,0.92);
--text-secondary: rgba(255,255,255,0.55);
--text-muted: rgba(255,255,255,0.35);
--accent: #7c3aed;
--accent-light: #8b5cf6;
--status-active: #22c55e;
--status-warning: #f59e0b;
--status-error: #ef4444;
--status-idle: rgba(255,255,255,0.30);
--radius-sm: 12px;
--radius-md: 14px;
--radius-lg: 16px;
--radius-xl: 20px;
```

Typography: System fonts. Monospace for logs/metrics. Type scale: 11px labels, 12px meta, 13px secondary, 14px body, 16px card titles, 20px section headers, 24px page titles.

### App Shell
Left sidebar (56px collapsed / 220px expanded) with nav items: Mission Control, Agents, Automations, Build Backlog, Sell Pipeline, Issues, Content Queue, Settings.

### Mission Control Page (/) — 4 Zones
1. **Top Bar (sticky)**: Rocks status + Scorecard metrics
2. **Attention Surface**: Items needing human decision with action buttons
3. **Live Agent Feed**: Real-time scrolling agent activity
4. **Build & Sell (50/50 split)**: Track health + active projects per track

### API Routes (app/api/)
- rocks, scorecard, todos → NocoDB proxy
- pipeline/build, pipeline/sell → NocoDB proxy
- projects, metrics → NocoDB proxy
- agents → reads agent roster
- cron → reads jobs.json
- issues → Zammad API proxy
- events → SSE stream

### Environment Variables (.env.local)
```
NOCODB_URL=https://nocodb.dghtr.nohost.me
NOCODB_TOKEN=e8G92Jtgrcov6R4r8YRTZbAoQ_RNPWAQIo2q5m23
NOCODB_EOS_BASE=p6za205at5m1298
NOCODB_MARKETING_BASE=pw4mbvsyd1d78i8
ZAMMAD_URL=https://help.wvs.lol
ZAMMAD_TOKEN=xtxgLLVgwmNADRlCXFK8wWaqjpxB-ZUm7zcVSqew4Kj3YsrbMFK3AI0Fkj0at2Q3
OPENCLAW_WORKSPACE=/home/vvaves/clawd
OPENCLAW_CRON_PATH=/home/vvaves/.openclaw/cron/jobs.json
OPENCLAW_AGENTS_PATH=/home/vvaves/clawd/agents
ADMIN_TOKEN=cockpit-admin-2026
```

### NocoDB Table IDs (EOS Base p6za205at5m1298)
Scorecard=mcqmr6cylpy0tca, Rocks=m6x6stxsom9yx0i, Issues=mx1wz4k9cyu98ur, ToDos=m0g3yga2m1yhere, Projects=m1wj32l3k95m4mh, Measurables=mm3lyrsnydecfwn, Agent Roster=mii3eoy4r416l5s, Sell Pipeline=md91oklmw9u9ua6, Build Backlog=mm3e7zzulgzj0fb, Track Metrics=mt19gd08wjazz6i

### Build Priority
1. create-next-app with TypeScript + Tailwind + App Router
2. shadcn/ui setup
3. Global CSS with design system tokens
4. App shell (sidebar + main content)
5. Mission Control with all 4 zones (mock data first)
6. NocoDB API routes
7. Zammad issues API route
8. Cron jobs API route
9. Wire Mission Control to live data
10. Agents page
