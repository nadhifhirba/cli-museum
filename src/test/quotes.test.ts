import { describe, it, expect } from 'vitest'
import { quotes, getRandomQuote, formatTokens, tokenStats } from '../data/quotes'

describe('Quotes Data', () => {
  it('should have quotes', () => {
    expect(quotes.length).toBeGreaterThan(0)
  })

  it('should have unique IDs', () => {
    const ids = quotes.map(q => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have valid sources', () => {
    const validSources = ['Claude', 'Gemini', 'Kimi', 'Codex', 'User']
    quotes.forEach(quote => {
      expect(validSources).toContain(quote.source)
    })
  })

  it('should have required fields', () => {
    quotes.forEach(quote => {
      expect(quote.id).toBeDefined()
      expect(quote.text).toBeDefined()
      expect(quote.text.length).toBeGreaterThan(0)
      expect(quote.context).toBeDefined()
      expect(quote.date).toBeDefined()
      expect(quote.tags).toBeInstanceOf(Array)
    })
  })

  it('getRandomQuote should return a quote', () => {
    const quote = getRandomQuote()
    expect(quote).toBeDefined()
    expect(quotes).toContain(quote)
  })
})

describe('Token Stats', () => {
  it('should have total tokens', () => {
    expect(tokenStats.totalTokens).toBeGreaterThan(0)
  })

  it('should have byTool breakdown', () => {
    const toolTotal = Object.values(tokenStats.byTool).reduce((a, b) => a + b, 0)
    expect(toolTotal).toBeGreaterThan(0)
  })

  it('should format tokens correctly', () => {
    expect(formatTokens(1000)).toBe('1.0K')
    expect(formatTokens(1000000)).toBe('1.0M')
    expect(formatTokens(500)).toBe('500')
  })
})
