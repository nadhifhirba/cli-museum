// Feature 1+3+4: Core Quote Store with Sessions & Conversations
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote, Session, AIResponse } from '../types';
import { quotes as initialQuotes } from '../data/quotes';

interface QuoteState {
  // Data
  quotes: Quote[];
  sessions: Map<string, Session>;
  
  // Actions
  addQuote: (quote: Quote) => void;
  removeQuote: (id: string) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  
  // Feature 4: Session management
  loadSession: (sessionRef: string) => Promise<Session | null>;
  getSession: (sessionRef: string) => Session | undefined;
  
  // Feature 3: Conversation threading
  generateResponse: (quoteId: string, asTool: AIResponse['respondingAs'], personality: AIResponse['personality']) => Promise<void>;
  
  // Queries
  getQuoteById: (id: string) => Quote | undefined;
  getQuotesBySession: (sessionRef: string) => Quote[];
  getQuotesByTag: (tag: string) => Quote[];
  getRandomQuote: () => Quote;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      // Initial data
      quotes: initialQuotes as Quote[],
      sessions: new Map(),
      
      // Core actions
      addQuote: (quote) => set((state) => ({
        quotes: [...state.quotes, quote]
      })),
      
      removeQuote: (id) => set((state) => ({
        quotes: state.quotes.filter(q => q.id !== id)
      })),
      
      updateQuote: (id, updates) => set((state) => ({
        quotes: state.quotes.map(q => 
          q.id === id ? { ...q, ...updates } : q
        )
      })),
      
      // Feature 4: Session management
      loadSession: async (sessionRef) => {
        // Check cache first
        const cached = get().sessions.get(sessionRef);
        if (cached) return cached;
        
        // Try to load from Obsidian vault (implemented in service layer)
        try {
          const { getSessionFromVault } = await import('../services/obsidianConnector');
          const session = await getSessionFromVault(sessionRef);
          
          if (session) {
            set((state) => ({
              sessions: new Map(state.sessions).set(sessionRef, session)
            }));
            return session;
          }
        } catch (error) {
          console.warn(`Failed to load session ${sessionRef}:`, error);
        }
        
        return null;
      },
      
      getSession: (sessionRef) => get().sessions.get(sessionRef),
      
      // Feature 3: AI Conversation generation
      generateResponse: async (quoteId, asTool, personality) => {
        const quote = get().getQuoteById(quoteId);
        if (!quote) throw new Error('Quote not found');
        
        try {
          const { generateAIResponse } = await import('../services/aiResponder');
          const response = await generateAIResponse(quote, asTool, personality);
          
          set((state) => ({
            quotes: state.quotes.map(q => {
              if (q.id !== quoteId) return q;
              
              const existingThread = q.conversationThread || {
                rootQuoteId: quoteId,
                responses: [],
                generatedAt: new Date()
              };
              
              return {
                ...q,
                conversationThread: {
                  ...existingThread,
                  responses: [...existingThread.responses, response]
                }
              };
            })
          }));
        } catch (error) {
          console.error('Failed to generate response:', error);
          throw error;
        }
      },
      
      // Queries
      getQuoteById: (id) => get().quotes.find(q => q.id === id),
      
      getQuotesBySession: (sessionRef) => 
        get().quotes.filter(q => q.sessionRef === sessionRef),
      
      getQuotesByTag: (tag) => 
        get().quotes.filter(q => q.tags.includes(tag)),
      
      getRandomQuote: () => {
        const { quotes } = get();
        return quotes[Math.floor(Math.random() * quotes.length)];
      }
    }),
    {
      name: 'cli-museum-quotes',
      partialize: (state) => ({ 
        quotes: state.quotes,
        sessions: Array.from(state.sessions.entries())
      }),
      onRehydrateStorage: () => (state) => {
        // Restore Map from array
        if (state && Array.isArray(state.sessions)) {
          (state as { sessions: Map<string, Session> }).sessions = new Map(
            state.sessions as unknown as [string, Session][]
          );
        }
      }
    }
  )
);
