#!/usr/bin/env node
/**
 * WebSocket Bridge Server
 * 
 * Relays quote captures from MCP server to connected museum clients.
 * Simple pub/sub pattern: MCP server broadcasts, museum clients receive.
 */

import { WebSocketServer } from "ws";

const PORT = process.env.WS_PORT || 8765;
const HOST = process.env.WS_HOST || "localhost";

// Connected clients
const clients = new Set();

// Create WebSocket server
const wss = new WebSocketServer({ 
  port: PORT, 
  host: HOST,
  perMessageDeflate: false // Keep it simple
});

console.log(`[WS-Bridge] Server starting on ws://${HOST}:${PORT}`);

wss.on("connection", (ws, req) => {
  const clientId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
  clients.add(ws);
  
  console.log(`[WS-Bridge] Client connected: ${clientId} (${clients.size} total)`);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: "CONNECTED",
    message: "Welcome to CLI Museum Live Stream",
    clients: clients.size
  }));
  
  // Handle messages from clients (mainly for testing)
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`[WS-Bridge] Received: ${message.type}`);
      
      // Broadcast to all other clients (including sender for confirmation)
      broadcast(message, ws);
      
    } catch (err) {
      console.error("[WS-Bridge] Invalid message:", err.message);
    }
  });
  
  // Handle disconnect
  ws.on("close", () => {
    clients.delete(ws);
    console.log(`[WS-Bridge] Client disconnected: ${clientId} (${clients.size} remaining)`);
  });
  
  // Handle errors
  ws.on("error", (err) => {
    console.error(`[WS-Bridge] Client error (${clientId}):`, err.message);
    clients.delete(ws);
  });
});

/**
 * Broadcast a message to all connected clients
 */
function broadcast(message, sender = null) {
  const data = JSON.stringify(message);
  
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(data);
      } catch (err) {
        console.error("[WS-Bridge] Send failed:", err.message);
      }
    }
  });
}

// Health check logging
setInterval(() => {
  console.log(`[WS-Bridge] Status: ${clients.size} clients connected`);
}, 60000);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[WS-Bridge] Shutting down...");
  
  // Notify all clients
  broadcast({ type: "SHUTDOWN", message: "Server is shutting down" });
  
  // Close all connections
  clients.forEach(client => client.close());
  
  wss.close(() => {
    console.log("[WS-Bridge] Server closed");
    process.exit(0);
  });
});

console.log("[WS-Bridge] Ready for connections");
