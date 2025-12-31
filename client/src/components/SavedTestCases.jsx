import React, { useEffect, useState } from 'react';

export default function SavedTestCases({ user, onBack }) {
  const [testcases, setTestcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [editCode, setEditCode] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [versionIdx, setVersionIdx] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/testcases', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setTestcases(data.testcases || []);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load test cases'); setLoading(false); });
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
    } else {
      alert(data.error || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test case?')) return;
    const res = await fetch(`/api/testcases/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      setTestcases(tcs => tcs.filter(tc => tc._id !== id));
      if (selected?._id === id) setSelected(null);
    } else {
      alert('Delete failed');
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
      setEditSummary(data.testcase.versions[data.testcase.versions.length - 1].summary || '');
    } else {
      alert(data.error || 'Restore failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-burgundy-500/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-burgundy-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-dark-muted">Loading test cases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-dark-muted hover:text-dark-text mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark-text">
            Saved Test Cases
          </h1>
          <p className="text-dark-muted text-sm mt-1">
            {testcases.length} test case{testcases.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {testcases.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-dark-elevated flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-heading font-semibold text-dark-text mb-2">No test cases yet</h3>
          <p className="text-dark-muted text-sm">
            Generate some test cases from the dashboard to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Case List */}
          <div className="space-y-3">
            {testcases.map(tc => (
              <div
                key={tc._id}
                className={`card p-4 cursor-pointer transition-all duration-200 ${selected?._id === tc._id
                    ? 'border-burgundy-500 shadow-glow-sm'
                    : 'card-hover'
                  }`}
                onClick={() => handleSelect(tc)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <code className="text-sm text-dark-text font-medium truncate block">
                      {tc.filePath}
                    </code>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge">{tc.framework}</span>
                      <span className="text-xs text-dark-muted">
                        {tc.versions.length} version{tc.versions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(tc._id); }}
                    className="btn-icon text-dark-muted hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Editor Panel */}
          <div>
            {selected ? (
              <div className="card p-6 animate-fade-in sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-dark-text truncate">
                    {selected.filePath}
                  </h3>
                </div>

                {/* Code Editor */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark-muted mb-2">
                    Test Code
                  </label>
                  <textarea
                    className="input font-mono text-sm min-h-[200px] resize-y"
                    value={editCode}
                    onChange={e => setEditCode(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark-muted mb-2">
                    Summary (optional)
                  </label>
                  <input
                    className="input"
                    value={editSummary}
                    onChange={e => setEditSummary(e.target.value)}
                    placeholder="Brief description of the test"
                  />
                </div>

                {/* Save Button */}
                <button
                  className="btn-primary w-full py-3 mb-6"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save New Version
                    </>
                  )}
                </button>

                {/* Version History */}
                <div>
                  <h4 className="text-sm font-medium text-dark-muted mb-3">Version History</h4>
                  <div className="space-y-2 max-h-40 overflow-auto scrollbar-hide">
                    {selected.versions.map((v, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-lg text-sm ${idx === versionIdx
                            ? 'bg-burgundy-500/20 text-burgundy-300'
                            : 'bg-dark-elevated text-dark-muted'
                          }`}
                      >
                        <span>
                          {new Date(v.createdAt).toLocaleDateString()} {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {idx !== versionIdx && (
                          <button
                            onClick={() => handleRestore(idx)}
                            className="text-xs text-burgundy-400 hover:text-burgundy-300"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-dark-elevated flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <p className="text-dark-muted">Select a test case to view and edit</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
