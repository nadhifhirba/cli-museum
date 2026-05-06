// Feature 3: Quote Conversations — Cross-AI Threading
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, User, Bot } from 'lucide-react';
import { useQuoteStore } from '../stores';
import type { Quote, AIResponse } from '../types';

interface ConversationThreadProps {
  quote: Quote;
}

type Personality = 'sassy' | 'technical' | 'philosophical';

const PERSONALITY_LABELS: Record<Personality, string> = {
  sassy: 'Sassy',
  technical: 'Technical',
  philosophical: 'Philosophical'
};

const TOOL_OPTIONS: Array<{ id: AIResponse['respondingAs']; label: string; color: string }> = [
  { id: 'Claude', label: 'Claude', color: '#FF6B35' },
  { id: 'Gemini', label: 'Gemini', color: '#4285F4' },
  { id: 'Kimi', label: 'Kimi', color: '#00D9FF' },
  { id: 'Codex', label: 'Codex', color: '#238636' },
];

export function ConversationThread({ quote }: ConversationThreadProps) {
  const [personality, setPersonality] = useState<Personality>('sassy');
  const [generating, setGenerating] = useState<string | null>(null);
  const { generateResponse } = useQuoteStore();
  
  const responses = quote.conversationThread?.responses || [];
  
  const handleGenerate = async (tool: AIResponse['respondingAs']) => {
    if (tool === quote.source) return; // Can't respond to self
    
    setGenerating(tool);
    try {
      await generateResponse(quote.id, tool, personality);
    } catch (error) {
      console.error('Failed to generate response:', error);
    } finally {
      setGenerating(null);
    }
  };
  
  return (
    <div className="conversation-thread">
      {/* Original Quote */}
      <div className="thread-original">
        <div className="thread-message is-original">
          <div className="message-avatar" style={{ backgroundColor: getSourceColor(quote.source) }}>
            <User size={14} />
          </div>
          <div className="message-content">
            <div className="message-header">
              <span className="message-author">{quote.source}</span>
              <span className="message-meta">Original</span>
            </div>
            <p className="message-text">{quote.text}</p>
          </div>
        </div>
      </div>
      
      {/* Thread Line */}
      <div className="thread-line" />
      
      {/* AI Responses */}
      <div className="thread-responses">
        <AnimatePresence mode="popLayout">
          {responses.map((response) => (
            <motion.div
              key={response.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="thread-message is-response"
            >
              <div 
                className="message-avatar" 
                style={{ backgroundColor: getSourceColor(response.respondingAs) }}
              >
                <Bot size={14} />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">{response.respondingAs}</span>
                  <span className={`message-badge ${response.personality}`}>
                    {PERSONALITY_LABELS[response.personality]}
                  </span>
                </div>
                <p className="message-text">{response.responseText}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Generate Controls */}
      <div className="thread-controls">
        <div className="personality-selector">
          <span className="selector-label">
            <Sparkles size={12} />
            Tone
          </span>
          <div className="selector-options">
            {(Object.keys(PERSONALITY_LABELS) as Personality[]).map((p) => (
              <button
                key={p}
                className={`personality-btn ${personality === p ? 'active' : ''}`}
                onClick={() => setPersonality(p)}
              >
                {PERSONALITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        
        <div className="tool-selector">
          <span className="selector-label">
            <MessageCircle size={12} />
            Ask
          </span>
          <div className="tool-buttons">
            {TOOL_OPTIONS.map((tool) => {
              const hasResponse = responses.some(r => r.respondingAs === tool.id);
              const isSelf = tool.id === quote.source;
              
              return (
                <button
                  key={tool.id}
                  className={`tool-btn ${hasResponse ? 'has-response' : ''} ${isSelf ? 'is-self' : ''}`}
                  onClick={() => handleGenerate(tool.id)}
                  disabled={isSelf || generating === tool.id}
                  style={{ '--tool-color': tool.color } as React.CSSProperties}
                >
                  {generating === tool.id ? (
                    <span className="generating-dot" />
                  ) : (
                    <>
                      <span className="tool-dot" style={{ backgroundColor: tool.color }} />
                      <span>{tool.label}</span>
                      {hasResponse && <span className="response-indicator">✓</span>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    'Claude': '#FF6B35',
    'Gemini': '#4285F4',
    'Kimi': '#00D9FF',
    'Codex': '#238636',
    'User': '#22C55E',
    'Z.ai': '#A855F7',
  };
  return colors[source] || '#888';
}
