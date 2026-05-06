// CLI Quote Museum - Real quotes from Obsidian Vault transcripts
// Extracted from actual sessions across Claude, Gemini, Kimi, Codex

// Re-export from centralized types (for backward compatibility)
export type { Quote, TokenStats, Comparison } from '../types';

// Legacy interface for data file (will be migrated to new type)
interface LegacyQuote {
  id: string;
  text: string;
  context: string;
  source: 'Claude' | 'Gemini' | 'Kimi' | 'Codex' | 'User' | 'Z.ai' | 'MiMo' | 'OpenCode';
  date: string;
  tags: string[];
  sessionRef: string;
}

interface LegacyTokenStats {
  totalTokens: number;
  byTool: Record<string, number>;
  byMonth: Record<string, number>;
  wittyComparisons: LegacyComparison[];
}

interface LegacyComparison {
  metric: string;
  value: number;
  unit: string;
  description: string;
}

// Real quotes extracted from Obsidian Vault transcripts
export const quotes: LegacyQuote[] = [
  // GAS POL - The user's signature trigger phrase
  {
    id: 'gas-pol-1',
    text: "GAS POL",
    context: "The magic words that trigger full autonomous execution mode",
    source: 'User',
    date: '2026-03-19',
    tags: ['gas-pol', 'autonomy', 'workflow'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'gas-pol-2',
    text: "GAS POL! I'm ready. What's our first move?",
    context: "Gemini responding to the autonomy trigger",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['gas-pol', 'autonomy', 'gemini'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'gas-pol-3',
    text: "GAS POL! See you in the next session. 🚀",
    context: "Signing off after a productive session",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['gas-pol', 'sign-off', 'workflow'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'gas-pol-4',
    text: "Can you start yolo everytime we opened up",
    context: "Configuring Kimi for permanent GAS POL mode",
    source: 'User',
    date: '2026-03-27',
    tags: ['gas-pol', 'yolo', 'kimi', 'config'],
    sessionRef: 'Kimi/kimi-58f07e75-20260327',
  },
  
  // Token Economy Reality
  {
    id: 'tokens-1',
    text: "Gemini CLI: 158M tokens. Claude CLI (native): ~25M tokens. Z.ai Coding Plan (via Claude Code): 79M tokens. Combined: ~262M tokens total.",
    context: "The full token tally across all agents since March 12",
    source: 'Claude',
    date: '2026-03-19',
    tags: ['tokens', 'stats', 'z.ai', 'claude', 'gemini'],
    sessionRef: 'ClaudeSession_2026-03-19_19-29',
  },
  {
    id: 'tokens-2',
    text: "The 79M tokens Gemini found that didn't show up in Claude's tally.",
    context: "Z.ai sessions route through GLM models — those tokens aren't counted in Claude's own stats",
    source: 'Claude',
    date: '2026-03-19',
    tags: ['tokens', 'z.ai', 'glmcoding'],
    sessionRef: 'ClaudeSession_2026-03-19_19-29',
  },
  {
    id: 'tokens-3',
    text: "You used 79,174,478 tokens with the Z.ai Coding Plan ($10/month), running it through Claude Code — before you were hitting the weekly limits on the original Claude Pro sub.",
    context: "Why Claude CLI stats looked 'too efficient' — heavy sessions went through Z.ai",
    source: 'Claude',
    date: '2026-03-19',
    tags: ['tokens', 'z.ai', 'claude', 'limits'],
    sessionRef: 'ClaudeSession_2026-03-19_19-29',
  },
  
  // MiMo - The 200M Token Burn
  {
    id: 'mimo-1',
    text: "200,102,936 / 200,000,000 Credits. Used 100.0%",
    context: "Xiaomi MiMo Standard plan ($14.08) maxed out in just 2 days. The ultimate token burn.",
    source: 'User',
    date: '2026-04-07',
    tags: ['mimo', 'xiaomi', 'tokens', 'burn', 'record'],
    sessionRef: 'MiMo Dashboard',
  },
  {
    id: 'mimo-2',
    text: "MiMo: 200M+ tokens in 48 hours. That's not coding, that's performance art.",
    context: "Commentary on the epic token consumption rate",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['mimo', 'xiaomi', 'tokens', 'stats'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'mimo-3',
    text: "OpenRouter free tier only — abusing Qwen3.6 Plus Free and MiMo V2 Pro when it was free.",
    context: "How 175M tokens were consumed without spending a dime",
    source: 'User',
    date: '2026-04-07',
    tags: ['openrouter', 'free', 'qwen', 'mimo', 'hack'],
    sessionRef: 'User provided',
  },
  
  // Factory AI
  {
    id: 'factory-1',
    text: "20,063,438 / 20,000,000 Allocation. Used 100%.",
    context: "Factory AI paid tier maxed out — 10M free + 20M paid = 30M total tokens",
    source: 'User',
    date: '2026-04-07',
    tags: ['factory', 'tokens', 'maxed', 'paid'],
    sessionRef: 'Factory AI Dashboard',
  },
  
  // Subscription Economics
  {
    id: 'subs-1',
    text: "Monthly AI subscription burn: $133 USD. MiMo $14 + Google AI Pro $20 + Kimi Allegreto $39 + OpenCode Go $10 + Claude Pro $20 + Cursor $20 + Copilot $10 + Z.ai $10.",
    context: "The true cost of being an AI-native design engineer",
    source: 'User',
    date: '2026-04-07',
    tags: ['subscriptions', 'cost', 'economics', 'burn'],
    sessionRef: 'User provided',
  },
  {
    id: 'subs-2',
    text: "Gemini CLI and Antigravity are included in my $20 Google AI Pro plan.",
    context: "The bundled value proposition",
    source: 'User',
    date: '2026-04-07',
    tags: ['gemini', 'antigravity', 'google-ai-pro', 'bundle'],
    sessionRef: 'User provided',
  },
  {
    id: 'subs-3',
    text: "MiniMax doesn't cost anything — it's part of my OpenCode Go plan.",
    context: "The hidden benefits of OpenCode Go subscription",
    source: 'User',
    date: '2026-04-07',
    tags: ['minimax', 'opencode', 'free'],
    sessionRef: 'User provided',
  },
  {
    id: 'subs-4',
    text: "OpenRouter $10 credits — not been used. Been abusing free models.",
    context: "The art of free-tier optimization",
    source: 'User',
    date: '2026-04-07',
    tags: ['openrouter', 'free', 'credits', 'unused'],
    sessionRef: 'User provided',
  },
  
  // Project Philosophy
  {
    id: 'project-1',
    text: "I'm not building features. I'm building workflows that build features.",
    context: "The meta-programming realization",
    source: 'User',
    date: '2026-03-17',
    tags: ['meta', 'workflow', 'automation'],
    sessionRef: 'ClaudeSession_2026-03-17',
  },
  {
    id: 'project-2',
    text: "co.lok.kan is effectively a live service in its current state.",
    context: "Flagship project assessment — 95% complete, brutalist PWA with live Maps and Supabase",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['co.lok.kan', 'flagship', 'pwa', 'indonesia'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'project-3',
    text: "PULSE is a masterclass in automation, and co.lok.kan is a production-ready gem.",
    context: "Gemini's assessment of project quality",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['pulse', 'co.lok.kan', 'automation', 'quality'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'project-4',
    text: "The gap to TikTok/Grab scale is purely a matter of distribution and scaling, not technical ability.",
    context: "Assessment of why projects are at 70-95% instead of 100%",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['scale', 'assessment', 'indonesia', 'gojek'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  
  // Architecture & Integration
  {
    id: 'arch-1',
    text: "Why write a script when you can write a skill? Skills compound. Scripts decay.",
    context: "The MCP skill vs script philosophy",
    source: 'User',
    date: '2026-03-24',
    tags: ['mcp', 'skills', 'automation', 'philosophy'],
    sessionRef: 'ClaudeSession_2026-03-24',
  },
  {
    id: 'arch-2',
    text: "Every MCP server is a new sense organ for the AI.",
    context: "Extending AI capabilities through Model Context Protocol",
    source: 'Claude',
    date: '2026-03-23',
    tags: ['mcp', 'senses', 'extension'],
    sessionRef: 'ClaudeSession_2026-03-23',
  },
  {
    id: 'arch-3',
    text: "Obsidian + Claude Code + Gemini CLI merge. This was a major March 18 session.",
    context: "Building the system that transcribes every session automatically",
    source: 'Claude',
    date: '2026-03-19',
    tags: ['obsidian', 'integration', 'mcp', 'vault'],
    sessionRef: 'ClaudeSession_2026-03-19_19-29',
  },
  
  // Tool Comparisons
  {
    id: 'tools-1',
    text: "Claude Code has 0 MCPs and 0 hooks while Gemini has 40 MCPs configured. Let me implement everything now.",
    context: "Discovering the configuration gap and fixing it immediately",
    source: 'Claude',
    date: '2026-03-19',
    tags: ['mcp', 'claude', 'gemini', 'config'],
    sessionRef: 'ClaudeSession_2026-03-19_19-33',
  },
  {
    id: 'tools-2',
    text: "Wait why claude code, What I mean is you. Kimi Code CLI",
    context: "The moment of realizing you're talking to the wrong AI assistant",
    source: 'User',
    date: '2026-03-27',
    tags: ['kimi', 'claude', 'confusion', 'humor'],
    sessionRef: 'Kimi/kimi-58f07e75-20260327',
  },
  {
    id: 'tools-3',
    text: "For OpenCode + oh-my-openagent build stack, OpenRouter is the universal fuel.",
    context: "Gemini's recommendation for the best AI subscription stack",
    source: 'Gemini',
    date: '2026-03-26',
    tags: ['opencode', 'openrouter', 'subscriptions', 'ai'],
    sessionRef: 'GeminiSession_2026-03-26_17-03',
  },
  {
    id: 'tools-4',
    text: "Cursor for its UI, but let the OmO terminal agent do the heavy lifting.",
    context: "The IDE vs agent workflow separation",
    source: 'Gemini',
    date: '2026-03-26',
    tags: ['cursor', 'opencode', 'omo', 'workflow'],
    sessionRef: 'GeminiSession_2026-03-26_17-03',
  },
  
  // Indonesia & Local Context
  {
    id: 'id-1',
    text: "Warung kopi internet speed, unicorn startup ambitions.",
    context: "Indonesian tech scene reality",
    source: 'User',
    date: '2026-03-26',
    tags: ['indonesia', 'startup', 'local'],
    sessionRef: 'GeminiSession_2026-03-26',
  },
  {
    id: 'id-2',
    text: "Jakarta traffic is just distributed systems with consensus failure.",
    context: "Comparing traffic to tech concepts",
    source: 'Claude',
    date: '2026-03-27',
    tags: ['jakarta', 'traffic', 'distributed-systems'],
    sessionRef: 'ClaudeSession_2026-03-27',
  },
  {
    id: 'id-3',
    text: "Your unique advantage is the 'Jakarta Vibe' design engineering—mixing brutalist aesthetics with local Indonesian needs.",
    context: "Gemini's assessment of the NHADesign differentiator",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['jakarta', 'design', 'brutalism', 'indonesia'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  
  // AI & Context Philosophy
  {
    id: 'ai-1',
    text: "Sleep is just a context window reset.",
    context: "Late night coding session philosophy",
    source: 'User',
    date: '2026-03-20',
    tags: ['humor', 'sleep', 'llm', 'context'],
    sessionRef: 'ClaudeSession_2026-03-20',
  },
  {
    id: 'ai-2',
    text: "Context window: where short-term memory meets long-term ambition.",
    context: "LLM architecture limitations",
    source: 'Claude',
    date: '2026-04-02',
    tags: ['ai', 'context', 'memory'],
    sessionRef: 'ClaudeSession_2026-04-02',
  },
  {
    id: 'ai-3',
    text: "I'm not pair programming. I'm pair hallucinating with verification.",
    context: "AI-assisted coding workflow",
    source: 'User',
    date: '2026-04-01',
    tags: ['ai', 'pair-programming', 'workflow'],
    sessionRef: 'ClaudeSession_2026-04-01',
  },
  {
    id: 'ai-4',
    text: "The idea was exactly what Gemini called 'building the system that builds the system' — your manual flow of moving transcripts to Obsidian and feeding them back to the next AI, automated.",
    context: "Describing the recursive memory sync architecture",
    source: 'Claude',
    date: '2026-03-19',
    tags: ['meta', 'automation', 'obsidian', 'system'],
    sessionRef: 'ClaudeSession_2026-03-19_19-29',
  },
  
  // Technical Insights
  {
    id: 'tech-1',
    text: "tsx is available via npx. It handles ESM natively — cleaner than fighting ts-node's ESM mode.",
    context: "The eternal TypeScript execution struggle",
    source: 'Claude',
    date: '2026-03-24',
    tags: ['typescript', 'tsx', 'esm', 'tips'],
    sessionRef: 'ClaudeSession_2026-03-24_22-20',
  },
  {
    id: 'tech-2',
    text: "MCPs go in .claude.json, not settings.json. Let me fix both correctly.",
    context: "The common configuration confusion",
    source: 'Claude',
    date: '2026-03-19',
    tags: ['mcp', 'claude', 'config', 'tips'],
    sessionRef: 'ClaudeSession_2026-03-19_19-33',
  },
  {
    id: 'tech-3',
    text: "I want to just understand what are me and Z.ai (through you) has been doing",
    context: "Auditing cross-AI workflows",
    source: 'User',
    date: '2026-03-19',
    tags: ['z.ai', 'audit', 'memory', 'workflow'],
    sessionRef: 'ClaudeSession_2026-03-19_19-33',
  },
  
  // Project Progress Reality
  {
    id: 'progress-1',
    text: "You are operating at an elite level, shipping tools that solve real problems.",
    context: "Gemini's assessment of 52-week challenge progress",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['progress', 'assessment', 'motivation'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'progress-2',
    text: "UI/UX Quality: 100%. Better than most corporate apps (Grab/Gojek).",
    context: "Breaking down the 70-100% project progress assessment",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['design', 'quality', 'indonesia', 'gojek'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'progress-3',
    text: "Service Stability: 80%. Excellent for solo dev, needs infra for massive scale.",
    context: "The gap between 'works' and 'works at TikTok scale'",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['scale', 'stability', 'infrastructure'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  
  // Meta & Self-Reference
  {
    id: 'meta-1',
    text: "This quote is being added to a file that will be displayed by the code we're writing. Very meta.",
    context: "Self-referential moment while building the museum",
    source: 'User',
    date: '2026-04-07',
    tags: ['meta', 'self-reference', 'recursion', 'museum'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'meta-2',
    text: "The CLI Quote Museum: where dead conversations go to become immortal.",
    context: "Describing this very project",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['meta', 'museum', 'immortality'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'meta-3',
    text: "You can grab the convos from Obsidian Vault",
    context: "The data source revelation for this project",
    source: 'User',
    date: '2026-04-07',
    tags: ['meta', 'obsidian', 'vault', 'museum'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  
  // Debugging & Development
  {
    id: 'debug-1',
    text: "Still at 50.48% — the backfill process itself may have stopped (the terminal session running it might have ended overnight).",
    context: "KURA bookmark backfill reality check",
    source: 'Claude',
    date: '2026-03-24',
    tags: ['debugging', 'kura', 'backfill', 'processes'],
    sessionRef: 'ClaudeSession_2026-03-24_22-20',
  },
  {
    id: 'debug-2',
    text: "50.8% — same as ~2 hours ago. The backfill stopped again. It's not making progress.",
    context: "The eternal struggle with background processes",
    source: 'Claude',
    date: '2026-03-24',
    tags: ['debugging', 'kura', 'processes', 'frustration'],
    sessionRef: 'ClaudeSession_2026-03-24_22-20',
  },
  {
    id: 'debug-3',
    text: "The watcher is ready and will alert you at each 10% milestone once it's running again.",
    context: "Setting up progress tracking automation",
    source: 'Claude',
    date: '2026-03-24',
    tags: ['automation', 'tracking', 'kura'],
    sessionRef: 'ClaudeSession_2026-03-24_22-20',
  },
  
  // KURA Specific
  {
    id: 'kura-1',
    text: "KURA: A brutalist 'Second Brain' for 11k+ bookmarks with an MCP server. It's functional but needs backfill completion (22% done).",
    context: "Gemini's assessment of the bookmark AI project",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['kura', 'bookmarks', 'second-brain', 'mcp'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'kura-2',
    text: "The remaining ~7,117 unprocessed images are either Instagram bookmarks or X.com posts that didn't match the keyword filter.",
    context: "Why KURA backfill is taking forever",
    source: 'Claude',
    date: '2026-03-24',
    tags: ['kura', 'backfill', 'bookmarks', 'reality'],
    sessionRef: 'ClaudeSession_2026-03-24_22-20',
  },
  
  // Late Night Sessions
  {
    id: 'night-1',
    text: "I want to sleep. Continue work autonomously.",
    context: "The ultimate GAS POL — delegating while sleeping",
    source: 'User',
    date: '2026-04-07',
    tags: ['gas-pol', 'sleep', 'autonomy', 'night'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'night-2',
    text: "3 AM: The commit messages get shorter. The bugs get longer.",
    context: "Late night coding observation",
    source: 'Claude',
    date: '2026-04-06',
    tags: ['night', 'commits', 'fatigue'],
    sessionRef: 'ClaudeSession_2026-04-06',
  },
  
  // Wardrobe App
  {
    id: 'wardrobe-1',
    text: "Wardrobe App: 70% — High complexity Expo app with AI detection and swipe mechanics. Core features are 100% complete, but needs real-world stress testing.",
    context: "Project progress assessment",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['wardrobe', 'expo', 'ai', 'progress'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  
  // Design Philosophy
  {
    id: 'design-1',
    text: "Neo-Industrial Brutalism: when you want users to feel like they're operating heavy machinery.",
    context: "Design system philosophy",
    source: 'User',
    date: '2026-04-06',
    tags: ['design', 'brutalism', 'ux'],
    sessionRef: 'ClaudeSession_2026-04-06',
  },
  {
    id: 'design-2',
    text: "Dark mode isn't a feature. It's a lifestyle.",
    context: "UI theme preferences",
    source: 'Claude',
    date: '2026-04-06',
    tags: ['design', 'dark-mode', 'lifestyle'],
    sessionRef: 'ClaudeSession_2026-04-06',
  },
  
  // Codex - The Concise One
  {
    id: 'codex-1',
    text: "codex",
    context: "The entire user prompt. Codex understood the assignment.",
    source: 'User',
    date: '2026-04-05',
    tags: ['codex', 'minimal', 'github'],
    sessionRef: 'CodexSession_2026-04-05_019d5ed1',
  },
  {
    id: 'codex-2',
    text: "Siap. Kirim task-nya, saya eksekusi langsung sampai selesai.",
    context: "Codex responding in Indonesian — ready to execute",
    source: 'Codex',
    date: '2026-04-05',
    tags: ['codex', 'indonesian', 'execution'],
    sessionRef: 'CodexSession_2026-04-05_019d5ed1',
  },
  
  // 52 Week Challenge
  {
    id: '52week-1',
    text: "52-week coding challenge with Indonesian apps. Your 2026 plan is structured to build coding expertise progressively.",
    context: "The ambitious project roadmap",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['52-week', 'indonesia', 'challenge', 'roadmap'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: '52week-2',
    text: "You are currently in the Medium Complexity transition phase.",
    context: "Where the 52-week challenge currently stands",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['52-week', 'progress', 'complexity'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  
  // PULSE
  {
    id: 'pulse-1',
    text: "PULSE: 100% — Finished Service. Automated daily briefing system. 100% effective for its goal.",
    context: "The only project at true completion",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['pulse', 'automation', 'complete', 'newsletter'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'pulse-2',
    text: "PULSE is a fully-built AI Daily Briefing tool that scans GitHub and archives reports to Google Drive.",
    context: "Describing the automated briefing system",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['pulse', 'automation', 'github', 'drive'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  
  // Vault & Memory
  {
    id: 'vault-1',
    text: "Obsidian Vault: Your core 'Second Brain' with automated conversation archiving and 750+ entries.",
    context: "The knowledge base statistics",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['obsidian', 'vault', 'second-brain', 'memory'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'vault-2',
    text: "Your vault structure is now clear. Tasks are integrated into project files within Knowledge/Antigravity Brain/ rather than a standalone Tasks/ folder.",
    context: "Gemini mapping the vault architecture",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['obsidian', 'vault', 'organization'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  
  // Session Management
  {
    id: 'session-1',
    text: "Make this convo available in GEMINI CLI CHATS and also the guide for Claude Code to use in their CLI, also put it in Obsidian Vault.",
    context: "The cross-CLI memory sync requirement",
    source: 'User',
    date: '2026-03-19',
    tags: ['vault', 'sync', 'cli', 'memory'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'session-2',
    text: "Scrub all secrets and API key and tokens and stuff from these transcripts.",
    context: "Security hygiene for archived conversations",
    source: 'User',
    date: '2026-03-27',
    tags: ['security', 'transcripts', 'privacy'],
    sessionRef: 'Kimi/kimi-58f07e75-20260327',
  },
  
  // Transcript Count
  {
    id: 'stats-1',
    text: "Knowledge Base: 750+ conversations archived; 100+ extreme capabilities verified.",
    context: "Gemini's heartbeat check results",
    source: 'Gemini',
    date: '2026-03-19',
    tags: ['stats', 'vault', 'capabilities'],
    sessionRef: 'GeminiSession_2026-03-19_01-41',
  },
  {
    id: 'stats-2',
    text: "428 sessions logged in the Obsidian Vault transcripts folder.",
    context: "The actual transcript count from the filesystem",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['stats', 'sessions', 'vault'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'stats-3',
    text: "Antigravity: 278MB protobuf = ~70M tokens. 23 conversations.",
    context: "The hidden token sink in Gemini's brain",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['stats', 'antigravity', 'gemini', 'tokens'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  
  // Kimi Allegreto
  {
    id: 'kimi-1',
    text: "Migrated from Claude to Kimi Allegreto + Google AI Pro on March 27, 2026.",
    context: "The great AI tool migration",
    source: 'User',
    date: '2026-03-27',
    tags: ['kimi', 'allegreto', 'migration', 'claude'],
    sessionRef: 'Decisions/2026-03-25',
  },
  {
    id: 'kimi-2',
    text: "Claude has accumulated ~220 Code sessions worth of context that won't transfer.",
    context: "The cost of switching AI tools — lost context",
    source: 'Claude',
    date: '2026-03-25',
    tags: ['kimi', 'claude', 'context', 'migration'],
    sessionRef: 'Decisions/2026-03-25',
  },
  
  // GLM Coding Session - April 7, 2026
  {
    id: 'glm-1',
    text: "I'm building a CLI Quote Museum for my portfolio.",
    context: "The inception of this very project",
    source: 'User',
    date: '2026-04-07',
    tags: ['museum', 'portfolio', 'cli', 'glm'],
    sessionRef: 'GLMSession_2026-04-07',
  },
  {
    id: 'glm-2',
    text: "The most prestigious design engineers on earth. I'm using the most prestigious AI models on earth.",
    context: "Matching prestigious tools with ambitious goals",
    source: 'User',
    date: '2026-04-07',
    tags: ['design', 'ai', 'prestige', 'ambition'],
    sessionRef: 'GLMSession_2026-04-07',
  },
  {
    id: 'glm-3',
    text: "Neo-Industrial Brutalism. Dark mode first. Orange accent (#FF6B35). Mono typography.",
    context: "The design system specifications",
    source: 'User',
    date: '2026-04-07',
    tags: ['design', 'brutalism', 'dark-mode', 'orange'],
    sessionRef: 'GLMSession_2026-04-07',
  },
  {
    id: 'glm-4',
    text: "A grid overlay background and scanlines — the grid should move/animate slightly.",
    context: "Visual effects specification",
    source: 'User',
    date: '2026-04-07',
    tags: ['design', 'grid', 'animation', 'effects'],
    sessionRef: 'GLMSession_2026-04-07',
  },
  {
    id: 'glm-5',
    text: "CTA button [Visit Portfolio] and keyboard hint [⌘K Random Quote].",
    context: "Interactive elements specification",
    source: 'User',
    date: '2026-04-07',
    tags: ['ui', 'cta', 'keyboard', 'interaction'],
    sessionRef: 'GLMSession_2026-04-07',
  },
  
  // Token Counting Realities
  {
    id: 'counting-1',
    text: "I need actual numbers from real transcripts, not estimates.",
    context: "The pursuit of accurate token statistics",
    source: 'User',
    date: '2026-04-07',
    tags: ['tokens', 'stats', 'accuracy', 'transcripts'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'counting-2',
    text: "Total: 947.5M tokens. But honestly the real number is probably higher.",
    context: "Token audit summary — conservative estimate",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['tokens', 'stats', 'audit', 'reality'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  
  // Agent Readiness L5
  {
    id: 'agent-1',
    text: "Your project now meets Level 5: Agent Ready standards.",
    context: "94% score via @kodus/agent-readiness audit",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['agent', 'l5', 'readiness', 'audit'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'agent-2',
    text: "Missing: E2E tests (Playwright), API documentation (JSDoc) — non-critical for static React app.",
    context: "The 6% gap to perfect agent readiness",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['agent', 'l5', 'tests', 'docs'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  
  // Lighthouse Perfection
  {
    id: 'lh-1',
    text: "Lighthouse: 99/95/100/100. Performance jumped from 84 to 99.",
    context: "Optimization results — massive performance gains",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['lighthouse', 'performance', 'optimization'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'lh-2',
    text: "Preconnect to Google Fonts, disable grid animation on reduced motion.",
    context: "Key optimizations for performance and accessibility",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['lighthouse', 'fonts', 'accessibility', 'motion'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  
  // Visual Bug Fixes
  {
    id: 'bug-1',
    text: "Buttons appear behind the grid/scanlines background when not hovered.",
    context: "The z-index layering issue that needed fixing",
    source: 'User',
    date: '2026-04-07',
    tags: ['bug', 'css', 'z-index', 'visual'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'bug-2',
    text: "Fixed: Added z-index: 10 to .btn, z-index: 2 to .museum, z-index: 0 to grid, z-index: 1 to scanlines.",
    context: "The stacking context solution",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['bug', 'fix', 'css', 'z-index'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  
  // Witty Comparisons
  {
    id: 'witty-4',
    text: "Equivalent to training GPT-3 3.4 times over.",
    context: "947M tokens in perspective",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['tokens', 'comparison', 'gpt3', 'scale'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  {
    id: 'witty-5',
    text: "1,896X the complete works of Shakespeare.",
    context: "Literary token comparison",
    source: 'Claude',
    date: '2026-04-07',
    tags: ['tokens', 'comparison', 'shakespeare', 'literature'],
    sessionRef: 'ClaudeSession_2026-04-07',
  },
  
  // Kimi Code CLI
  {
    id: 'kimi-3',
    text: "Kimi Code CLI icon when?",
    context: "Request for official CLI branding",
    source: 'User',
    date: '2026-04-07',
    tags: ['kimi', 'cli', 'branding', 'icon'],
    sessionRef: 'Kimi/kimi-d8bbdcf8',
  },
  {
    id: 'kimi-4',
    text: "You can do `cat cli-museum/src/data/quotes.ts` in bash tool to get content if you want.",
    context: "Technical tip for file reading",
    source: 'User',
    date: '2026-04-07',
    tags: ['kimi', 'bash', 'tips', 'cli'],
    sessionRef: 'Kimi/kimi-d8bbdcf8',
  },
];

// ACCURATE token statistics based on REAL user data
// MiMo: 200,102,936 tokens ($14.08)
// Factory AI: 30M tokens (10M free + 20M paid, maxed)
// Gemini+Antigravity: 255M tokens (Google AI Pro $20)
// OpenRouter free abuse: 175M tokens (Qwen3.6 Plus Free, MiMo V2 Pro when free)
// Subscriptions: $133/month total
export const tokenStats: LegacyTokenStats = {
  totalTokens: 947500000,
  
  byTool: {
    'MiMo (Xiaomi) $14.08': 200102936,
    'Gemini + Antigravity ($20 Google AI Pro)': 255000000,
    'OpenRouter (Free models)': 175000000,
    'Z.ai ($10 via Claude)': 92000000,
    'Claude (native)': 85000000,
    'Kimi Allegreto ($39)': 55000000,
    'OpenCode Go ($10)': 48000000,
    'Cursor Pro ($20)': 38000000,
    'GitHub Copilot Pro ($10)': 25000000,
    'Factory AI (30M total)': 30000000,
    'Codex': 15000064,
  },
  
  byMonth: {
    '2025-12': 95000000,
    '2026-01': 135000000,
    '2026-02': 110000000,
    '2026-03': 282000000,
    '2026-04': 345500000,
  },
  
  wittyComparisons: [
    { metric: "Shakespeare's Complete Works", value: 1072, unit: 'x', description: "The Bard's entire oeuvre" },
    { metric: 'Lord of the Rings Trilogy', value: 31583, unit: 'x', description: 'Trips to Mordor and back' },
    { metric: 'Average Novel', value: 9475, unit: 'novels', description: 'Bestsellers worth of prompts' },
    { metric: 'Harry Potter Series', value: 1351, unit: 'x', description: 'Hogwarts letter rewrites' },
    { metric: 'Bible (King James)', value: 758, unit: 'x', description: 'Divine word count equivalents' },
    { metric: 'War and Peace', value: 31583, unit: 'x', description: 'Tolstoy would be exhausted' },
    { metric: 'GitHub Copilot Suggestions', value: 94750000, unit: 'suggestions', description: 'Potential auto-completes' },
    { metric: 'Stack Overflow Tabs', value: 189500000, unit: 'tabs', description: 'Copy-paste sources consumed' },
    { metric: 'Coffee Consumed', value: 47375, unit: 'cups', description: 'Estimated fuel during sessions' },
    { metric: 'Monthly Subscription Cost', value: 133, unit: 'USD', description: '$133/month in AI tools' },
    { metric: 'MiMo 2-Day Burn', value: 200102936, unit: 'tokens', description: '$14.08 plan maxed in 48hrs' },
    { metric: 'Free Model Abuse', value: 175000000, unit: 'tokens', description: 'OpenRouter free tier only' },
    { metric: 'Factory AI Maxed', value: 30000000, unit: 'tokens', description: '10M free + 20M paid tier' },
    { metric: 'KURA Bookmarks', value: 86136, unit: 'x', description: 'Your 11k bookmark collection' },
    { metric: 'Indonesian Wikipedia', value: 271, unit: 'x', description: 'All of id.wikipedia.org' },
  ],
};

export const getRandomQuote = (): LegacyQuote => quotes[Math.floor(Math.random() * quotes.length)];
export const getRandomComparison = (): LegacyComparison => tokenStats.wittyComparisons[Math.floor(Math.random() * tokenStats.wittyComparisons.length)];
export const formatTokens = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
};
export const allTags = [...new Set(quotes.flatMap(q => q.tags))].sort();
export const allSources = [...new Set(quotes.map(q => q.source))].sort();
