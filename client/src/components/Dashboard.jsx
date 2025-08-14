import React, { useState, useEffect } from 'react';
import FileList from './FileList';
import RepoConnect from './RepoConnect';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

export default function Dashboard({ api, repoInfo, setRepoInfo, files, setFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaries, setSummaries] = useState({ files: [] });
  
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#0d1117';
  }, []);

  useEffect(() => {
    if (selectedFile) {
      api.getFileContent(repoInfo.owner, repoInfo.repo, selectedFile, repoInfo.ref)
        .then(setFileContent)
        .catch(() => setFileContent('Failed to load file content.'));
    }
  }, [selectedFile, repoInfo, api]);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    setSummary('');
    try {
      const data = await api.generate({ code: fileContent });
      setSummary(data.markdown);
      toast.success('AI summary generated!');
    } catch (e) {
      setSummary('');
      toast.error(e.message || 'Failed to generate summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.info('Summary copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="flex h-[calc(100vh-60px)]">
        {/* Left: Repo Tree */}
        <aside className="w-80 border-r border-dark-border bg-dark-secondary overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-dark-border">
            <RepoConnect onConnect={setRepoInfo} />
          </div>
          <div className="flex-1 p-4">
            <FileList 
              files={files} 
              onGenerateSummaries={async (selected) => {
                try {
                  const paths = selected;
                  const res = await api.summaries({
                    owner: repoInfo.owner,
                    repo: repoInfo.repo,
                    ref: repoInfo.ref,
                    paths
                  });
                  setSummaries(res);
                } catch (err) {
                  console.error('Failed to generate summaries:', err);
                  toast.error('Failed to generate summaries');
                }
              }}
              onSelect={setSelectedFile} 
              selected={selectedFile} 
            />
          </div>
        </aside>

        {/* Center: Code Editor */}
        <main className="flex-1 flex flex-col overflow-hidden bg-dark-primary">
          <div className="border-b border-dark-border bg-dark-secondary px-6 py-4">
            <h2 className="text-lg font-medium text-dark-text-primary">
              {selectedFile ? (
                <span className="flex items-center space-x-2">
                  <span className="text-dark-text-secondary">File:</span>
                  <span className="font-mono">{selectedFile}</span>
                </span>
              ) : (
                'Select a file to view'
              )}
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="h-full rounded-lg border border-dark-border bg-dark-secondary overflow-hidden">
              <div className="p-4 h-full overflow-auto">
                {fileContent ? (
                  <SyntaxHighlighter
                    language="javascript"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#c9d1d9'
                    }}
                    className="h-full"
                    customStyle={{ 
                      background: 'transparent', 
                      fontSize: '14px',
                      backgroundColor: '#21262d',
                      borderRadius: '6px',
                      padding: '1rem'
                    }}
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-text-secondary">
                    No file selected
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-dark-border bg-dark-secondary p-4">
            <button
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors
                ${loadingSummary || !fileContent
                  ? 'bg-dark-tertiary text-dark-text-secondary cursor-not-allowed'
                  : 'bg-dark-accent hover:bg-dark-accent-hover text-white'}`}
              onClick={handleGenerateSummary}
              disabled={loadingSummary || !fileContent}
            >
              {loadingSummary ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate AI Summary'
              )}
            </button>
          </div>
        </main>

        {/* Right: AI Summary Panel */}
        <aside className="w-96 border-l border-dark-border bg-dark-secondary overflow-hidden flex flex-col">
          <div className="p-4 border-b border-dark-border">
            <h2 className="text-lg font-medium text-dark-text-primary">AI Test Summary</h2>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {loadingSummary ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-dark-tertiary rounded-md w-3/4"></div>
                <div className="h-4 bg-dark-tertiary rounded-md w-5/6"></div>
                <div className="h-4 bg-dark-tertiary rounded-md w-2/3"></div>
                <div className="h-4 bg-dark-tertiary rounded-md w-1/2"></div>
              </div>
            ) : summary ? (
              <div className="prose prose-invert prose-sm max-w-none text-dark-text-primary">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-dark-text-secondary">
                No summary generated yet
              </div>
            )}
          </div>
          {summary && (
            <div className="p-4 border-t border-dark-border">
              <button
                onClick={handleCopy}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-dark-text-primary bg-dark-tertiary hover:bg-dark-accent hover:text-white transition-colors"
              >
                Copy Summary
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
