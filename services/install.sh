#!/bin/bash
# Install dependencies for all MCP services

set -e

echo "Installing MCP Capture Server dependencies..."
cd "$(dirname "$0")/mcp-capture"
npm install
npm run build

echo ""
echo "Installing WebSocket Bridge dependencies..."
cd "../websocket-bridge"
npm install

echo ""
echo "✓ All services installed!"
echo ""
echo "To start the services:"
echo "  1. Terminal 1: npm run start --workspace=services/websocket-bridge"
echo "  2. Terminal 2: npm run start --workspace=services/mcp-capture"
echo ""
echo "Or manually:"
echo "  1. node services/websocket-bridge/index.js"
echo "  2. Add to Claude Code MCP config: services/mcp-capture/dist/index.js"
