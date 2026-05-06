# CLI Quote Museum — Architecture

## Overview

A curated collection of memorable lines from CLI coding sessions, built with React + Vite + TypeScript.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Language | TypeScript 5 |
| Styling | CSS Variables (Neo-Industrial Brutalism) |
| Animation | Framer Motion |
| Icons | Lucide React |

## Project Structure

```
src/
├── data/
│   └── quotes.ts          # All quotes + token stats
├── components/            # (if needed in future)
├── App.tsx               # Main component
├── App.css               # Styles
├── index.css             # Global styles
└── main.tsx              # Entry point

public/                   # Static assets
dist/                     # Build output
```

## Data Model

### Quote
```typescript
interface Quote {
  id: string;           // unique identifier
  text: string;         // the quote itself
  context: string;      // when/why it was said
  source: 'Claude' | 'Gemini' | 'Kimi' | 'Codex' | 'User';
  date: string;         // YYYY-MM-DD
  tags: string[];       // categories
  sessionRef?: string;  // transcript file reference
}
```

### TokenStats
```typescript
interface TokenStats {
  totalTokens: number;
  byTool: Record<string, number>;
  byMonth: Record<string, number>;
  wittyComparisons: Comparison[];
}
```

## Design System

**Neo-Industrial Brutalism:**
- Dark mode first (#0a0a0a)
- Orange accent (#FF6B35)
- Geist Mono typography
- CRT scanlines + grid overlay
- High contrast, minimal decoration

## State Management

Local React state only:
- `currentQuote`: Currently displayed quote
- `statsVisible`: Toggle for stats panel
- `copied`: Copy feedback state

## Accessibility

- Skip link for keyboard users
- ARIA labels on all interactive elements
- Focus-visible indicators
- Reduced motion support
- High contrast mode support

## Performance

- No external fonts (system fonts only)
- CSS animations (GPU accelerated)
- Lazy loading for stats panel
- Optimized bundle size
