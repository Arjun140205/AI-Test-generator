import React, { useState } from "react";

export default function RepoConnect({ onConnect }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");


  const parseRepoUrl = (url) => {
    // Supports: https://github.com/owner/repo or https://github.com/owner/repo/tree/branch
    try {
      const match = url.match(
        /^https?:\/\/github.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/
      );
      if (!match) return null;
      const [, owner, repo, ref] = match;
      return { owner, repo, ref: ref || 'main' };
    } catch {
      return null;
    }
  };

  const handleConnect = () => {
    if (!repoUrl.trim()) {
      setError("Please enter a valid repository URL");
      return;
    }
    const repoInfo = parseRepoUrl(repoUrl.trim());
    if (!repoInfo) {
      setError("Invalid GitHub repository URL");
      return;
    }
    setError("");
    onConnect(repoInfo);
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg flex flex-col gap-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800">
        Connect Your Repository
      </h2>
      <input
        type="text"
        placeholder="Enter GitHub Repo URL..."
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleConnect}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Connect
      </button>
    </div>
  );
}