import { useMemo, useState } from 'react'

export default function FileList({ files, onGenerateSummaries }) {
  const [checked, setChecked] = useState({})
  const all = useMemo(()=>files.map(f=>f.path), [files])
  const selected = useMemo(()=>Object.entries(checked).filter(([k,v])=>v).map(([k])=>k), [checked])

  const toggleAll = (val) => {
    const next = {}
    for (const p of all) next[p] = val
    setChecked(next)
  }

  const toggle = (p) => setChecked(prev => ({ ...prev, [p]: !prev[p] }))

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Repository Files</h3>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700" onClick={()=>toggleAll(true)}>Select all</button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700" onClick={()=>toggleAll(false)}>Clear</button>
          <button disabled={selected.length===0} className="btn" onClick={()=>onGenerateSummaries(selected)}>
            Generate Summaries
          </button>
        </div>
      </div>
      <div className="max-h-[360px] overflow-auto pr-1">
        <ul className="space-y-1">
          {files.map((f)=>(
            <li key={f.path} className="flex items-center gap-3">
              <input type="checkbox" className="checkbox" checked={!!checked[f.path]} onChange={()=>toggle(f.path)} />
              <code className="text-slate-200">{f.path}</code>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-slate-400 mt-3">{files.length} files</div>
    </div>
  )
}
