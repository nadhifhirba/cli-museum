# Contributing to CLI Quote Museum

## Adding Quotes

1. Edit `src/data/quotes.ts`
2. Add your quote following this format:

```typescript
{
  id: 'unique-id',
  text: "Your memorable line",
  context: "When/why this was said",
  source: 'Claude', // 'Claude' | 'Gemini' | 'Kimi' | 'Codex' | 'User'
  date: '2026-04-07',
  tags: ['tag1', 'tag2'],
  sessionRef: 'SessionFile_2026-04-07', // optional
}
```

## Requirements

- Quote must be from actual CLI transcripts
- Context should explain the situation
- Date must be accurate
- Tags should be relevant and lowercase

## Development

```bash
npm install
npm run dev
npm run build
npm run test
```

## Code Style

- Use single quotes
- Trailing commas
- 2-space indentation
- No semicolons (except when necessary)

## Branch Protection

This repository uses branch protection rules:
- All PRs require review before merging
- CI checks must pass before merging
- Force pushes to main are prohibited
