// CLI Quote Museum v2.0 — Extended Type Definitions
// Foundation for all 4 radical features

// ============================================================================
// CORE DATA MODELS
// ============================================================================

export interface Quote {
  id: string;
  text: string;
  context: string;
  source: 'Claude' | 'Gemini' | 'Kimi' | 'Codex' | 'User' | 'Z.ai' | 'MiMo' | 'OpenCode';
  date: string;
  tags: string[];
  sessionRef: string;
  
  // Feature 3: Quote Conversations
  conversationThread?: ConversationThread;
  
  // Feature 4: Context Time Machine
  contextSnapshot?: ContextSnapshot;
  
  // Feature 1: Live Capture
  captureMetadata?: CaptureMetadata;
}

export interface ConversationThread {
  responses: AIResponse[];
  rootQuoteId: string;
  generatedAt: Date;
}

export interface AIResponse {
  id: string;
  quoteId: string;
  respondingAs: 'Claude' | 'Gemini' | 'Kimi' | 'Codex' | 'Z.ai';
  responseText: string;
  generatedAt: Date;
  personality: 'sassy' | 'technical' | 'philosophical';
}

export interface ContextSnapshot {
  transcript: string;
  filesOpen: FileSnapshot[];
  gitStatus: string;
  gitHead: string;
  terminalScreenshot?: string;
}

export interface FileSnapshot {
  path: string;
  content?: string;
  language?: string;
}

export interface CaptureMetadata {
  capturedAt: Date;
  detectionConfidence: number;
  rawContext: string;
  detectionMethod: 'regex' | 'llm' | 'manual';
}

// ============================================================================
// SESSION MODEL (Feature 4: Time Machine)
// ============================================================================

export interface Session {
  id: string;
  tool: string;
  startTime: Date;
  endTime?: Date;
  transcript: string;
  fileSnapshots: FileSnapshot[];
  gitHead: string;
  gitDiff?: string;
  tokenUsage?: number;
  quotes: string[]; // Quote IDs from this session
  terminalScreenshot?: string;
}

// ============================================================================
// TOKEN FLOW MODEL (Feature 2: Token Burn Visualization)
// ============================================================================

export interface TokenFlow {
  tool: string;
  totalTokens: number;
  particles: TokenParticle[];
  color: string;
}

export interface TokenParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tokens: number;
  tool: string;
}

export interface TokenTimeRange {
  start: Date;
  end: Date;
}

// ============================================================================
// LIVE CAPTURE MODEL (Feature 1: Live Stream)
// ============================================================================

export interface PendingQuote extends Quote {
  receivedAt: Date;
  expiresAt: Date; // Auto-discard after 5 minutes if not actioned
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// ============================================================================
// STATS & COMPARISONS (Existing)
// ============================================================================

export interface TokenStats {
  totalTokens: number;
  byTool: Record<string, number>;
  byMonth: Record<string, number>;
  wittyComparisons: Comparison[];
}

export interface Comparison {
  metric: string;
  value: number;
  unit: string;
  description: string;
}

// ============================================================================
// VIEW STATES
// ============================================================================

export type MuseumView = 'museum' | 'live' | 'tokens' | 'conversations' | 'timeline';

export interface ViewState {
  current: MuseumView;
  previous: MuseumView;
  transitionDirection: 'left' | 'right' | 'none';
}
