import axios from 'axios';
import { CONFIG } from '../config.js';

// Create a GitHub API client
const gh = axios.create({
  baseURL: 'https://api.github.com',
  headers: CONFIG.GITHUB_TOKEN
    ? { Authorization: `Bearer ${CONFIG.GITHUB_TOKEN}` }
    : {}
});

// Recursively list repo files (tree)
export async function listRepoTree({ owner, repo, ref = 'main' }) {
  const { data } = await gh.get(
    `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`
  );
  return (data.tree || []).filter((t) => t.type === 'blob');
}

// Read file contents (auto-decodes base64)
export async function getFileContent({ owner, repo, path, ref = 'main' }) {
  const { data } = await gh.get(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`
  );
  if (data.encoding === 'base64' && data.content) {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  return typeof data === 'string' ? data : '';
}
