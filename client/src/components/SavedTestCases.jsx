import React, { useEffect, useState } from 'react';

export default function SavedTestCases({ user }) {
  const [testcases, setTestcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [editCode, setEditCode] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [versionIdx, setVersionIdx] = useState(null);

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
    setEditCode(tc.versions[tc.versions.length-1].code);
    setEditSummary(tc.versions[tc.versions.length-1].summary || '');
    setVersionIdx(tc.versions.length-1);
  };

  const handleSave = async () => {
    if (!selected) return;
    const res = await fetch(`/api/testcases/${selected._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: editCode, summary: editSummary })
    });
    const data = await res.json();
    if (res.ok) {
      setTestcases(tcs => tcs.map(tc => tc._id === data.testcase._id ? data.testcase : tc));
      setSelected(data.testcase);
      setVersionIdx(data.testcase.versions.length-1);
    } else {
      alert(data.error || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test case?')) return;
    const res = await fetch(`/api/testcases/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) setTestcases(tcs => tcs.filter(tc => tc._id !== id));
    else alert('Delete failed');
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
      setVersionIdx(data.testcase.versions.length-1);
      setEditCode(data.testcase.versions[data.testcase.versions.length-1].code);
      setEditSummary(data.testcase.versions[data.testcase.versions.length-1].summary || '');
    } else {
      alert(data.error || 'Restore failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Saved Test Cases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ul className="divide-y">
            {testcases.map(tc => (
              <li key={tc._id} className="py-2 flex items-center justify-between">
                <span className="truncate">{tc.filePath}</span>
                <button className="btn ml-2" onClick={() => handleSelect(tc)}>View/Edit</button>
                <button className="ml-2 text-red-500" onClick={() => handleDelete(tc._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selected && (
            <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
              <div className="font-semibold">{selected.filePath}</div>
              <textarea className="input h-40" value={editCode} onChange={e => setEditCode(e.target.value)} />
              <input className="input" value={editSummary} onChange={e => setEditSummary(e.target.value)} placeholder="Summary (optional)" />
              <button className="btn" onClick={handleSave}>Save New Version</button>
              <div className="mt-2">
                <div className="font-semibold mb-1">Version History:</div>
                <ul className="text-xs">
                  {selected.versions.map((v, idx) => (
                    <li key={idx} className={idx === versionIdx ? 'font-bold' : ''}>
                      {new Date(v.createdAt).toLocaleString()} - <button className="underline" onClick={() => handleRestore(idx)}>Restore</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
