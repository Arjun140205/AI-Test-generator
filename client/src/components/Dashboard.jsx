import { useState, useEffect } from 'react';
import { HiOutlineCode, HiOutlineDocumentText, HiOutlineChevronLeft } from 'react-icons/hi';
import { RiSparklingLine } from 'react-icons/ri';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

import FileList from './FileList';
import RepoConnect from './RepoConnect';

export default function Dashboard({ api, repoInfo, setRepoInfo, files, setFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [view, setView] = useState('files'); // 'files' | 'code' | 'summary'

  useEffect(() => {
    if (selectedFile && repoInfo) {
      api.getFileContent(repoInfo.owner, repoInfo.repo, selectedFile, repoInfo.ref)
        .then(setFileContent)
        .catch(() => setFileContent('// Failed to load file'));
    }
  }, [selectedFile, repoInfo, api]);

  const handleConnect = async (info) => {
    setLoadingFiles(true);
    try {
      await setRepoInfo(info);
      toast.success('Repository connected');
    } catch {
      toast.error('Failed to connect');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleSelectFile = (path) => {
    setSelectedFile(path);
    setSummary('');
    setView('code');
  };

  const handleGenerateSummary = async () => {
    if (!fileContent) return;
    setLoadingSummary(true);
    setSummary('');
    try {
      const data = await api.generate({ code: fileContent });
      setSummary(data.markdown);
      setView('summary');
      toast.success('Summary generated');
    } catch (e) {
      toast.error(e.message || 'Failed to generate');
    } finally {
      setLoadingSummary(false);
    }
  };

  const getLanguage = (path) => {
    const ext = path?.split('.').pop()?.toLowerCase();
    return { js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx', py: 'python', java: 'java', go: 'go' }[ext] || 'text';
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Sidebar - Files */}
      <aside className={`
        ${view === 'files' ? 'flex' : 'hidden lg:flex'}
        flex-col w-full lg:w-80 xl:w-88 border-r border-slate-800/50 bg-slate-950
      `}>
        {/* Repo Connect */}
        <div className="p-4 border-b border-slate-800/50">
          <RepoConnect onConnect={handleConnect} loading={loadingFiles} />
        </div>

        {/* Files */}
        <div className="flex-1 overflow-hidden">
          {repoInfo ? (
            <FileList
              files={files}
              onSelect={handleSelectFile}
              selected={selectedFile}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                <HiOutlineCode className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">Connect a repository to browse files</p>
            </div>
          )}
        </div>

        {/* Repo Badge */}
        {repoInfo && (
          <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-300 font-medium truncate">
                {repoInfo.owner}/{repoInfo.repo}
              </span>
              <span className="badge badge-accent ml-auto">{repoInfo.ref}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className={`
        ${view !== 'files' ? 'flex' : 'hidden lg:flex'}
        flex-1 flex-col overflow-hidden
      `}>
        {/* Top Bar */}
        <div className="flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-slate-800/50 bg-slate-900/30">
          {/* Mobile back button */}
          <button
            onClick={() => setView('files')}
            className="lg:hidden btn-icon -ml-2"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>

          {/* File name */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <HiOutlineDocumentText className="w-4 h-4 text-slate-500 flex-shrink-0" />
            {selectedFile ? (
              <code className="text-sm text-slate-300 truncate">{selectedFile}</code>
            ) : (
              <span className="text-sm text-slate-500">Select a file</span>
            )}
          </div>

          {/* View Toggle */}
          {selectedFile && (
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => setView('code')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'code' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Code
              </button>
              <button
                onClick={() => setView('summary')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'summary' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                AI Summary
              </button>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateSummary}
            disabled={loadingSummary || !fileContent}
            className="btn-primary py-2 text-sm"
          >
            {loadingSummary ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <RiSparklingLine className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{loadingSummary ? 'Generating...' : 'Generate'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {view === 'code' && fileContent && (
            <div className="h-full rounded-xl overflow-hidden border border-slate-800 animate-fade-in">
              <SyntaxHighlighter
                language={getLanguage(selectedFile)}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: '1.25rem',
                  background: '#0f0f17',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  height: '100%',
                }}
                showLineNumbers
                lineNumberStyle={{ color: '#363649', minWidth: '3em' }}
              >
                {fileContent}
              </SyntaxHighlighter>
            </div>
          )}

          {view === 'summary' && (
            <div className="animate-fade-in">
              {loadingSummary ? (
                <div className="space-y-4">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-5/6 rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
              ) : summary ? (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:font-semibold prose-headings:text-slate-100 prose-p:text-slate-300 prose-code:text-accent-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                    <RiSparklingLine className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm">Click Generate to create an AI summary</p>
                </div>
              )}
            </div>
          )}

          {view === 'code' && !fileContent && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                <HiOutlineCode className="w-7 h-7 text-slate-500" />
              </div>
              <p className="text-slate-400">
                {repoInfo ? 'Select a file to view' : 'Connect a repo to get started'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
