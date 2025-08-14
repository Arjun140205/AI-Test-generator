import dotenv from 'dotenv';
dotenv.config();
export const CONFIG = {
  PORT: process.env.PORT || 8080,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  AI_PROVIDER: (process.env.AI_PROVIDER || 'none').toLowerCase(),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/workik-testgen'
};
