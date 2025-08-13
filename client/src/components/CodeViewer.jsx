export default function CodeViewer({ code, meta }) {
  if (!code) return null
  const download = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = (meta?.suggestedName || 'test.generated.txt')
    a.click()
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(code) } catch {}
  }
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-slate-300">{meta?.framework} for <code>{meta?.filePath || 'selected file(s)'}</code></div>
          <div className="text-xs text-slate-400">{meta?.summary}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700" onClick={copy}>Copy</button>
          <button className="btn" onClick={download}>Download</button>
        </div>
      </div>
      <pre className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 overflow-auto max-h-[420px] text-sm"><code>{code}</code></pre>
    </div>
  )
}
