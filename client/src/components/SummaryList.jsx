import { useState } from 'react';
import { HiOutlineCode } from 'react-icons/hi';
import { RiSparklingLine } from 'react-icons/ri';

export default function SummaryList({ data, onGenerateCode }) {
  const [framework, setFramework] = useState('Jest');
  const [selected, setSelected] = useState({});

  const hasSelection = Object.values(selected).some(v => !!v);

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <RiSparklingLine className="w-4 h-4 text-accent-400" />
          Test Summaries
        </h3>
        <div className="flex items-center gap-3">
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
            <HiOutlineCode className="w-4 h-4" />
            Generate
          </button>
        </div>
      </div>

      {data.files.length === 0 ? (
        <div className="text-center py-12">
          <RiSparklingLine className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No summaries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.files.map((file) => (
            <div key={file.path} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <code className="text-sm text-accent-400 block mb-3">{file.path}</code>
              <div className="space-y-2">
                {file.summaries.map((s, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selected[file.path] === s
                        ? 'bg-accent-500/10 border border-accent-500/30'
                        : 'bg-slate-900 border border-transparent hover:border-slate-700'
                      }`}
                  >
                    <input
                      type="radio"
                      name={file.path}
                      checked={selected[file.path] === s}
                      onChange={() => setSelected(prev => ({ ...prev, [file.path]: s }))}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-slate-300">{s}</span>
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
