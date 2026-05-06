// Feature 2: Token Burn Visualization - Canvas Particle System
import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Settings2 } from 'lucide-react';
import { useTokenStore } from '../stores';

// Canvas dimensions
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 400;

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  tool: string;
  tokens: number;
}

export function TokenFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  
  const {
    flowData,
    isAnimating,
    animationSpeed,
    showCostOverlay,
    toggleAnimation,
    setAnimationSpeed
  } = useTokenStore();
  
  // Tool colors
  const toolColors: Record<string, string> = {
    'Claude': '#FF6B35',
    'Gemini': '#4285F4',
    'Kimi': '#00D9FF',
    'Codex': '#238636',
    'Z.ai': '#A855F7',
    'MiMo': '#F59E0B',
    'OpenCode': '#F97316',
    'OpenRouter': '#10B981',
    'Cursor': '#6366F1',
    'Copilot': '#8B5CF6',
    'Factory AI': '#EC4899'
  };
  
  // Initialize particles when flow data changes
  useEffect(() => {
    const newParticles: Particle[] = [];
    
    flowData.forEach((tool) => {
      // Number of particles proportional to token count
      const particleCount = Math.min(Math.floor(tool.totalTokens / 10_000_000), 50);
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: `${tool.tool}-${i}`,
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * CANVAS_HEIGHT,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.max(2, Math.log10(tool.totalTokens / particleCount) * 0.8),
          alpha: 0.6 + Math.random() * 0.4,
          tool: tool.tool,
          tokens: tool.totalTokens / particleCount
        });
      }
    });
    
    particlesRef.current = newParticles;
  }, [flowData]);
  
  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear with trail effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Update position
      particle.x += particle.vx * animationSpeed;
      particle.y += particle.vy * animationSpeed;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = CANVAS_WIDTH;
      if (particle.x > CANVAS_WIDTH) particle.x = 0;
      if (particle.y < 0) particle.y = CANVAS_HEIGHT;
      if (particle.y > CANVAS_HEIGHT) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = toolColors[particle.tool] || '#888';
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
      
      // Draw glow for larger particles
      if (particle.size > 4) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = toolColors[particle.tool] || '#888';
        ctx.globalAlpha = particle.alpha * 0.2;
        ctx.fill();
      }
    });
    
    ctx.globalAlpha = 1;
    
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isAnimating, animationSpeed]);
  
  // Start/stop animation
  useEffect(() => {
    if (isAnimating) {
      animate();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => cancelAnimationFrame(animationRef.current);
  }, [isAnimating, animate]);
  
  // Calculate burn rate
  const monthlyBurn = 133; // USD
  const dailyBurn = monthlyBurn / 30;
  
  return (
    <div className="token-flow-container">
      {/* Canvas */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="token-canvas"
        />
        
        {/* Cost Overlay */}
        {showCostOverlay && (
          <motion.div 
            className="cost-overlay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="cost-item">
              <span className="cost-label">Monthly Burn</span>
              <span className="cost-value">${monthlyBurn}</span>
            </div>
            <div className="cost-divider" />
            <div className="cost-item">
              <span className="cost-label">Daily Average</span>
              <span className="cost-value">${dailyBurn.toFixed(2)}</span>
            </div>
          </motion.div>
        )}
        
        {/* Legend */}
        <div className="tool-legend">
          {flowData.slice(0, 6).map((tool) => (
            <div key={tool.tool} className="legend-item">
              <span 
                className="legend-dot" 
                style={{ backgroundColor: toolColors[tool.tool] }}
              />
              <span className="legend-name">{tool.tool}</span>
              <span className="legend-value">
                {(tool.totalTokens / 1_000_000).toFixed(0)}M
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flow-controls">
        <button
          className="control-btn"
          onClick={toggleAnimation}
          aria-label={isAnimating ? 'Pause animation' : 'Play animation'}
        >
          {isAnimating ? <Pause size={16} /> : <Play size={16} />}
          <span>{isAnimating ? 'Pause' : 'Play'}</span>
        </button>
        
        <div className="speed-control">
          <Settings2 size={14} />
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            aria-label="Animation speed"
          />
          <span className="speed-value">{animationSpeed.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}
