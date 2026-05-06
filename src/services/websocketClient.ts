// Feature 1: WebSocket Client for Live Capture
import type { PendingQuote, ConnectionStatus } from '../types';

type MessageHandler = (quote: PendingQuote) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: MessageHandler[] = [];
  private statusChangeHandlers: ((status: ConnectionStatus) => void)[] = [];
  
  constructor(url: string = 'ws://localhost:8765') {
    this.url = url;
  }
  
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    
    this.notifyStatusChange('connecting');
    
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('[WebSocket] Connected');
        this.reconnectAttempts = 0;
        this.notifyStatusChange('connected');
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'QUOTE_CAPTURED' && data.quote) {
            this.messageHandlers.forEach(handler => handler(data.quote));
          }
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        this.notifyStatusChange('disconnected');
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.notifyStatusChange('error');
      };
    } catch (error) {
      console.error('[WebSocket] Failed to connect:', error);
      this.notifyStatusChange('error');
    }
  }
  
  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WebSocket] Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }
  
  onStatusChange(handler: (status: ConnectionStatus) => void) {
    this.statusChangeHandlers.push(handler);
    return () => {
      this.statusChangeHandlers = this.statusChangeHandlers.filter(h => h !== handler);
    };
  }
  
  private notifyStatusChange(status: ConnectionStatus) {
    this.statusChangeHandlers.forEach(handler => handler(status));
  }
  
  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let client: WebSocketClient | null = null;

export function getWebSocketClient(url?: string): WebSocketClient {
  if (!client) {
    client = new WebSocketClient(url);
  }
  return client;
}

// React hook for connection status
export function useWebSocketConnection(
  url?: string,
  onMessage?: MessageHandler
): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  
  useEffect(() => {
    const ws = getWebSocketClient(url);
    
    const unsubscribeStatus = ws.onStatusChange(setStatus);
    
    if (onMessage) {
      const unsubscribeMessage = ws.onMessage(onMessage);
      return () => {
        unsubscribeStatus();
        unsubscribeMessage();
      };
    }
    
    return unsubscribeStatus;
  }, [url, onMessage]);
  
  return status;
}

// Need to import useState for the hook
import { useState, useEffect } from 'react';
