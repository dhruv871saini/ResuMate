import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

async function callGemini(systemPrompt, userContent) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  console.log(` apikey  hh ${process.env.GEMINI_API_KEY}`)
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  console.log(`gemini ${apiKey}`)

  const genAI = new GoogleGenAI({ apiKey });

  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${userContent}` }]
      }
    ]
  });

  return {
    text: response.text,
    model: 'gemini-2.5-flash',
    provider: 'gemini'
  };
}

async function callGroq(systemPrompt, userContent) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error('GROQ_API_KEY not set');
  console.log(`grok ${apiKey}`)

  const groq = new Groq({ apiKey });
  const trimmed = userContent.length > 12000 ? userContent.slice(0, 12000) + '...' : userContent;
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    model: 'llama-3.3-70b-versatile',  // higher TPM limit than 8b-instant
    temperature: 0.1,
    max_tokens: 8000   // bumped — 3000 caused JSON truncation
  });

  return {
    text: chatCompletion.choices[0].message.content,
    model: 'llama-3.1-8b-instant',
    provider: 'groq',
    tokensUsed: chatCompletion.usage?.total_tokens
  };
}

async function callOllama(systemPrompt, userContent) {
  const base  = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL    || 'llama3:latest';

  console.log(`[Ollama] Using model: ${model}`);

  const response = await axios.post(
    `${base}/api/generate`,
    {
      model,
      prompt: `${systemPrompt}\n\n${userContent}`,
      stream: false,
      think: false,
      options: {
        temperature: 0.1,
        num_predict: 8000,
        stop: ['```']
      }
    },
    { timeout: 120000 }
  );

  const raw  = response.data.response ?? '';
  const text = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  if (!text) throw new Error('Empty response from Ollama');

  return { text, model, provider: 'ollama' };
}

export function parseJSON(text) {
  // Strip markdown fences
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // First attempt: clean parse
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Second attempt: extract first {...} block (model added prose before/after)
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (_) {}
  }

  // Third attempt: salvage truncated JSON
  try {
    const salvaged = cleaned
      .replace(/,\s*$/, '')       // trailing comma
      .replace(/[^}\]]*$/, '')    // trim incomplete trailing value
      + '}}';
    return JSON.parse(salvaged);
  } catch (_) {}

  throw new Error(`Cannot parse JSON: ${cleaned.slice(0, 200)}`);
}

export async function ask(systemPrompt, userContent) {
  const providers = [
    // { name: 'Gemini', fn: callGemini },
    { name: 'Groq',   fn: callGroq   },
    // { name: 'Ollama', fn: callOllama }
  ];

  let lastError;
  for (const provider of providers) {
    try {
      console.log(`[LLM] Trying ${provider.name}...`);
      const result = await provider.fn(systemPrompt, userContent);
      console.log(`[LLM] ✓ ${provider.name} succeeded (${result.model})`);
      return result;
    } catch (err) {
      console.warn(`[LLM] ✗ ${provider.name} failed: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`All LLM providers failed. Last error: ${lastError?.message}`);
}

export async function askJSON(systemPrompt, userContent) {
  const { text, provider, model } = await ask(systemPrompt, userContent);
  try {
    return {
      data: parseJSON(text),
      provider,
      model
    };
  } catch (error) {
    throw new Error(`LLM returned invalid JSON from ${provider}:\n${text.slice(0, 300)}`);
  }
}
