#!/usr/bin/env node
/**
 * MCP CLI Museum Capture Server
 * 
 * Captures quotable moments from CLI sessions and streams them to the museum.
 * Implements the Model Context Protocol for integration with Claude Code, etc.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import WebSocket from "ws";
import { wittyDetector } from "./detectors/wittyDetector.js";
import { errorDetector } from "./detectors/errorDetector.js";

// Configuration
const WS_URL = process.env.MUSEUM_WS_URL || "ws://localhost:8765";
const DETECTION_MODE = process.env.DETECTION_MODE || "regex"; // 'regex' | 'llm'

// WebSocket client for museum
class MuseumWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;

  connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;
    
    this.isConnecting = true;
    console.error(`[MCP-Capture] Connecting to museum at ${WS_URL}...`);

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.on("open", () => {
        console.error("[MCP-Capture] Connected to museum");
        this.isConnecting = false;
      });

      this.ws.on("close", () => {
        console.error("[MCP-Capture] Disconnected from museum");
        this.isConnecting = false;
        this.scheduleReconnect();
      });

      this.ws.on("error", (err) => {
        console.error("[MCP-Capture] WebSocket error:", err.message);
        this.isConnecting = false;
      });
    } catch (err) {
      console.error("[MCP-Capture] Failed to connect:", err);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }

  send(quote: CapturedQuote) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: "QUOTE_CAPTURED",
        quote
      }));
      return true;
    }
    return false;
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
  }
}

interface CapturedQuote {
  id: string;
  text: string;
  context: string;
  source: string;
  date: string;
  tags: string[];
  sessionRef: string;
  captureMetadata: {
    capturedAt: string;
    detectionConfidence: number;
    rawContext: string;
    detectionMethod: "regex" | "llm" | "manual";
  };
}

// Global WebSocket client
const wsClient = new MuseumWebSocketClient();

// Tool definitions
const CAPTURE_QUOTE_TOOL: Tool = {
  name: "capture_quote",
  description: "Manually capture a quotable moment from the current CLI session",
  inputSchema: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The quote text to capture"
      },
      context: {
        type: "string",
        description: "Context about when/why this was said"
      },
      source: {
        type: "string",
        description: "Who said it (Claude, Gemini, Kimi, Codex, User)",
        default: "User"
      },
      tags: {
        type: "array",
        items: { type: "string" },
        description: "Tags for categorization",
        default: []
      }
    },
    required: ["text", "context"]
  }
};

const DETECT_QUOTES_TOOL: Tool = {
  name: "detect_quotes",
  description: "Scan recent CLI output for quotable moments and suggest captures",
  inputSchema: {
    type: "object",
    properties: {
      recentOutput: {
        type: "string",
        description: "Recent terminal/CLI output to analyze"
      },
      sessionRef: {
        type: "string",
        description: "Current session identifier"
      }
    },
    required: ["recentOutput", "sessionRef"]
  }
};

const GET_STATUS_TOOL: Tool = {
  name: "get_capture_status",
  description: "Get current capture status and statistics",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

// Server setup
const server = new Server(
  {
    name: "cli-museum-capture",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [CAPTURE_QUOTE_TOOL, DETECT_QUOTES_TOOL, GET_STATUS_TOOL]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error("Missing arguments");
  }

  switch (name) {
    case "capture_quote": {
      const text = args.text as string;
      const context = args.context as string;
      
      if (!text || !context) {
        throw new Error("Missing required fields: text and context");
      }
      
      const quote: CapturedQuote = {
        id: `capture-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        context,
        source: (args.source as string) || "User",
        date: new Date().toISOString().split("T")[0],
        tags: (args.tags as string[]) || ["captured"],
        sessionRef: `Session_${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}`,
        captureMetadata: {
          capturedAt: new Date().toISOString(),
          detectionConfidence: 1.0,
          rawContext: context,
          detectionMethod: "manual"
        }
      };

      const sent = wsClient.send(quote);
      
      return {
        content: [
          {
            type: "text",
            text: sent 
              ? `✓ Captured: "${quote.text.slice(0, 50)}${quote.text.length > 50 ? "..." : ""}"`
              : `⚠ Queued (museum offline): "${quote.text.slice(0, 50)}${quote.text.length > 50 ? "..." : ""}"`
          }
        ]
      };
    }

    case "detect_quotes": {
      const output = args.recentOutput as string;
      const sessionRef = args.sessionRef as string;
      
      if (!output || !sessionRef) {
        throw new Error("Missing required fields: recentOutput and sessionRef");
      }
      
      // Run detectors
      const wittyMatches = wittyDetector(output);
      const errorMatches = errorDetector(output);
      
      const allMatches = [...wittyMatches, ...errorMatches];
      
      if (allMatches.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No quotable moments detected in recent output."
            }
          ]
        };
      }

      // Send detected quotes
      const sentQuotes: CapturedQuote[] = [];
      for (const match of allMatches.slice(0, 3)) { // Max 3 per detection
        const quote: CapturedQuote = {
          id: `detect-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text: match.text,
          context: match.context,
          source: match.source || "Unknown",
          date: new Date().toISOString().split("T")[0],
          tags: match.tags,
          sessionRef,
          captureMetadata: {
            capturedAt: new Date().toISOString(),
            detectionConfidence: match.confidence,
            rawContext: output.slice(Math.max(0, match.index - 200), match.index + 200),
            detectionMethod: DETECTION_MODE as "regex" | "llm"
          }
        };

        const sent = wsClient.send(quote);
        if (sent) sentQuotes.push(quote);
      }

      return {
        content: [
          {
            type: "text",
            text: `Detected ${allMatches.length} quotable moment(s), sent ${sentQuotes.length} to museum:` +
              sentQuotes.map(q => `\n• "${q.text.slice(0, 40)}${q.text.length > 40 ? "..." : ""}"`).join("")
          }
        ]
      };
    }

    case "get_capture_status": {
      const isConnected = wsClient["ws"]?.readyState === WebSocket.OPEN;
      
      return {
        content: [
          {
            type: "text",
            text: `Museum Connection: ${isConnected ? "✓ Connected" : "✗ Disconnected"}\n` +
                  `WebSocket URL: ${WS_URL}\n` +
                  `Detection Mode: ${DETECTION_MODE}`
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Cleanup on exit
process.on("SIGINT", () => {
  console.error("\n[MCP-Capture] Shutting down...");
  wsClient.disconnect();
  process.exit(0);
});

// Start server
async function main() {
  // Connect to museum WebSocket
  wsClient.connect();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("[MCP-Capture] Server running on stdio");
  console.error("[MCP-Capture] Tools: capture_quote, detect_quotes, get_capture_status");
}

main().catch((error) => {
  console.error("[MCP-Capture] Fatal error:", error);
  process.exit(1);
});
