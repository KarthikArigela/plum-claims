import OpenAI from 'openai';

// Shared OpenAI client — single source of truth for all LLM agents.
// If gpt-5.4-mini isn't available on your account, swap here — both
// DocumentVerifier and InformationExtractor update automatically.
export const VISION_MODEL = 'gpt-5.4-mini';

// Lazy Initialization created on first use, not at import time
// This ensures env vars are loaded before the client is constructed
let _client: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set. Check .env.local and ensure loadEnvConfig runs before any OpenAI calls.')
    }
    _client = new OpenAI({ apiKey })
  }
  return _client
}

// Keep named export for backward compat — but access via getter
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return (getOpenAIClient() as any)[prop]
  }
})
