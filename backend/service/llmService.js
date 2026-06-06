import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

async function callGemini(systemPrompt, userContent) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const genAI = new GoogleGenAI(apiKey);

    const fullPrompt = `${systemPrompt}\n\n${userContent}`;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: fullPrompt
    });
    const text = response.text;

    return {
        text: text,
        model: 'gemini-1.5-flash',
        provider: 'gemini'
    };
}

async function callGroq(systemPrompt, userContent) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY not set');

    const groq = new Groq({ apiKey: apiKey });

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.3,
        max_tokens: 3000
    });

    return {
        text: chatCompletion.choices[0].message.content,
        model: 'llama3-8b-8192',
        provider: 'groq',
        tokensUsed: chatCompletion.usage?.total_tokens
    };
}

async function callOllama(systemPrompt, userContent) {
    const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'qwen3:8b';

    const response = await axios.post(
        `${base}/api/generate`,
        {
            model: model,
            prompt: `${systemPrompt}\n\n${userContent}`,
            stream: false,
            options: {
                temperature: 0.3,
                num_predict: 3000
            }
        },
        { timeout: 60000 }
    );

    return {
        text: response.data.response,
        model: model,
        provider: 'ollama'
    };
}

export function parseJSON(text) {
    const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
    return JSON.parse(cleaned);
}

export async function ask(systemPrompt, userContent) {
    const providers = [
        { name: 'Gemini', fn: callGemini },
        { name: 'Groq', fn: callGroq },
        { name: 'Ollama', fn: callOllama }
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