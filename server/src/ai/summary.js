import { CONFIG } from '../config.js';
import axios from 'axios';

const QA_PROMPT = `You are an expert software QA engineer.\nGiven the following code, generate:\n1. Unit test case scenarios with clear descriptions.\n2. Edge cases to consider.\n3. Suggestions for improving code testability.\nFormat your output in Markdown with headings and bullet points.`;

export async function generateSummaryAI({ code }) {
  if (!CONFIG.AI_PROVIDER || CONFIG.AI_PROVIDER === 'none') {
    return '# AI provider not configured.\nPlease set OPENAI_API_KEY or GEMINI_API_KEY in .env to enable AI-based summaries.';
  }
  if (!code) throw new Error('No code provided');

  let aiResponse;
  if (CONFIG.AI_PROVIDER === 'openai') {
    aiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: QA_PROMPT },
        { role: 'user', content: code }
      ],
      max_tokens: 800
    }, {
      headers: {
        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return aiResponse.data.choices[0].message.content;
  } else if (CONFIG.AI_PROVIDER === 'gemini') {
    aiResponse = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + CONFIG.GEMINI_API_KEY, {
      contents: [
        { role: 'user', parts: [{ text: QA_PROMPT + '\n' + code }] }
      ]
    });
    return aiResponse.data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Unknown AI provider');
  }
}
