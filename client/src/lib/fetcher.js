const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

async function http(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export const api = {
  health: () => http('/api/health'),
  getTree: (owner, repo, ref) => http(`/api/github/tree?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&ref=${encodeURIComponent(ref || 'main')}`),
  getFileContent: (owner, repo, path, ref) => http(`/api/github/file?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}&ref=${encodeURIComponent(ref || 'main')}`),
  summaries: (payload) => http('/api/ai/summaries', { method: 'POST', body: JSON.stringify(payload) }),
  generate: (payload) => http('/api/generate-summary', { method: 'POST', body: JSON.stringify(payload) }),
};
