// Feature 5: Context Time Machine — Full Session Reconstruction
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, GitBranch, Terminal, Image, Clock, ChevronRight } from 'lucide-react';
import { useQuoteStore } from '../stores';
import type { Quote, Session } from '../types';

interface TimeMachineModalProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'transcript' | 'files' | 'git' | 'screenshot';

export function TimeMachineModal({ quote, isOpen, onClose }: TimeMachineModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('transcript');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const { loadSession } = useQuoteStore();
  
  useEffect(() => {
    if (isOpen && quote.sessionRef) {
      setLoading(true);
      loadSession(quote.sessionRef)
        .then((data) => {
          setSession(data);
        })
        .catch((err) => {
          console.error('Failed to load session:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, quote.sessionRef, loadSession]);
  
  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="tm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="tm-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <div className="tm-header">
              <div className="tm-title">
                <Clock size={18} />
                <div>
                  <h3>Context Time Machine</h3>
                  <span className="tm-session-ref">{quote.sessionRef}</span>
                </div>
              </div>
              <button className="tm-close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="tm-tabs">
              <TabButton
                active={activeTab === 'transcript'}
                onClick={() => setActiveTab('transcript')}
                icon={<Terminal size={16} />}
                label="Transcript"
              />
              <TabButton
                active={activeTab === 'files'}
                onClick={() => setActiveTab('files')}
                icon={<FileText size={16} />}
                label="Files"
              />
              <TabButton
                active={activeTab === 'git'}
                onClick={() => setActiveTab('git')}
                icon={<GitBranch size={16} />}
                label="Git"
              />
              <TabButton
                active={activeTab === 'screenshot'}
                onClick={() => setActiveTab('screenshot')}
                icon={<Image size={16} />}
                label="Screenshot"
              />
            </div>
            
            {/* Content */}
            <div className="tm-content">
              {loading ? (
                <div className="tm-loading">
                  <div className="tm-spinner" />
                  <p>Loading session context...</p>
                </div>
              ) : !session ? (
                <div className="tm-empty">
                  <Terminal size={48} opacity={0.3} />
                  <p>Session data not available</p>
                  <span>This session hasn't been synced from Obsidian yet</span>
                </div>
              ) : (
                <>
                  {activeTab === 'transcript' && (
                    <TranscriptView session={session} quote={quote} />
                  )}
                  {activeTab === 'files' && (
                    <FilesView files={session.fileSnapshots} />
                  )}
                  {activeTab === 'git' && (
                    <GitView gitHead={session.gitHead} gitDiff={session.gitDiff} />
                  )}
                  {activeTab === 'screenshot' && (
                    <ScreenshotView screenshot={session.terminalScreenshot} />
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      className={`tm-tab ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Transcript View
function TranscriptView({ session, quote }: { session: Session; quote: Quote }) {
  const lines = session.transcript.split('\n');
  
  return (
    <div className="tm-transcript">
      {lines.map((line, i) => {
        const isHighlighted = line.includes(quote.text.slice(0, 30));
        
        return (
          <div
            key={i}
            className={`transcript-line ${isHighlighted ? 'highlighted' : ''}`}
          >
            <span className="line-number">{(i + 1).toString().padStart(3, '0')}</span>
            <span className="line-content">{line}</span>
          </div>
        );
      })}
    </div>
  );
}

// Files View
function FilesView({ files }: { files: Session['fileSnapshots'] }) {
  if (files.length === 0) {
    return (
      <div className="tm-empty-state">
        <FileText size={32} opacity={0.3} />
        <p>No file snapshots available</p>
      </div>
    );
  }
  
  return (
    <div className="tm-files">
      {files.map((file, i) => (
        <div key={i} className="file-item">
          <ChevronRight size={14} />
          <span className="file-path">{file.path}</span>
          {file.language && (
            <span className="file-lang">{file.language}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// Git View
function GitView({ gitHead, gitDiff }: { gitHead: string; gitDiff?: string }) {
  return (
    <div className="tm-git">
      <div className="git-commit">
        <span className="git-label">Commit:</span>
        <code className="git-hash">{gitHead}</code>
      </div>
      
      {gitDiff ? (
        <pre className="git-diff">{gitDiff}</pre>
      ) : (
        <div className="tm-empty-state">
          <GitBranch size={32} opacity={0.3} />
          <p>No git diff available</p>
        </div>
      )}
    </div>
  );
}

// Screenshot View
function ScreenshotView({ screenshot }: { screenshot?: string }) {
  if (!screenshot) {
    return (
      <div className="tm-empty-state">
        <Image size={32} opacity={0.3} />
        <p>No screenshot captured</p>
        <span>Terminal screenshots are captured automatically in future sessions</span>
      </div>
    );
  }
  
  return (
    <div className="tm-screenshot">
      <img src={screenshot} alt="Terminal state during session" />
    </div>
  );
}
