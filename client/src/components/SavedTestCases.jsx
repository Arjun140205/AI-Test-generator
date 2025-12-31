import { useEffect, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlineSave, HiOutlineClock, HiOutlineRefresh } from 'react-icons/hi';

export default function SavedTestCases({ user, onBack }) {
  const [testcases, setTestcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editCode, setEditCode] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [versionIdx, setVersionIdx] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/testcases', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setTestcases(data.testcases || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (tc) => {
    setSelected(tc);
    setEditCode(tc.versions[tc.versions.length - 1].code);
    setEditSummary(tc.versions[tc.versions.length - 1].summary || '');
    setVersionIdx(tc.versions.length - 1);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/testcases/${selected._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: editCode, summary: editSummary })
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setTestcases(tcs => tcs.map(tc => tc._id === data.testcase._id ? data.testcase : tc));
      setSelected(data.testcase);
      setVersionIdx(data.testcase.versions.length - 1);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this test case?')) return;
    const res = await fetch(`/api/testcases/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      setTestcases(tcs => tcs.filter(tc => tc._id !== id));
      if (selected?._id === id) setSelected(null);
    }
  };

  const handleRestore = async (idx) => {
    if (!selected) return;
    const res = await fetch(`/api/testcases/${selected._id}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ versionIndex: idx })
    });
    const data = await res.json();
    if (res.ok) {
      setTestcases(tcs => tcs.map(tc => tc._id === data.testcase._id ? data.testcase : tc));
      setSelected(data.testcase);
      setVersionIdx(data.testcase.versions.length - 1);
      setEditCode(data.testcase.versions[data.testcase.versions.length - 1].code);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Saved Test Cases</h1>
        <p className="text-slate-400 text-sm mt-1">{testcases.length} saved</p>
      </div>

      {testcases.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
            <HiOutlineSave className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-400">No test cases saved yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-2">
            {testcases.map(tc => (
              <button
                key={tc._id}
                onClick={() => handleSelect(tc)}
                className={`w-full card-interactive p-4 text-left ${selected?._id === tc._id ? 'border-accent-500/50' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <code className="text-sm text-slate-200 truncate block">{tc.filePath}</code>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge">{tc.framework}</span>
                      <span className="text-xs text-slate-500">{tc.versions.length} versions</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(tc._id); }}
                    className="btn-icon text-slate-500 hover:text-error-400"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div>
            {selected ? (
              <div className="card p-5 animate-fade-in sticky top-20">
                <h3 className="font-medium text-white truncate mb-4">{selected.filePath}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Code</label>
                    <textarea
                      className="input font-mono text-sm min-h-[180px] resize-y"
                      value={editCode}
                      onChange={e => setEditCode(e.target.value)}
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Summary</label>
                    <input
                      className="input text-sm"
                      value={editSummary}
                      onChange={e => setEditSummary(e.target.value)}
                      placeholder="Optional description"
                    />
                  </div>

                  <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-2.5">
                    {saving ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <HiOutlineSave className="w-4 h-4" />
                    )}
                    Save New Version
                  </button>

                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <HiOutlineClock className="w-3.5 h-3.5" />
                      Version History
                    </div>
                    <div className="space-y-1 max-h-32 overflow-auto scrollbar-none">
                      {selected.versions.map((v, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs ${idx === versionIdx ? 'bg-accent-500/10 text-accent-400' : 'bg-slate-900 text-slate-400'
                            }`}
                        >
                          <span>{new Date(v.createdAt).toLocaleString()}</span>
                          {idx !== versionIdx && (
                            <button onClick={() => handleRestore(idx)} className="text-accent-400 hover:text-accent-300">
                              <HiOutlineRefresh className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-slate-500 text-sm">Select a test case to edit</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
