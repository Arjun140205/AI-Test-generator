import axios from 'axios';
import { CONFIG } from '../config.js';

const gh = axios.create({
  baseURL: 'https://api.github.com',
  headers: CONFIG.GITHUB_TOKEN ? { Authorization: `Bearer ${CONFIG.GITHUB_TOKEN}` } : {}
});

export async function createBranch({ owner, repo, base = 'main', newBranch }) {
  const baseRef = await gh.get(`/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(base)}`);
  const sha = baseRef.data.object.sha;
  const res = await gh.post(`/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${newBranch}`, sha });
  return res.data;
}

export async function createOrUpdateFile({ owner, repo, branch, path, content, message }) {
  const url = `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  let sha;
  try {
    const existing = await gh.get(url, { params: { ref: branch } });
    sha = existing.data.sha;
  } catch (_) {}
  const res = await gh.put(url, {
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch,
    sha
  });
  return res.data;
}

export async function openPR({ owner, repo, title, head, base = 'main', body }) {
  const { data } = await gh.post(`/repos/${owner}/${repo}/pulls`, { title, head, base, body });
  return data;
}
