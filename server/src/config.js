import dotenv from 'dotenv';
dotenv.config();
export const CONFIG = {
  PORT: process.env.PORT || 8080,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  AI_PROVIDER: (process.env.AI_PROVIDER || 'none').toLowerCase(),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
