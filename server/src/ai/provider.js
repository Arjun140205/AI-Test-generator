import { CONFIG } from '../config.js';
import { fallbackSummaries, fallbackTestCode } from './fallback.js';

export const AIProvider = {
  async summaries(files) {
    // In future, call OpenAI/Gemini here if CONFIG.AI_PROVIDER != 'none'
    return fallbackSummaries(files);
  },
  async testCode({ framework, filePath, summary, fileContent }) {
    return fallbackTestCode({ framework, filePath, summary, fileContent });
  }
};
