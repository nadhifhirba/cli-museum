import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  RefreshCw, 
  Quote, 
  Zap, 
  Coffee, 
  Hash,
  Cpu,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Radio,
  Activity,
  MessageCircle,
  Clock
} from 'lucide-react';
import { 
  useQuoteStore,
  useViewStore,
  useTokenStore
} from './stores';
import { formatTokens, tokenStats } from './data/quotes';
import { LiveCaptureSidebar } from './components/LiveCaptureSidebar';
import { TokenFlowCanvas } from './components/TokenFlowCanvas';
import { ConversationThread } from './components/ConversationThread';
import { TimeMachineModal } from './components/TimeMachineModal';
import type { Quote as QuoteType } from './types';
import './App.css';

// Source color mapping
const sourceColors: Record<string, string> = {
  'Claude': '#FF6B35',
  'Gemini': '#4285F4',
  'Kimi': '#00D9FF',
  'Codex': '#238636',
  'Antigravity': '#A855F7',
  'OpenCode': '#F59E0B',
  'User': '#22C55E',
  'Z.ai': '#A855F7',
  'MiMo': '#F59E0B',
  'OpenRouter': '#10B981',
  'Cursor': '#6366F1',
  'Factory AI': '#EC4899'
};

const sourceIcons: Record<string, string> = {
  'Claude': '◈',
  'Gemini': '◇',
  'Kimi': '◉',
  'Codex': '◎',
  'Antigravity': '◆',
  'OpenCode': '▣',
  'User': '●',
  'Z.ai': '◐',
  'MiMo': '◑',
  'OpenRouter': '◒',
  'Cursor': '◓',
  'Factory AI': '◔'
};

// Witty comparisons
const wittyComparisons = tokenStats.wittyComparisons;

