// Feature 3: AI Response Generator for Quote Conversations
import type { Quote, AIResponse } from '../types';

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES: Record<string, string[]> = {
  Claude: [
    "I'd have phrased that differently, but the energy is right.",
    "Solid insight. Let's ship it.",
    "Have you considered the edge cases?"
  ],
  Gemini: [
    "Fascinating perspective. Here's an alternative view...",
    "The data supports this conclusion.",
    "Let me google that for you."
  ],
  Kimi: [
    ".execute(immediately)",
    "Gas pol? Gas pol.",
    "I see what you did there."
  ],
  Codex: [
    "LGTM",
    "This code speaks for itself.",
    "Minimal, efficient, merged."
  ],
  'Z.ai': [
    "Processing... insight acquired.",
    "Through the GLM lens, this makes sense.",
    "Efficient. Like my token usage."
  ]
};

/**
 * Generate an AI response to a quote
 * Uses Gemini API if available, falls back to canned responses
 */
export async function generateAIResponse(
  quote: Quote,
  respondingAs: AIResponse['respondingAs'],
  personality: AIResponse['personality']
): Promise<AIResponse> {
  // Try Gemini API first
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      const response = await callGeminiAPI(quote, respondingAs, personality, apiKey);
      return response;
    }
  } catch (error) {
    console.warn('[AIResponder] API call failed, using fallback:', error);
  }
  
  // Fallback to canned response
  const responses = FALLBACK_RESPONSES[respondingAs] || ["Interesting."];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    id: crypto.randomUUID(),
    quoteId: quote.id,
    respondingAs,
    responseText: randomResponse,
    generatedAt: new Date(),
    personality
  };
}

async function callGeminiAPI(
  quote: Quote,
  respondingAs: AIResponse['respondingAs'],
  personality: AIResponse['personality'],
  apiKey: string
): Promise<AIResponse> {
  const prompt = `You are ${respondingAs}, an AI coding assistant, responding to this quote from a CLI session:

"${quote.text}"
Context: ${quote.context}
Original speaker: ${quote.source}

Respond in a ${personality} tone, as if you're in the same coding session.
Keep it under 100 characters. Be witty, memorable, and authentic to ${respondingAs}'s voice.
Examples:
- sassy: sarcastic, dry humor, slightly judgmental
- technical: precise, focused on implementation details
- philosophical: broader implications, meta-commentary

Response:`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.9
        }
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }
  
  const data = await response.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No comment.";
  
  return {
    id: crypto.randomUUID(),
    quoteId: quote.id,
    respondingAs,
    responseText: responseText.trim(),
    generatedAt: new Date(),
    personality
  };
}
