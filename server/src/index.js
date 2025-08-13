import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import api from './routes/api.js';
import 'dotenv/config';

const app = express();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: false }));
app.use(express.json({ limit: '5mb' }));

app.use('/api', api);

app.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});
