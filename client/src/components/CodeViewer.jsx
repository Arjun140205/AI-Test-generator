export default function CodeViewer({ code, meta }) {
  if (!code) return null;

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (meta?.suggestedName || 'test.generated.txt');
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch { }
  };

  return (
    <div className="card p-6 animate-scale-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-dark-muted mb-1">
            <span className="badge">{meta?.framework || 'Test'}</span>
            <span>for</span>
          </div>
          <code className="text-dark-text font-medium text-sm truncate block">
            {meta?.filePath || 'selected file(s)'}
          </code>
          {meta?.summary && (
            <p className="text-xs text-dark-muted mt-1 line-clamp-2">
              {meta.summary}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="btn-secondary py-2 px-3 text-sm"
            onClick={copy}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            className="btn-primary py-2 px-3 text-sm"
            onClick={download}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="rounded-xl bg-dark-bg border border-dark-border overflow-hidden">
        <pre className="p-4 overflow-auto max-h-[420px] text-sm font-mono text-dark-text leading-relaxed scrollbar-hide">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
