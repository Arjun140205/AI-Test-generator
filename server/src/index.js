
import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import api from './routes/api.js';
import { AIProvider } from './ai/provider.js';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import testCaseRoutes from './routes/testcases.js';


const app = express();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Connect to MongoDB
mongoose.connect(CONFIG.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB error', err); process.exit(1); });

app.use(cors({
  origin: (origin, callback) => {
    // Allow all localhost ports for dev
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127.0.0.1:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRoutes);


// Attach AIProvider to app.locals for use in routes
app.locals.AIProvider = AIProvider;
app.use('/api/testcases', testCaseRoutes);
app.use('/api', api);

app.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});
