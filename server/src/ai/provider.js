import { CONFIG } from '../config.js';
import { fallbackSummaries, fallbackTestCode } from './fallback.js';

export const AIProvider = {
  async summaries(files) {
    if (!CONFIG.AI_PROVIDER || CONFIG.AI_PROVIDER === 'none') {
      // Friendly message for no AI provider
      return {
        files: files.map(f => ({
          path: f.path,
          summaries: [
            'AI provider not configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in .env to enable AI-based summaries.'
          ]
        }))
      };
    }
    // TODO: Add OpenAI/Gemini integration here
    return fallbackSummaries(files);
  },
  async testCode({ framework, filePath, summary, fileContent }) {
    if (!CONFIG.AI_PROVIDER || CONFIG.AI_PROVIDER === 'none') {
      return '// AI provider not configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in .env to enable AI-based test code generation.';
    }
    // TODO: Add OpenAI/Gemini integration here
    return fallbackTestCode({ framework, filePath, summary, fileContent });
  }
};
