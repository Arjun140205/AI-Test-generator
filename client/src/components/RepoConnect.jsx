import { useState } from 'react';
import { HiOutlineLink } from 'react-icons/hi';
import { VscGithub } from 'react-icons/vsc';

export default function RepoConnect({ onConnect, loading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const parseUrl = (input) => {
    const match = input.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/);
    if (!match) return null;
    const [, owner, repo, ref] = match;
    return { owner, repo: repo.replace('.git', ''), ref: ref || 'main' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Enter a repository URL');
      return;
    }
    const info = parseUrl(url.trim());
    if (!info) {
      setError('Invalid GitHub URL');
      return;
    }
    setError('');
    onConnect(info);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <VscGithub className="w-4 h-4" />
        <span>Repository</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="github.com/owner/repo"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(''); }}
          className="input flex-1 text-sm py-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-4"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiOutlineLink className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-error-400">{error}</p>
      )}
    </form>
  );
}