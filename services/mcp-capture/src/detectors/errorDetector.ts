/**
 * Error/Insight Detector
 * Detects interesting errors, warnings, and technical insights
 */

import type { DetectedMatch } from "./wittyDetector.js";

// Patterns for errors and technical insights
const ERROR_PATTERNS: Array<{
  pattern: RegExp;
  source: string;
  tags: string[];
  confidence: number;
  contextExtractor: (match: RegExpMatchArray, fullText: string) => string;
  isError: boolean;
}> = [
  // Build failure with character
  {
    pattern: /(?:error|fail|broken|wtf|how did this).*\n.*(?:error|fail|broken)/i,
    source: "Claude",
    tags: ["error", "debugging", "build"],
    confidence: 0.7,
    contextExtractor: () => "Build failure with memorable commentary",
    isError: true
  },
  
  // MCP config confusion
  {
    pattern: /MCPs? (?:go in|belong in|config).*\.claude\.json/i,
    source: "Claude",
    tags: ["mcp", "config", "tips"],
    confidence: 0.85,
    contextExtractor: () => "The common MCP configuration confusion",
    isError: false
  },
  
  // tsx vs ts-node debate
  {
    pattern: /tsx.*(?:handles|native|cleaner).*ts-node/i,
    source: "Claude",
    tags: ["typescript", "tsx", "esm", "tips"],
    confidence: 0.8,
    contextExtractor: () => "The eternal TypeScript execution struggle",
    isError: false
  },
  
  // Process died/stopped
  {
    pattern: /(?:backfill|process|watcher).*stopped|(?:died|ended overnight)/i,
    source: "Claude",
    tags: ["debugging", "processes", "frustration"],
    confidence: 0.75,
    contextExtractor: (match) => `Background process issue: ${match[0]}`,
    isError: true
  },
  
  // 100% complete/maxxed out
  {
    pattern: /(?:100\.0%|maxed out|used 100%).*(?:allocation|credits|tokens)/i,
    source: "User",
    tags: ["tokens", "maxed", "limits"],
    confidence: 0.85,
    contextExtractor: () => "Resource limit reached",
    isError: false
  },
  
  // The "still at X%" debugging
  {
    pattern: /still at (\d+\.?\d*)%.*(?:stopped|not making progress)/i,
    source: "Claude",
    tags: ["debugging", "processes", "frustration"],
    confidence: 0.8,
    contextExtractor: (match) => `Progress tracking: stuck at ${match[1]}%`,
    isError: true
  },
  
  // Session count transfer issue
  {
    pattern: /(?:220|session).*context.*won['']t transfer/i,
    source: "Claude",
    tags: ["context", "migration", "cost"],
    confidence: 0.85,
    contextExtractor: () => "The cost of switching AI tools — lost context",
    isError: false
  },
  
  // Z.ai routing clarification
  {
    pattern: /Z\.ai.*(?:through|via|using).*Claude|79M tokens.*didn['']t show up/i,
    source: "Claude",
    tags: ["tokens", "z.ai", "claude", "routing"],
    confidence: 0.85,
    contextExtractor: () => "Understanding cross-AI token routing",
    isError: false
  }
];

/**
 * Detect errors and technical insights
 */
export function errorDetector(text: string): DetectedMatch[] {
  const matches: DetectedMatch[] = [];
  
  for (const config of ERROR_PATTERNS) {
    const regex = new RegExp(config.pattern.source, 'gi');
    let match: RegExpExecArray | null;
    
    while ((match = regex.exec(text)) !== null) {
      // Avoid duplicates
      if (matches.some(m => Math.abs(m.index - match!.index) < 50)) continue;
      
      // Extract the relevant lines
      const lineStart = text.lastIndexOf('\n', match.index) + 1;
      const lineEnd = text.indexOf('\n', match.index);
      const fullLine = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
      
      matches.push({
        text: fullLine,
        context: config.contextExtractor(match, text),
        source: config.source,
        tags: config.tags,
        confidence: config.confidence,
        index: match.index
      });
    }
  }
  
  return matches.sort((a, b) => b.confidence - a.confidence);
}
