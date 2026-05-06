# CLI Quote Museum — AI Agent Context

## Project Overview

A curated museum of memorable quotes from CLI coding sessions across Claude, Gemini, Kimi, Codex, and more. Built with React + Vite + TypeScript.

## Architecture Decisions

- **Static Site**: No backend, deployable anywhere (Vercel, Netlify, GitHub Pages)
- **Neo-Industrial Brutalism**: Dark mode first, orange accent (#FF6B35), Geist Mono typography
- **No External Fonts**: System fonts only for performance
- **Client-Side State**: No state management library needed

## Tech Stack

- React 19 (latest)
- Vite 8 (fast dev + build)
- TypeScript (strict mode)
- Framer Motion (animations)
- Lucide React (icons)

## File Structure

```
src/
├── data/quotes.ts    # All quotes + token stats (EDIT THIS TO ADD QUOTES)
├── test/             # Vitest tests
├── App.tsx           # Main component
└── *.css             # Styles
```

## Adding Quotes

1. Edit `src/data/quotes.ts`
2. Add to the `quotes` array
3. Follow existing format exactly
4. Run `npm test` to verify

## Key Conventions

- Single quotes in TypeScript
- 2-space indentation
- No semicolons (ASI)
- Trailing commas
- CSS variables for theming

## Testing

```bash
npm test           # Run tests
npm run test:coverage  # With coverage
```

## Build

```bash
npm run build      # Outputs to dist/
```

## Deployment

```bash
# Docker
docker-compose up

# Or static host (Vercel/Netlify)
# Upload dist/ folder
```

## Design Tokens

```css
--bg-primary: #0a0a0a;
--accent-orange: #FF6B35;
--text-primary: #ffffff;
--font-mono: 'Geist Mono', 'SF Mono', monospace;
```
