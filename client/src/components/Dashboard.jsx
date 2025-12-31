import React, { useState, useEffect } from 'react';
import FileList from './FileList';
import RepoConnect from './RepoConnect';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

export default function Dashboard({ api, repoInfo, setRepoInfo, files, setFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (selectedFile && repoInfo) {
      api.getFileContent(repoInfo.owner, repoInfo.repo, selectedFile, repoInfo.ref)
        .then(setFileContent)
        .catch(() => setFileContent('// Failed to load file content.'));
    }
  }, [selectedFile, repoInfo, api]);

  const handleConnect = async (info) => {
    setLoadingFiles(true);
    try {
      await setRepoInfo(info);
      toast.success('Repository connected!');
    } catch (e) {
      toast.error('Failed to connect repository');
    } finally {
      setLoadingFiles(false);
    }
  };

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

  const getFileExtension = (path) => {
    const ext = path?.split('.').pop()?.toLowerCase();
    const langMap = {
      js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
      py: 'python', java: 'java', go: 'go', rb: 'ruby',
      php: 'php', cs: 'csharp', cpp: 'cpp', c: 'c'
    };
    return langMap[ext] || 'javascript';
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-7rem)]">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-40 btn-primary p-3 rounded-full shadow-glow-md"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          )}
        </svg>
      </button>

      {/* Left Sidebar - File Browser */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-30
        w-80 lg:w-72 xl:w-80
        bg-dark-surface border-r border-dark-border
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Repo Connect */}
        <div className="p-4 border-b border-dark-border">
          <RepoConnect onConnect={handleConnect} loading={loadingFiles} />
        </div>

        {/* File List */}
        <div className="flex-1 overflow-hidden">
          {repoInfo ? (
            <FileList
              files={files}
              onSelect={(path) => {
                setSelectedFile(path);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              selected={selectedFile}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-dark-elevated flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <p className="text-dark-muted text-sm">
                Connect a GitHub repository to browse files
              </p>
            </div>
          )}
        </div>

        {/* Repo Info */}
        {repoInfo && (
          <div className="p-4 border-t border-dark-border bg-dark-elevated/50">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-burgundy-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.24 3.4 9.68 8.12 11.25.6.12.82-.27.82-.58v-2.13c-3.3.74-4-1.6-4-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.77.08-.75.08-.75 1.22.09 1.86 1.28 1.86 1.28 1.08 1.87 2.83 1.33 3.52 1.02.11-.81.42-1.33.76-1.64-2.64-.31-5.42-1.35-5.42-6 0-1.32.46-2.4 1.22-3.25-.12-.31-.53-1.57.12-3.28 0 0 1-.33 3.3 1.24a11.4 11.4 0 0 1 6 0c2.3-1.57 3.3-1.24 3.3-1.24.65 1.71.24 2.97.12 3.28.76.85 1.22 1.93 1.22 3.25 0 4.67-2.79 5.68-5.45 5.99.43.37.81 1.1.81 2.22v3.29c0 .32.22.71.82.58A11.5 11.5 0 0 0 23.5 12.3 11.5 11.5 0 0 0 12 .5z" />
              </svg>
              <span className="text-dark-text font-medium truncate">
                {repoInfo.owner}/{repoInfo.repo}
              </span>
              <span className="badge ml-auto">{repoInfo.ref}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Viewer */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-dark-border">
          {/* File Header */}
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-dark-border bg-dark-surface">
            <div className="flex items-center gap-2 min-w-0">
              {selectedFile ? (
                <>
                  <svg className="w-5 h-5 text-burgundy-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <code className="text-sm text-dark-text truncate">{selectedFile}</code>
                </>
              ) : (
                <span className="text-dark-muted text-sm">Select a file to view</span>
              )}
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={loadingSummary || !fileContent}
              className="btn-primary text-sm py-2"
            >
              {loadingSummary ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zm13 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
                  </svg>
                  <span className="hidden sm:inline">Generate AI Summary</span>
                  <span className="sm:hidden">AI</span>
                </>
              )}
            </button>
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-6 bg-dark-bg">
            {fileContent ? (
              <div className="h-full rounded-xl overflow-hidden border border-dark-border">
                <SyntaxHighlighter
                  language={getFileExtension(selectedFile)}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: '#1a1214',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    height: '100%',
                  }}
                  showLineNumbers
                  lineNumberStyle={{ color: '#4a3a3d', minWidth: '3em' }}
                >
                  {fileContent}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-2xl bg-dark-surface flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <p className="text-dark-muted">
                  {repoInfo ? 'Select a file to view its contents' : 'Connect a repo to get started'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary Panel */}
        <aside className="w-full lg:w-96 xl:w-[28rem] flex flex-col bg-dark-surface border-t lg:border-t-0">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-dark-border">
            <h2 className="font-heading font-semibold text-dark-text flex items-center gap-2">
              <svg className="w-5 h-5 text-burgundy-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zm13 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zm-3 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
              </svg>
              AI Test Summary
            </h2>
            {summary && (
              <button onClick={handleCopy} className="btn-ghost text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {loadingSummary ? (
              <div className="space-y-4 animate-pulse">
                <div className="skeleton h-6 w-3/4 rounded-lg" />
                <div className="skeleton h-4 w-5/6 rounded-lg" />
                <div className="skeleton h-4 w-2/3 rounded-lg" />
                <div className="skeleton h-4 w-4/5 rounded-lg" />
                <div className="skeleton h-4 w-1/2 rounded-lg" />
              </div>
            ) : summary ? (
              <div className="prose prose-invert prose-sm max-w-none prose-headings:font-heading prose-headings:text-burgundy-300 prose-p:text-dark-text prose-code:text-burgundy-300 prose-code:bg-dark-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-dark-elevated flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-dark-muted" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zm13 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
                  </svg>
                </div>
                <p className="text-dark-muted text-sm">
                  Select a file and click<br />"Generate AI Summary"
                </p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
