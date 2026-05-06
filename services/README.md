# CLI Museum Live Capture System

Real-time quote capture from CLI sessions via MCP (Model Context Protocol).

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
│  (Node.js)      │                   │                  │
└─────────────────┘                   └──────────────────┘
```

## Components

### 1. WebSocket Bridge (`websocket-bridge/`)
Simple relay server that broadcasts quotes to all connected museum clients.

**Start:**
```bash
node services/websocket-bridge/index.js
```

**Port:** 8765 (configurable via `WS_PORT` env var)

### 2. MCP Capture Server (`mcp-capture/`)
MCP-compliant server that integrates with Claude Code (and other MCP clients).

**Build:**
```bash
cd services/mcp-capture
npm install
npm run build
```

**Tools:**
- `capture_quote` — Manually capture a quote
- `detect_quotes` — Auto-detect quotable moments in recent output
- `get_capture_status` — Check connection status

### 3. Detectors
Pattern-based detection of quotable moments:

**wittyDetector.ts:**
- GAS POL triggers
- Meta-commentary about AI
- Token burn observations
- Architecture insights
- Design philosophy

**errorDetector.ts:**
- Build failures with commentary
- MCP config confusion
- Process died notifications
- Context transfer issues

## Setup

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

### 3. Enable Live Capture in Museum
Open http://localhost:5173 and:
- Press ⌘K or click "LIVE" in the feature toolbar
- Toggle "START CAPTURE"

## Usage

### Manual Capture
In Claude Code, the agent can now use:
```
capture_quote {
  "text": "200M tokens in 48 hours. That's not coding, that's performance art.",
  "context": "Commentary on MiMo token consumption",
  "source": "Claude",
  "tags": ["mimo", "tokens", "burn"]
}
```

### Auto-Detection
```
detect_quotes {
  "recentOutput": "...terminal output here...",
  "sessionRef": "ClaudeSession_2026-04-07"
}
```

### Museum Integration
When Live Capture is enabled:
1. Quotes appear in the pending queue
2. Click ★ to immortalize (add to museum)
3. Click ✕ to discard
4. Auto-expires after 5 minutes

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MUSEUM_WS_URL` | `ws://localhost:8765` | WebSocket endpoint |
| `DETECTION_MODE` | `regex` | Detection strategy |
| `WS_PORT` | `8765` | Bridge server port |
| `WS_HOST` | `localhost` | Bridge server host |

## Detection Confidence Levels

- **0.95**: GAS POL triggers, iconic phrases
- **0.85**: Architecture insights, MCP commentary
- **0.80**: Token observations, errors
- **0.75**: Design philosophy, general wit

## Next Steps

Phase 3: Token Burn Visualization (canvas-based particle system)
Phase 4: Quote Conversations (AI cross-responses)
Phase 5: Context Time Machine (Obsidian vault integration)
