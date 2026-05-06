# CLI Quote Museum v2.0

> Where dead conversations go to become immortal.

A curated collection of memorable, witty, and insightful lines from CLI coding sessions across Claude, Gemini, Kimi, Codex, Antigravity, and OpenCode.

![Neo-Industrial Brutalism Design](https://img.shields.io/badge/design-neo--industrial--brutalism-orange)
![React](https://img.shields.io/badge/react-19-blue)
![Vite](https://img.shields.io/badge/vite-latest-purple)
![MCP](https://img.shields.io/badge/MCP-enabled-green)

## Design Philosophy

**Neo-Industrial Brutalism** meets **Developer Nostalgia**:

- Dark mode first, always
- Orange accent (#FF6B35) for energy
- Geist Mono typography for that terminal feel
- CRT scanlines and grid overlays
- Minimal, impactful UI

## Features

### Core
- 🎲 **Random Quote Generator** — Space bar to shuffle
- 📊 **Token Statistics** — Track consumption across all CLI tools
- 🎯 **Witty Comparisons** — "That's X Shakespeare plays worth of prompts"
- 🏷️ **Tag System** — Filter by topics (humor, architecture, debugging, etc.)
- 📋 **One-click Copy** — Share the wisdom
- ⌨️ **Keyboard Shortcuts** — Space to refresh, ⌘K for Live

### Live Capture (New in v2.0)
- 📡 **Real-time Capture** — MCP server captures quotes from CLI sessions
- 🔔 **Pending Queue** — Review and immortalize captured quotes
- 🤖 **Auto-Detection** — Pattern-based detection of witty moments
- ★ **One-click Immortalize** — Add to permanent collection

## Token Consumption Stats

| Tool | Tokens |
|------|--------|
| MiMo (Xiaomi) | 200,102,936 |
| Gemini | 185,000,000 |
| OpenRouter | 175,000,000 |
| Z.ai | 92,000,000 |
| Claude | 85,000,000 |
| Kimi | 55,000,000 |
| OpenCode | 48,000,000 |
| Cursor | 38,000,000 |
| Copilot | 25,000,000 |
| Codex | 15,000,064 |
| **Total** | **947,500,000** |

### Fun Comparisons

That's equivalent to:
- **1,896x** Shakespeare's Complete Works
- **3.4x** training GPT-3
- **55,147x** Harry Potter and the Sorcerer's Stone
- **271x** Indonesian Wikipedia
- **47,375 cups** of coffee consumed

## Live Capture Setup

### 1. Start WebSocket Bridge
```bash
node services/websocket-bridge/index.js
```

### 2. Add MCP Server to Claude Code
Edit `~/.claude.json`:

```json
{
  "mcpServers": {
    "cli-museum-capture": {
      "command": "node",
      "args": ["/Users/malka/cli-museum/services/mcp-capture/dist/index.js"],
      "env": {
        "MUSEUM_WS_URL": "ws://localhost:8765"
      }
    }
  }
}
```

### 3. Enable Live Capture
Open http://localhost:5173 and press **⌘K** or click **LIVE** in the toolbar.

## Tech Stack

- **Framework:** React 19 + Vite
- **State:** Zustand (persisted)
- **Styling:** CSS Variables + Tailwind-ready
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **MCP:** Model Context Protocol
- **Deploy:** Vercel

## Development

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run build
# Deploy dist/ to Vercel
```

## Quote Categories

- **GAS POL** — The magic autonomy trigger
- **Philosophy** — Meta-thoughts on coding and workflows
- **Technical** — TypeScript, React, Docker wisdom
- **MCP** — Model Context Protocol insights
- **Indonesia** — Local tech scene observations
- **AI/LLM** — Thoughts on hallucinations and context windows
- **Debugging** — Console.log poetry
- **Design** — Neo-brutalism principles
- **Architecture** — Microservices vs Monolith debates
- **Productivity** — Deep work and documentation

## Architecture

```
┌─────────────────┐    WebSocket      ┌──────────────────┐
│  Claude Code    │◄─────────────────►│  Museum Frontend │
│  (MCP Client)   │                   │  (React + Zustand)│
└────────┬────────┘                   └──────────────────┘
         │
         │ stdio
         ▼
┌─────────────────┐    WebSocket      ┌──────────────────┐
│  MCP Capture    │◄─────────────────►│  WS Bridge       │
│  Server         │                   │  (Port 8765)     │
└─────────────────┘                   └──────────────────┘
```

## Roadmap

- [x] **Phase 1:** Foundation (Zustand stores, extended types)
- [x] **Phase 2:** Live Capture (MCP + WebSocket)
- [ ] **Phase 3:** Token Burn Visualization (canvas particles)
- [ ] **Phase 4:** Quote Conversations (AI cross-responses)
- [ ] **Phase 5:** Context Time Machine (Obsidian vault)

## Adding Quotes

### Manual
Edit `src/data/quotes.ts` and add to the `quotes` array.

### Via Live Capture
With MCP server enabled, use `capture_quote` tool or let `detect_quotes` auto-find them.

---

Built with ☕ and 🤖 by [NHADesign](https://nhadesign.xyz)
