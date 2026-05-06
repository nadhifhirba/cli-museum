// Feature 1: Live Capture Stream Sidebar
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Wifi, WifiOff, Star, X, Zap } from 'lucide-react';
import { useLiveStore } from '../stores';
import type { PendingQuote } from '../types';

interface LiveCaptureSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveCaptureSidebar({ isOpen, onClose }: LiveCaptureSidebarProps) {
  const {
    isLive,
    connectionStatus,
    pendingQuotes,
    capturedToday,
    immortalizedToday,
    toggleLive,
    addPending,
    immortalize,
    discard,
    clearExpired
  } = useLiveStore();
  
  // WebSocket connection effect
  useEffect(() => {
    if (!isLive) return;
    
    // Import WebSocket client dynamically
    let cleanup: (() => void) | undefined;
    
    import('../services/websocketClient').then(({ getWebSocketClient }) => {
      const ws = getWebSocketClient();
      
      // Connect to WebSocket
      ws.connect();
      
      // Listen for incoming quotes
      const unsubscribe = ws.onMessage((quote: PendingQuote) => {
        addPending(quote);
      });
      
      cleanup = () => {
        unsubscribe();
        ws.disconnect();
      };
    });
    
    // Clear expired quotes periodically
    const interval = setInterval(clearExpired, 30000);
    
    return () => {
      cleanup?.();
      clearInterval(interval);
    };
  }, [isLive, addPending, clearExpired]);
  
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi size={14} className="status-icon connected" />;
      case 'connecting':
        return <Zap size={14} className="status-icon connecting" />;
      case 'error':
        return <WifiOff size={14} className="status-icon error" />;
      default:
        return <WifiOff size={14} className="status-icon disconnected" />;
    }
  };
  
  const getStatusText = () => {
    if (!isLive) return 'OFFLINE';
    return connectionStatus.toUpperCase();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="live-sidebar"
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-title">
              <Radio size={18} />
              <span>LIVE CAPTURE</span>
            </div>
            <button className="close-btn" onClick={onClose} aria-label="Close sidebar">
              <X size={18} />
            </button>
          </div>
          
          {/* Live Toggle */}
          <div className="live-toggle-container">
            <button
              className={`live-toggle ${isLive ? 'active' : ''}`}
              onClick={toggleLive}
              aria-pressed={isLive}
            >
              <span className={`live-indicator ${isLive ? 'pulse' : ''}`} />
              <span className="live-text">{isLive ? 'LIVE' : 'START CAPTURE'}</span>
              {getStatusIcon()}
            </button>
            <span className="status-text">{getStatusText()}</span>
          </div>
          
          {/* Stats */}
          <div className="capture-stats">
            <div className="stat-item">
              <span className="stat-label">Captured</span>
              <span className="stat-value">{capturedToday}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Saved</span>
              <span className="stat-value saved">{immortalizedToday}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">{pendingQuotes.length}</span>
            </div>
          </div>
          
          {/* Pending Quotes */}
          <div className="pending-list">
            <AnimatePresence mode="popLayout">
              {pendingQuotes.map((quote) => (
                <PendingQuoteCard
                  key={quote.id}
                  quote={quote}
                  onImmortalize={() => immortalize(quote.id)}
                  onDiscard={() => discard(quote.id)}
                />
              ))}
            </AnimatePresence>
            
            {pendingQuotes.length === 0 && (
              <div className="empty-state">
                {isLive ? (
                  <>
                    <Radio size={24} className="empty-icon pulse" />
                    <p>Listening for quotes...</p>
                    <span className="empty-hint">Witty moments will appear here</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={24} className="empty-icon" />
                    <p>Capture is offline</p>
                    <span className="empty-hint">Enable Live to start capturing</span>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// Individual pending quote card
interface PendingQuoteCardProps {
  quote: PendingQuote;
  onImmortalize: () => void;
  onDiscard: () => void;
}

function PendingQuoteCard({ quote, onImmortalize, onDiscard }: PendingQuoteCardProps) {
  const sourceColors: Record<string, string> = {
    'Claude': '#FF6B35',
    'Gemini': '#4285F4',
    'Kimi': '#00D9FF',
    'Codex': '#238636',
    'User': '#22C55E'
  };
  
  return (
    <motion.div
      className="pending-card"
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="pending-content">
        <p className="pending-text">"{quote.text.slice(0, 100)}{quote.text.length > 100 ? '...' : ''}"</p>
        <div className="pending-meta">
          <span 
            className="pending-source"
            style={{ color: sourceColors[quote.source] || '#888' }}
          >
            {quote.source}
          </span>
          <span className="pending-context">{quote.context.slice(0, 40)}...</span>
        </div>
      </div>
      
      <div className="pending-actions">
        <motion.button
          className="action-btn immortalize"
          onClick={onImmortalize}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Save quote to museum"
          title="Immortalize"
        >
          <Star size={16} />
        </motion.button>
        
        <motion.button
          className="action-btn discard"
          onClick={onDiscard}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Discard quote"
          title="Discard"
        >
          <X size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
