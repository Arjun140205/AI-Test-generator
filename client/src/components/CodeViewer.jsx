import { HiOutlineClipboardCopy, HiOutlineDownload } from 'react-icons/hi';

export default function CodeViewer({ code, meta }) {
  if (!code) return null;

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = meta?.suggestedName || 'test.txt';
    a.click();
  };

  const copy = () => navigator.clipboard.writeText(code);

  return (
    <div className="card p-5 animate-scale-up">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <span className="badge badge-accent">{meta?.framework || 'Test'}</span>
            <span>for</span>
          </div>
          <code className="text-slate-200 text-sm truncate block">{meta?.filePath || 'file'}</code>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="btn-secondary py-2 px-3 text-sm">
            <HiOutlineClipboardCopy className="w-4 h-4" />
          </button>
          <button onClick={download} className="btn-primary py-2 px-3 text-sm">
            <HiOutlineDownload className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
        <pre className="p-4 overflow-auto max-h-96 text-sm font-mono text-slate-300 leading-relaxed scrollbar-none">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