function App() {
  // New store-based state
  const { 
    quotes, 
    getRandomQuote
  } = useQuoteStore();
  const { view, navigateTo } = useViewStore();
  const { simulateFlow } = useTokenStore();
  
  // Local UI state
  const [currentQuote, setCurrentQuote] = useState<QuoteType>(getRandomQuote());
  const [comparison, setComparison] = useState(wittyComparisons[Math.floor(Math.random() * wittyComparisons.length)]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeMachineOpen, setTimeMachineOpen] = useState(false);
  
  const refreshQuote = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setComparison(wittyComparisons[Math.floor(Math.random() * wittyComparisons.length)]);
      setIsRefreshing(false);
    }, 300);
  }, [getRandomQuote]);
  
  const copyQuote = useCallback(() => {
    navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.source}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentQuote]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to refresh quote (when not in input)
      if (e.code === 'Space' && !e.repeat && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        refreshQuote();
      }
      
      // ⌘/Ctrl + K to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      
      // Escape to close sidebar
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshQuote, sidebarOpen]);
  
  // Initialize token flow simulation
  useEffect(() => {
    simulateFlow();
  }, [simulateFlow]);
  

  
  return (
    <div className={`museum ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Animated background grid */}
      <div className="grid-overlay" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      
      {/* Feature Navigation Toolbar */}
      <motion.nav 
        className="feature-toolbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button 
          className={view.current === 'museum' ? 'active' : ''}
          onClick={() => navigateTo('museum')}
          title="Museum View"
        >
          <Quote size={14} />
          <span>MUSEUM</span>
        </button>
        <button 
          className={view.current === 'live' ? 'active' : ''}
          onClick={() => setSidebarOpen(true)}
          title="Live Capture (⌘K)"
        >
          <Radio size={14} />
          <span>LIVE</span>
        </button>
        <button 
          className={view.current === 'tokens' ? 'active' : ''}
          onClick={() => navigateTo('tokens')}
          title="Token Flow"
        >
          <Activity size={14} />
          <span>FLOW</span>
        </button>
        <button 
          className={view.current === 'conversations' ? 'active' : ''}
          onClick={() => navigateTo('conversations')}
          title="Conversations"
        >
          <MessageCircle size={14} />
          <span>THREADS</span>
        </button>
        <div className="toolbar-divider" />
        <button 
          className={`stats-btn ${statsVisible ? 'active' : ''}`}
          onClick={() => setStatsVisible(!statsVisible)}
          title="Toggle Statistics"
          aria-expanded={statsVisible}
          aria-controls="stats-panel"
        >
          <Cpu size={14} />
          <span>STATS</span>
        </button>
      </motion.nav>
      
      {/* Sidebar Toggle (visible when sidebar closed) */}
      {!sidebarOpen && (
        <motion.button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Open Live Capture (⌘K)"
        >
          <span className="live-dot offline" />
          <span>LIVE</span>
        </motion.button>
      )}
      
      {/* Live Capture Sidebar */}
      <LiveCaptureSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="header">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Terminal className="logo-icon" />
          <span className="logo-text">CLI_QUOTE_MUSEUM</span>
          <span className="version">v2.0.0</span>
        </motion.div>
        

      </header>

      {/* Main content */}
      <main id="main-content" className="main" role="main" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          {view.current === 'tokens' ? (
            <motion.div
              key="token-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', maxWidth: '1000px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Token Burn Visualization
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  947.5M tokens consumed across all CLI tools
                </p>
              </div>
              <TokenFlowCanvas />
            </motion.div>
          ) : view.current === 'conversations' ? (
            <motion.div
              key="conversations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Quote Conversations
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  What would other AI assistants say?
                </p>
              </div>
              <ConversationThread quote={currentQuote} />
            </motion.div>
          ) : (
            <motion.div
              key="quote-view"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="quote-container">
                {/* Quote icon */}
                <div className="quote-icon">
                  <Quote size={48} />
                </div>

                {/* Quote text */}
                <blockquote className="quote-text">
                  {currentQuote.text}
                </blockquote>

                {/* Context */}
                <p className="quote-context">
                  {currentQuote.context}
                </p>

                {/* Meta info */}
                <div className="quote-meta">
                  <div 
                    className="source-badge"
                    style={{ 
                      color: sourceColors[currentQuote.source] || '#888',
                      borderColor: sourceColors[currentQuote.source] || '#888'
                    }}
                  >
                    <span className="source-icon">{sourceIcons[currentQuote.source]}</span>
                    <span>{currentQuote.source.toUpperCase()}</span>
                  </div>
                  
                  <div className="date-badge">
                    <span>{currentQuote.date}</span>
                  </div>

                  <div className="tags">
                    {currentQuote.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">
                        <Hash size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <motion.div 
                className="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="btn btn-primary"
                  onClick={refreshQuote}
                  disabled={isRefreshing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Get random quote (Space)"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} aria-hidden="true" />
                  <span>RANDOM QUOTE</span>
                  <kbd className="kbd" aria-label="Space keyboard shortcut">SPACE</kbd>
                </motion.button>

                <motion.button
                  className="btn btn-secondary"
                  onClick={copyQuote}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={copied ? 'Quote copied to clipboard' : 'Copy quote to clipboard'}
                  aria-live="polite"
                >
                  {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </motion.button>
                
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => setTimeMachineOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="View context in Time Machine"
                  title="View full session context"
                >
                  <Clock size={18} />
                  <span>CONTEXT</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Panel */}
        <AnimatePresence>
          {statsVisible && (
            <motion.div
              id="stats-panel"
              className="stats-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stats-grid">
                {/* Total tokens */}
                <div className="stat-card total">
                  <div className="stat-icon"><Zap size={20} /></div>
                  <div className="stat-value">{formatTokens(tokenStats.totalTokens)}</div>
                  <div className="stat-label">TOTAL TOKENS</div>
                </div>

                {/* By tool */}
                {Object.entries(tokenStats.byTool).map(([tool, tokens]) => (
                  <div key={tool} className="stat-card tool">
                    <div 
                      className="stat-bar" 
                      style={{ 
                        width: `${(tokens / tokenStats.totalTokens) * 100}%`,
                        background: sourceColors[tool] || '#666'
                      }} 
                    />
                    <div className="stat-content">
                      <span className="tool-name" style={{ color: sourceColors[tool] }}>
                        {sourceIcons[tool]} {tool}
                      </span>
                      <span className="tool-value">{formatTokens(tokens)}</span>
                    </div>
                  </div>
                ))}

                {/* Witty comparison */}
                <div className="stat-card comparison">
                  <div className="stat-icon"><Sparkles size={20} /></div>
                  <div className="comparison-content">
                    <span className="comparison-value">
                      {comparison.value >= 1 ? comparison.value.toLocaleString() : comparison.value}
                      <span className="comparison-unit">{comparison.unit}</span>
                    </span>
                    <span className="comparison-metric">{comparison.metric}</span>
                  </div>
                  <div className="comparison-desc">{comparison.description}</div>
                </div>

                {/* Session count estimate */}
                <div className="stat-card sessions">
                  <div className="stat-icon"><Coffee size={20} /></div>
                  <div className="stat-value">428</div>
                  <div className="stat-label">SESSIONS LOGGED</div>
                </div>

                {/* Quote count */}
                <div className="stat-card quotes">
                  <div className="stat-icon"><Quote size={20} /></div>
                  <div className="stat-value">{quotes.length}</div>
                  <div className="stat-label">CURATED QUOTES</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <span className="footer-text">Built with caffeine and hallucinations</span>
        </div>
        <div className="footer-right">
          <a 
            href="https://nhadesign.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            NHADesign <ExternalLink size={12} />
          </a>
        </div>
      </footer>
      
      {/* Time Machine Modal */}
      <TimeMachineModal
        quote={currentQuote}
        isOpen={timeMachineOpen}
        onClose={() => setTimeMachineOpen(false)}
      />
    </div>
  );
}

export default App;
