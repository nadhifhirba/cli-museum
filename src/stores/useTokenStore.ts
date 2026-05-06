// Feature 2: Token Burn Visualization State
import { create } from 'zustand';
import type { TokenFlow, TokenTimeRange, TokenParticle } from '../types';
import { tokenStats } from '../data/quotes';

interface TokenState {
  // Data
  flowData: TokenFlow[];
  timeRange: TokenTimeRange;
  isAnimating: boolean;
  animationSpeed: number;
  
  // View options
  showCostOverlay: boolean;
  showToolLabels: boolean;
  particleDensity: 'low' | 'medium' | 'high';
  
  // Computed
  totalInRange: number;
  burnRate: number; // tokens per day
  
  // Actions
  setTimeRange: (range: TokenTimeRange) => void;
  simulateFlow: () => void;
  toggleAnimation: () => void;
  setAnimationSpeed: (speed: number) => void;
  setParticleDensity: (density: 'low' | 'medium' | 'high') => void;
  toggleCostOverlay: () => void;
  toggleToolLabels: () => void;
  
  // Canvas helpers
  generateParticles: (tool: string, count: number) => TokenParticle[];
}

// Tool colors matching existing sourceColors
const TOOL_COLORS: Record<string, string> = {
  'Claude': '#FF6B35',
  'Gemini': '#4285F4',
  'Kimi': '#00D9FF',
  'Codex': '#238636',
  'Z.ai': '#A855F7',
  'MiMo': '#F59E0B',
  'OpenCode': '#F97316',
  'OpenRouter': '#10B981',
  'Cursor': '#6366F1',
  'Factory AI': '#EC4899'
};

// Canvas dimensions (will be dynamic in component)
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

export const useTokenStore = create<TokenState>((set, get) => ({
  // Initial state
  flowData: [],
  timeRange: {
    start: new Date('2026-01-01'),
    end: new Date()
  },
  isAnimating: true,
  animationSpeed: 1,
  showCostOverlay: true,
  showToolLabels: true,
  particleDensity: 'medium',
  totalInRange: tokenStats.totalTokens,
  burnRate: 0,
  
  // Actions
  setTimeRange: (range) => {
    set({ timeRange: range });
    get().simulateFlow();
  },
  
  simulateFlow: () => {
    const { timeRange, particleDensity, generateParticles } = get();
    
    // Calculate particles per tool based on density
    const densityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 2
    }[particleDensity];
    
    const flows: TokenFlow[] = Object.entries(tokenStats.byTool).map(([tool, tokens]) => {
      // Scale particles by token count (capped at 100 per tool)
      const baseCount = Math.min(tokens / 5_000_000, 50);
      const particleCount = Math.floor(baseCount * densityMultiplier);
      
      return {
        tool,
        totalTokens: tokens,
        color: TOOL_COLORS[tool] || '#888',
        particles: generateParticles(tool, particleCount)
      };
    });
    
    // Calculate burn rate (tokens per day in range)
    const daysInRange = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const burnRate = daysInRange > 0 ? tokenStats.totalTokens / Math.max(daysInRange, 30) : 0;
    
    set({ 
      flowData: flows,
      totalInRange: tokenStats.totalTokens,
      burnRate
    });
  },
  
  toggleAnimation: () => set((state) => ({ isAnimating: !state.isAnimating })),
  
  setAnimationSpeed: (speed) => set({ animationSpeed: Math.max(0.1, Math.min(3, speed)) }),
  
  setParticleDensity: (density) => {
    set({ particleDensity: density });
    get().simulateFlow();
  },
  
  toggleCostOverlay: () => set((state) => ({ showCostOverlay: !state.showCostOverlay })),
  
  toggleToolLabels: () => set((state) => ({ showToolLabels: !state.showToolLabels })),
  
  generateParticles: (tool, count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${tool}-${i}-${Date.now()}`,
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      tokens: tokenStats.byTool[tool] / count,
      tool
    }));
  }
}));

// Initialize flow on load
setTimeout(() => {
  useTokenStore.getState().simulateFlow();
}, 0);
