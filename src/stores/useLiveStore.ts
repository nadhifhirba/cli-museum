// Feature 1: Live Capture Stream State
import { create } from 'zustand';
import type { PendingQuote, ConnectionStatus } from '../types';

const PENDING_QUOTE_TTL = 5 * 60 * 1000; // 5 minutes

interface LiveState {
  // Connection
  isLive: boolean;
  connectionStatus: ConnectionStatus;
  wsUrl: string;
  
  // Pending quotes queue
  pendingQuotes: PendingQuote[];
  
  // Stats
  capturedToday: number;
  immortalizedToday: number;
  discardedToday: number;
  
  // Actions
  toggleLive: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setWsUrl: (url: string) => void;
  
  // Pending quote management
  addPending: (quote: Omit<PendingQuote, 'receivedAt' | 'expiresAt'>) => void;
  immortalize: (id: string) => void;
  discard: (id: string) => void;
  clearExpired: () => void;
  
  // Stats
  resetDailyStats: () => void;
}

export const useLiveStore = create<LiveState>((set, get) => ({
  // Initial state
  isLive: false,
  connectionStatus: 'disconnected',
  wsUrl: 'ws://localhost:8765',
  pendingQuotes: [],
  capturedToday: 0,
  immortalizedToday: 0,
  discardedToday: 0,
  
  // Connection
  toggleLive: () => set((state) => ({ isLive: !state.isLive })),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setWsUrl: (url) => set({ wsUrl: url }),
  
  // Pending quotes
  addPending: (quote) => {
    const now = Date.now();
    const pendingQuote: PendingQuote = {
      ...quote,
      receivedAt: new Date(now),
      expiresAt: new Date(now + PENDING_QUOTE_TTL)
    };
    
    set((state) => ({
      pendingQuotes: [...state.pendingQuotes, pendingQuote],
      capturedToday: state.capturedToday + 1
    }));
    
    // Auto-clear expired after TTL
    setTimeout(() => {
      get().clearExpired();
    }, PENDING_QUOTE_TTL + 1000);
  },
  
  immortalize: (id) => {
    const { pendingQuotes } = get();
    const quote = pendingQuotes.find(q => q.id === id);
    
    if (quote) {
      // Import and add to main quote store
      import('./useQuoteStore').then(({ useQuoteStore }) => {
        useQuoteStore.getState().addQuote(quote);
      });
      
      // Remove from pending
      set((state) => ({
        pendingQuotes: state.pendingQuotes.filter(q => q.id !== id),
        immortalizedToday: state.immortalizedToday + 1
      }));
    }
  },
  
  discard: (id) => {
    set((state) => ({
      pendingQuotes: state.pendingQuotes.filter(q => q.id !== id),
      discardedToday: state.discardedToday + 1
    }));
  },
  
  clearExpired: () => {
    const now = Date.now();
    set((state) => ({
      pendingQuotes: state.pendingQuotes.filter(q => q.expiresAt.getTime() > now)
    }));
  },
  
  // Stats
  resetDailyStats: () => set({
    capturedToday: 0,
    immortalizedToday: 0,
    discardedToday: 0
  })
}));
