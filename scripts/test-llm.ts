// generate-test-docs.ts
import OpenAI from 'openai'
import { loadEnvConfig } from '@next/env'

// Load environment variables from .env.local
loadEnvConfig(process.cwd())

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function main() {
  const models = await openai.models.list()
  const relevant = models.data
    .map(m => m.id)
    .filter(id => id.includes('gpt') || id.includes('o1') || id.includes('o3'))
    .sort()
  console.log('✅ Key works. Available models:')
  relevant.forEach(m => console.log(' ', m))
}

main().catch(e => console.error('❌ Key failed:', e.message))