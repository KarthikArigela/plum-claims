import OpenAI from 'openai';

// Shared OpenAI client — single source of truth for all LLM agents.
// If gpt-5.4-mini isn't available on your account, swap here — both
// DocumentVerifier and InformationExtractor update automatically.
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const VISION_MODEL = 'gpt-5.4-mini';
