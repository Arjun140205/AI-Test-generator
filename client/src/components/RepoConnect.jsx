import React, { useState } from "react";

export default function RepoConnect({ onConnect, loading }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");

  const parseRepoUrl = (url) => {
    try {
      const match = url.match(
        /^https?:\/\/github.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/
      );
      if (!match) return null;
      const [, owner, repo, ref] = match;
      return { owner, repo: repo.replace('.git', ''), ref: ref || 'main' };
    } catch {
      return null;
    }
  };

  const handleConnect = () => {
    if (!repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }
    const repoInfo = parseRepoUrl(repoUrl.trim());
    if (!repoInfo) {
      setError("Invalid GitHub URL format");
      return;
    }
    setError("");
    onConnect(repoInfo);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-dark-text">
        GitHub Repository
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="https://github.com/owner/repo"
          value={repoUrl}
          onChange={(e) => {
            setRepoUrl(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="input flex-1 text-sm"
          disabled={loading}
        />
        <button
          onClick={handleConnect}
          disabled={loading}
          className="btn-primary px-4 flex-shrink-0"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-400 animate-fade-in">{error}</p>
      )}
      <p className="text-xs text-dark-muted">
        Supports: github.com/owner/repo or github.com/owner/repo/tree/branch
      </p>
    </div>
  );
}