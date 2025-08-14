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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          GitHub Repository
        </h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Repository URL
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="repo-url"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 
                       sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                       placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            onClick={handleConnect}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm
                     bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                     dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors"
          >
            Connect
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}