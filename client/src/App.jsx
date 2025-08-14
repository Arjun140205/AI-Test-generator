
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Profile from './components/Auth/Profile';
import Logout from './components/Auth/Logout';
import SavedTestCases from './components/SavedTestCases';
import Dashboard from './components/Dashboard';
import { api } from './lib/fetcher';

export default function App() {
  const [healthOk, setHealthOk] = useState(false);
  const [repoInfo, setRepoInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('repoInfo');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [files, setFiles] = useState([]);
  const [summaries, setSummaries] = useState({ files: [] });
  const [code, setCode] = useState('');
  const [codeMeta, setCodeMeta] = useState(null);
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [theme] = useState('dark'); // 'login' | 'signup' | 'profile' | 'logout' | 'saved'

  useEffect(() => {
    api.health().then(()=>setHealthOk(true)).catch(()=>setHealthOk(false));
    // Try to fetch user profile on load
    fetch('/api/auth/profile', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && data.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  const fetchFiles = async ({ owner, repo, ref }) => {
    const data = await api.getTree(owner, repo, ref);
    const info = { owner, repo, ref: ref || 'main' };
    setRepoInfo(info);
    setFiles(data.files);
    setSummaries({ files: [] });
    setCode('');
    localStorage.setItem('repoInfo', JSON.stringify(info));
  };

  const handleGenerateSummaries = async (paths) => {
    if (!repoInfo) return
    setBusy(true)
    try {
      const res = await api.summaries({ owner: repoInfo.owner, repo: repoInfo.repo, ref: repoInfo.ref, paths })
      setSummaries(res)
      setCode('')
    } catch (e) {
      alert(e.message || 'Failed to generate summaries')
    } finally {
      setBusy(false)
    }
  }

  const handleGenerateCode = async ({ selected, framework }) => {
    if (!repoInfo) return
    // naive: take the first selected summary
    const entries = Object.entries(selected).filter(([, v]) => !!v)
    if (entries.length === 0) { alert('Select at least one summary'); return }
    const [filePath, summary] = entries[0]
    setBusy(true)
    try {
      const res = await api.generate({
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        ref: repoInfo.ref,
        filePath,
        summary,
        framework
      })
      setCode(res.code)
      const ext = framework.toLowerCase().includes('pytest') ? 'py'
        : framework.toLowerCase().includes('junit') ? 'java'
        : 'test.js'
      setCodeMeta({ framework: res.framework, filePath: res.filePath, summary: res.summary, suggestedName: `${filePath.replace(/\\//g, '_')}.${ext}` })
    } catch (e) {
      alert(e.message || 'Failed to generate code')
    } finally {
      setBusy(false)
    }
  }

  // Auth page routing
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        {authPage === 'signup' ? (
          <>
            <Signup onSignup={u => { setUser(u); setAuthPage('profile'); }} />
            <div className="mt-4 text-center">
              <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
              <button className="underline text-blue-600 dark:text-blue-400" onClick={() => setAuthPage('login')}>Login</button>
            </div>
          </>
        ) : (
          <>
            <Login onLogin={u => { setUser(u); setAuthPage('profile'); }} />
            <div className="mt-4 text-center">
              <span className="text-gray-600 dark:text-gray-300">Don't have an account? </span>
              <button className="underline text-blue-600 dark:text-blue-400" onClick={() => setAuthPage('signup')}>Sign Up</button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (authPage === 'logout') {
    return <Logout onLogout={() => { setUser(null); setAuthPage('login'); }} />;
  }

  if (authPage === 'profile') {
    return <Profile user={user} onLogout={() => setAuthPage('logout')} />;
  }

  if (authPage === 'saved') {
    return <SavedTestCases user={user} />;
  }

  // Main app UI
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <nav className="flex gap-4 p-4">
        <button className="btn" onClick={() => setAuthPage('profile')}>Profile</button>
        <button className="btn" onClick={() => setAuthPage('saved')}>My Saved Test Cases</button>
        <button className="btn" onClick={() => setAuthPage('logout')}>Logout</button>
      </nav>
      <Dashboard api={api} repoInfo={repoInfo} setRepoInfo={fetchFiles} files={files} setFiles={setFiles} />
      <footer className="text-center py-4 text-gray-500 dark:text-gray-400 border-t bg-white dark:bg-gray-800 mt-auto">
        Built with <span role="img" aria-label="brain">🧠</span> by Arjunbir Singh
      </footer>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}
