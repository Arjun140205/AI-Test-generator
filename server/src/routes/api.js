import express from 'express';
import { listRepoTree, getFileContent } from '../github/api.js';
import { AIProvider } from '../ai/provider.js';

const router = express.Router();

router.get('/health', (_req, res) => res.json({ ok: true }));

// GET /api/github/tree?owner=&repo=&ref=
router.get('/github/tree', async (req, res) => {
  try {
    const { owner, repo, ref = 'main' } = req.query;
    if (!owner || !repo) return res.status(400).json({ error: 'owner and repo are required' });
    const tree = await listRepoTree({ owner, repo, ref });
    // keep common code files
    const allow = /\.(js|jsx|ts|tsx|py|java|go|rb|php|cs|cpp|c)$/i;
    const files = tree.filter((t) => allow.test(t.path)).map((t) => ({ path: t.path, size: t.size }));
    res.json({ ref, count: files.length, files });
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// POST /api/ai/summaries
// { owner, repo, ref, paths: [string] }
router.post('/ai/summaries', async (req, res) => {
  try {
    const { owner, repo, ref = 'main', paths = [] } = req.body;
    if (!owner || !repo || !Array.isArray(paths) || paths.length === 0) {
      return res.status(400).json({ error: 'owner, repo and non-empty paths[] required' });
    }
    const files = [];
    for (const p of paths) {
      const content = await getFileContent({ owner, repo, path: p, ref });
      files.push({ path: p, content });
    }
    const out = await AIProvider.summaries(files);
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// POST /api/ai/generate
// { owner, repo, ref, filePath, summary, framework }
router.post('/ai/generate', async (req, res) => {
  try {
    const { owner, repo, ref = 'main', filePath, summary, framework = 'Jest' } = req.body;
    if (!owner || !repo || !filePath || !summary) {
      return res.status(400).json({ error: 'owner, repo, filePath, summary required' });
    }
    const fileContent = await getFileContent({ owner, repo, path: filePath, ref });
    const code = await AIProvider.testCode({ framework, filePath, summary, fileContent });
    res.json({ framework, filePath, summary, code });
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

export default router;
