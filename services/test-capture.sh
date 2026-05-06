#!/bin/bash
# Test the capture system manually

echo "Testing CLI Museum Capture System"
echo "================================="
echo ""

# Test WebSocket bridge
echo "1. Testing WebSocket bridge..."
if lsof -i :8765 > /dev/null 2>&1; then
  echo "   ✓ WebSocket bridge running on port 8765"
else
  echo "   ✗ WebSocket bridge not running"
  echo "   Start it with: node services/websocket-bridge/index.js"
  exit 1
fi

# Test MCP capture server
echo ""
echo "2. MCP Capture Server Status..."
if [ -f "services/mcp-capture/dist/index.js" ]; then
  echo "   ✓ MCP server built at services/mcp-capture/dist/index.js"
else
  echo "   ✗ MCP server not built"
  echo "   Build it with: cd services/mcp-capture && npm run build"
  exit 1
fi

echo ""
echo "3. Add to Claude Code MCP config:"
echo "   Edit ~/.claude.json and add:"
echo ""
cat services/mcp-config.json
echo ""

echo ""
echo "4. After adding to config, test with:"
echo "   - In Claude Code: 'capture_quote'"
echo "   - Or: 'detect_quotes' on recent output"
echo ""
echo "5. Open the museum and enable Live Capture (⌘K)"
echo "   http://localhost:5173"
