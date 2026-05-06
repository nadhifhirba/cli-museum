# CLI Quote Museum API Documentation

## Overview

This document describes the public APIs and data structures used in the CLI Quote Museum application.

## Table of Contents

- [Type Definitions](#type-definitions)
- [Store APIs](#store-apis)
- [Service APIs](#service-apis)
- [Components](#components)

## Type Definitions

### Quote

The core data structure representing a captured quote.

```typescript
interface Quote {
  id: string;                    // Unique identifier
  text: string;                  // The quote text
  context: string;               // Context about when/why
  source: 'Claude' | 'Gemini' | 'Kimi' | 'Codex' | 'User' | 'Z.ai' | 'MiMo' | 'OpenCode';
  date: string;                  // ISO date (YYYY-MM-DD)
  tags: string[];                // Categorization tags
  sessionRef: string;            // Reference to source session
  conversationThread?: {         // AI responses (Feature 3)
    responses: AIResponse[];
    rootQuoteId: string;
  };
  contextSnapshot?: {            // Full context (Feature 4)
    transcript: string;
    filesOpen: FileSnapshot[];
    gitStatus: string;
    gitHead: string;
    terminalScreenshot?: string;
  };
  captureMetadata?: {            // Live capture info (Feature 1)
    capturedAt: Date;
    detectionConfidence: number;
    rawContext: string;
    detectionMethod: 'regex' | 'llm' | 'manual';
  };
}
```

### Session

Represents a full CLI coding session.

```typescript
interface Session {
  id: string;
  tool: string;
  startTime: Date;
  endTime?: Date;
  transcript: string;
  fileSnapshots: FileSnapshot[];
  gitHead: string;
  gitDiff?: string;
  tokenUsage?: number;
  quotes: string[];
  terminalScreenshot?: string;
}
```

### AIResponse

A generated response from another AI assistant.

```typescript
interface AIResponse {
  id: string;
  quoteId: string;
  respondingAs: 'Claude' | 'Gemini' | 'Kimi' | 'Codex' | 'Z.ai';
  responseText: string;
  generatedAt: Date;
  personality: 'sassy' | 'technical' | 'philosophical';
}
```

### TokenFlow

Visualization data for token consumption.

```typescript
interface TokenFlow {
  tool: string;
  totalTokens: number;
  particles: TokenParticle[];
  color: string;
}

interface TokenParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tokens: number;
  tool: string;
}
```

## Store APIs

### useQuoteStore

Core store for quotes and sessions.

```typescript
const {
  quotes,                    // Quote[] - all quotes
  sessions,                  // Map<string, Session>
  
  // Actions
  addQuote,                  // (quote: Quote) => void
  removeQuote,               // (id: string) => void
  updateQuote,               // (id: string, updates: Partial<Quote>) => void
  
  // Session management
  loadSession,               // (sessionRef: string) => Promise<Session | null>
  getSession,                // (sessionRef: string) => Session | undefined
  
  // Conversation (Feature 3)
  generateResponse,          // (quoteId: string, asTool: string, personality: Personality) => Promise<void>
  
  // Queries
  getQuoteById,              // (id: string) => Quote | undefined
  getQuotesBySession,        // (sessionRef: string) => Quote[]
  getQuotesByTag,            // (tag: string) => Quote[]
  getRandomQuote,            // () => Quote
} = useQuoteStore();
```

### useLiveStore

Live capture stream state management.

```typescript
const {
  isLive,                    // boolean
  connectionStatus,          // 'connected' | 'disconnected' | 'connecting' | 'error'
  pendingQuotes,             // PendingQuote[]
  capturedToday,             // number
  immortalizedToday,         // number
  discardedToday,            // number
  
  // Actions
  toggleLive,                // () => void
  setConnectionStatus,       // (status: ConnectionStatus) => void
  addPending,                // (quote: Omit<PendingQuote, 'receivedAt' | 'expiresAt'>) => void
  immortalize,               // (id: string) => void
  discard,                   // (id: string) => void
  clearExpired,              // () => void
  resetDailyStats,           // () => void
} = useLiveStore();
```

### useTokenStore

Token burn visualization state.

```typescript
const {
  flowData,                  // TokenFlow[]
  isAnimating,               // boolean
  animationSpeed,            // number (0.1 - 3)
  showCostOverlay,           // boolean
  toggleAnimation,           // () => void
  setAnimationSpeed,         // (speed: number) => void
  simulateFlow,              // () => void
} = useTokenStore();
```

### useViewStore

Navigation state between views.

```typescript
const {
  view,                      // { current: MuseumView, previous: MuseumView, ... }
  timeMachineOpen,           // boolean
  selectedQuoteId,           // string | null
  
  // Actions
  navigateTo,                // (view: MuseumView) => void
  goBack,                    // () => void
  openTimeMachine,           // (quoteId: string) => void
  closeTimeMachine,          // () => void
} = useViewStore();
```

## Service APIs

### aiResponder

Generate AI responses for quote conversations.

```typescript
// Generates a response from specified AI assistant
async function generateAIResponse(
  quote: Quote,
  respondingAs: AIResponse['respondingAs'],
  personality: AIResponse['personality']
): Promise<AIResponse>;

// Requires VITE_GEMINI_API_KEY environment variable
// Falls back to canned responses if API unavailable
```

### obsidianConnector

Read session data from Obsidian Vault.

```typescript
// Load full session from vault
async function getSessionFromVault(sessionRef: string): Promise<Session | null>;

// Search vault for sessions
async function searchSessions(query: string): Promise<Session[]>;

// Get file content at specific git commit
async function getFileAtCommit(filePath: string, commitHash: string): Promise<string>;
```

### websocketClient

WebSocket connection for live capture.

```typescript
// Get singleton WebSocket client
function getWebSocketClient(url?: string): WebSocketClient;

// React hook for connection status
function useWebSocketConnection(
  url?: string,
  onMessage?: (quote: PendingQuote) => void
): ConnectionStatus;
```

## MCP Server Tools

The MCP Capture Server exposes these tools to Claude Code:

### capture_quote

Manually capture a quotable moment.

```json
{
  "name": "capture_quote",
  "arguments": {
    "text": "Quote text here",
    "context": "When/why this was said",
    "source": "Claude",
    "tags": ["humor", "technical"]
  }
}
```

### detect_quotes

Auto-detect quotable moments in CLI output.

```json
{
  "name": "detect_quotes",
  "arguments": {
    "recentOutput": "...terminal output...",
    "sessionRef": "ClaudeSession_2026-04-07"
  }
}
```

### get_capture_status

Check connection status.

```json
{
  "name": "get_capture_status",
  "arguments": {}
}
```

## Design Tokens

### Colors

```css
--background: #0a0a0a
--foreground: #ffffff
--primary: #FF6B35 (orange accent)
--secondary: #1a1a1a
--muted: #262626
--muted-foreground: #a3a3a3
--border: #222222
```

### Spacing

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
```

### Radius

```css
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
```
