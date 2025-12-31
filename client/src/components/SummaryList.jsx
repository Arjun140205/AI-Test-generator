import { useState } from 'react';

export default function SummaryList({ data, onGenerateCode }) {
  const [framework, setFramework] = useState('Jest');
  const [selected, setSelected] = useState({});

  const select = (path, summary) => setSelected(prev => ({ ...prev, [path]: summary }));

  const hasSelection = Object.values(selected).some(v => !!v);

  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-heading font-semibold text-dark-text flex items-center gap-2">
          <svg className="w-5 h-5 text-burgundy-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zm13 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
          </svg>
          Test Case Summaries
        </h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-dark-muted">Framework:</label>
          <select
            className="input !w-auto py-1.5 text-sm"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
          >
            <option>Jest</option>
            <option>PyTest</option>
            <option>JUnit</option>
          </select>
          <button
            className="btn-primary text-sm"
            onClick={() => onGenerateCode({ selected, framework })}
            disabled={!hasSelection}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Generate Code
          </button>
        </div>
      </div>

      {/* Summaries */}
      {data.files.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-dark-elevated flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dark-muted" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zm13 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
            </svg>
          </div>
          <p className="text-dark-muted">No summaries generated yet</p>
          <p className="text-sm text-dark-muted mt-1">Select files and generate summaries first</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.files.map((file) => (
            <div
              key={file.path}
              className="p-4 rounded-xl bg-dark-elevated border border-dark-border"
            >
              <code className="text-sm text-burgundy-300 font-medium block mb-3">
                {file.path}
              </code>
              <div className="space-y-2">
                {file.summaries.map((s, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${selected[file.path] === s
                        ? 'bg-burgundy-500/20 border border-burgundy-500/50'
                        : 'bg-dark-surface border border-transparent hover:border-dark-border'
                      }`}
                  >
                    <input
                      type="radio"
                      name={file.path}
                      checked={selected[file.path] === s}
                      onChange={() => select(file.path, s)}
                      className="mt-0.5 w-4 h-4 text-burgundy-500 bg-dark-elevated border-dark-border focus:ring-burgundy-500 focus:ring-offset-dark-bg"
                    />
                    <span className="text-sm text-dark-text leading-relaxed">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
