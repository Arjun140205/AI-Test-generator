
import express from 'express';
import { listRepoTree, getFileContent } from '../github/api.js';
import { AIProvider } from '../ai/provider.js';

const router = express.Router();




// POST /api/generate-testcases
// { files: [{ path, content }], framework }
router.post('/generate-testcases', async (req, res) => {
  try {
    const { files = [], framework = 'Jest' } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Non-empty files[] required' });
    }
    if (typeof req.app.locals.AIProvider?.testCode !== 'function') {
      return res.status(503).json({ error: 'AI provider not configured.' });
    }
    // Generate test code for each file
    const results = [];
    for (const file of files) {
      let code, error;
      try {
        code = await req.app.locals.AIProvider.testCode({
          framework,
          filePath: file.path,
          summary: file.summary || '',
          fileContent: file.content || ''
        });
      } catch (e) {
        error = e.message || 'Failed to generate test code';
      }
      results.push({ path: file.path, code, error });
    }
    res.json({ results });
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});


// POST /api/generate-summary
// { code: string }
router.post('/generate-summary', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });
    try {
      const markdown = await generateSummaryAI({ code });
      res.json({ markdown });
    } catch (e) {
      res.status(500).json({ error: e.message || 'AI summary generation failed' });
    }
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});


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
    
    // Fetch file contents in parallel
    const files = await Promise.all(paths.map(async (p) => {
      try {
        const content = await getFileContent({ owner, repo, path: p, ref });
        return { path: p, content };
      } catch (err) {
        console.error(`Failed to fetch content for ${p}:`, err);
        return { path: p, content: '// Failed to load file content' };
      }
    }));

    // Generate summaries using AI provider
    const out = await AIProvider.summaries(files);
    
    // Add error handling for empty summaries
    if (!out || !out.files || out.files.length === 0) {
      return res.status(500).json({ error: 'Failed to generate summaries' });
    }
    
    res.json(out);
  } catch (e) {
    console.error('Summary generation error:', e);
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
