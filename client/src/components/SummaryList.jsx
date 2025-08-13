import { useState } from 'react'

export default function SummaryList({ data, onGenerateCode }) {
  const [framework, setFramework] = useState('Jest')
  const [selected, setSelected] = useState({}) // {path: summary}

  const select = (path, summary) => setSelected(prev => ({ ...prev, [path]: summary }))

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Suggested Test Case Summaries</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">Framework:</label>
          <select className="input !w-auto" value={framework} onChange={(e)=>setFramework(e.target.value)}>
            <option>Jest</option>
            <option>PyTest</option>
            <option>JUnit</option>
          </select>
          <button className="btn" onClick={() => onGenerateCode({ selected, framework })}>Generate Code</button>
        </div>
      </div>
      {data.files.length === 0 ? <p className="text-slate-300">No summaries yet.</p> : (
        <div className="space-y-5">
          {data.files.map((file)=>(
            <div key={file.path} className="border border-slate-700/60 rounded-xl p-4">
              <div className="text-slate-300 mb-3"><code>{file.path}</code></div>
              <div className="space-y-2">
                {file.summaries.map((s, idx)=>(
                  <label key={idx} className="flex items-start gap-3">
                    <input type="radio" name={file.path} checked={selected[file.path]===s} onChange={()=>select(file.path, s)} className="mt-1" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
