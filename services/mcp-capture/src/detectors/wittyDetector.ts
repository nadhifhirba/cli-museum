/**
 * Witty Quote Detector
 * Uses regex patterns to detect quotable moments in CLI output
 */

export interface DetectedMatch {
  text: string;
  context: string;
  source: string;
  tags: string[];
  confidence: number;
  index: number;
}

// Patterns for witty/profound quotable moments
const WITTY_PATTERNS: Array<{
  pattern: RegExp;
  source: string;
  tags: string[];
  confidence: number;
  contextExtractor: (match: RegExpMatchArray, fullText: string) => string;
}> = [
  // GAS POL trigger
  {
    pattern: /^GAS POL[!]?$/im,
    source: "User",
    tags: ["gas-pol", "autonomy", "trigger"],
    confidence: 0.95,
    contextExtractor: () => "The magic words that trigger full autonomous execution"
  },
  
  // "I want to sleep" - the ultimate delegation
  {
    pattern: /I want to sleep[.!]?.*(?:continue|autonomous|work)/i,
    source: "User",
    tags: ["sleep", "autonomy", "night"],
    confidence: 0.9,
    contextExtractor: () => "The ultimate GAS POL — delegating while sleeping"
  },
  
  // Meta-commentary about AI
  {
    pattern: /(?:I['']m not|we're not) (?:pair programming|coding|building)/i,
    source: "User",
    tags: ["meta", "ai", "workflow"],
    confidence: 0.85,
    contextExtractor: (match) => `AI-assisted workflow reflection: "${match[0]}"`
  },
  
  // Token comments
  {
    pattern: /(\d+[MKT] tokens|token burn|burned through|maxed out)/i,
    source: "User",
    tags: ["tokens", "stats", "burn"],
    confidence: 0.8,
    contextExtractor: (match) => `Token economy moment: ${match[1]}`
  },
  
  // Architecture insights
  {
    pattern: /(?:why write a script when you can write a skill|skills compound|scripts decay)/i,
    source: "User",
    tags: ["mcp", "skills", "philosophy"],
    confidence: 0.9,
    contextExtractor: () => "The MCP skill vs script philosophy"
  },
  
  // Every MCP server is a new sense organ
  {
    pattern: /(?:every mcp server is|mcp.*sense organ|new sense)/i,
    source: "Claude",
    tags: ["mcp", "senses", "extension"],
    confidence: 0.85,
    contextExtractor: () => "Extending AI capabilities through Model Context Protocol"
  },
  
  // Confusion moments
  {
    pattern: /wait why (?:claude|kimi|gemini|you|I)|what I mean is/i,
    source: "User",
    tags: ["confusion", "humor", "identity"],
    confidence: 0.85,
    contextExtractor: () => "The moment of realizing you're talking to the wrong AI"
  },
  
  // Subscription/cost comments
  {
    pattern: /\$(\d+)(?:\/month| monthly| per month)|subscription burn|monthly burn/i,
    source: "User",
    tags: ["subscriptions", "cost", "economics"],
    confidence: 0.8,
    contextExtractor: (match) => `The $${match[1] || 'XX'}/month subscription reality`
  },
  
  // Build system comments
  {
    pattern: /(?:building the system that builds|system that builds the system|meta.*system)/i,
    source: "Claude",
    tags: ["meta", "automation", "system"],
    confidence: 0.85,
    contextExtractor: () => "Recursive automation architecture"
  },
  
  // Design philosophy
  {
    pattern: /(?:dark mode|brutalism|jakarta vibe|neo-industrial)/i,
    source: "User",
    tags: ["design", "philosophy", "aesthetic"],
    confidence: 0.75,
    contextExtractor: (match) => `Design system decision: ${match[0]}`
  },
  
  // 200M token MiMo moment
  {
    pattern: /200[,.]?\d*\s*[Mm].*tokens?.*(?:48 hours|2 days|burn|performance art)/i,
    source: "Claude",
    tags: ["mimo", "tokens", "burn", "record"],
    confidence: 0.95,
    contextExtractor: () => "The 200M token MiMo burn commentary"
  },
  
  // Late night observations
  {
    pattern: /(?:3 AM|3am|midnight|late night).*(?:commit|bug|code)/i,
    source: "Claude",
    tags: ["night", "commits", "fatigue"],
    confidence: 0.8,
    contextExtractor: () => "Late night coding observation"
  }
];

/**
 * Detect witty/profound quotes in CLI output
 */
export function wittyDetector(text: string): DetectedMatch[] {
  const matches: DetectedMatch[] = [];
  
  for (const config of WITTY_PATTERNS) {
    const regex = new RegExp(config.pattern.source, config.pattern.flags.includes('g') ? 'gi' : 'i');
    let match: RegExpExecArray | null;
    
    while ((match = regex.exec(text)) !== null) {
      // Avoid duplicates (same index)
      if (matches.some(m => Math.abs(m.index - match!.index) < 50)) continue;
      
      // Extract the full line/paragraph for context
      const lineStart = text.lastIndexOf('\n', match.index) + 1;
      const lineEnd = text.indexOf('\n', match.index);
      const fullLine = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
      
      // Get 1-2 lines of context after
      const afterLineEnd = text.indexOf('\n', lineEnd + 1);
      const contextLine = afterLineEnd !== -1 
        ? text.slice(lineEnd + 1, afterLineEnd).trim()
        : "";
      
      matches.push({
        text: fullLine,
        context: config.contextExtractor(match, text) + (contextLine ? ` — ${contextLine}` : ""),
        source: config.source,
        tags: config.tags,
        confidence: config.confidence,
        index: match.index
      });
    }
  }
  
  // Sort by confidence (highest first)
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Quick check if text might contain quotable content
 */
export function mightContainQuotes(text: string): boolean {
  return WITTY_PATTERNS.some(config => config.pattern.test(text));
}
