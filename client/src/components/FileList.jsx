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
    <div className="bg-dark-secondary rounded-lg border border-dark-border overflow-hidden">
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-dark-text-primary">Repository Files</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={()=>toggleAll(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-dark-text-primary 
                       bg-dark-tertiary hover:bg-dark-secondary border border-dark-border rounded-md 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-dark-accent"
            >
              Select all
            </button>
            <button 
              onClick={()=>toggleAll(false)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-dark-text-primary 
                       bg-dark-tertiary hover:bg-dark-secondary border border-dark-border rounded-md 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-dark-accent"
            >
              Clear
            </button>
            <button 
              disabled={selected.length===0} 
              onClick={() => {
                if (selected.length > 0) {
                  onGenerateSummaries(selected);
                }
              }}
              className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-dark-accent
                       ${selected.length === 0 
                         ? 'bg-dark-tertiary text-dark-text-secondary cursor-not-allowed' 
                         : 'bg-dark-accent hover:bg-dark-accent-hover text-white'}`}
            >
              Generate Summaries
            </button>
          </div>
        </div>
      </div>
      <div className="max-h-[calc(100vh-300px)] overflow-auto p-4">
        <ul className="space-y-1">
          {files.map((f) => (
            <li key={f.path} className="group flex items-center py-1 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={!!checked[f.path]}
                  onChange={() => toggle(f.path)}
                  className="h-4 w-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <div className="ml-3 flex items-center space-x-2 min-w-0">
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    {f.path.endsWith('.js') ? '📄' : 
                     f.path.endsWith('.jsx') ? '⚛️' : 
                     f.path.endsWith('.css') ? '🎨' : 
                     f.path.endsWith('.json') ? '📋' : 
                     f.path.includes('.') ? '📄' : '📁'}
                  </span>
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white flex-1">
                    {f.path.split('/').map((part, i, arr) => (
                      i === arr.length - 1 ? (
                        <span key={i} className="font-medium">{part}</span>
                      ) : (
                        <span key={i} className="text-gray-400 dark:text-gray-500">{part}/</span>
                      )
                    ))}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        {files.length} files selected
      </div>
    </div>
  )
}
