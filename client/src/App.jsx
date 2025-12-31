
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
  // FIX: Default to 'dashboard' instead of 'login' for logged-in users
  const [currentPage, setCurrentPage] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.health().then(() => setHealthOk(true)).catch(() => setHealthOk(false));
    // Try to fetch user profile on load
    fetch('/api/auth/profile', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
          setCurrentPage('dashboard'); // Go to dashboard if already logged in
        }
      })
      .catch(() => { });
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
      setCodeMeta({ framework: res.framework, filePath: res.filePath, summary: res.summary, suggestedName: `${filePath.replace(/\//g, '_')}.${ext}` })
    } catch (e) {
      alert(e.message || 'Failed to generate code')
    } finally {
      setBusy(false)
    }
  }

  const handleLogin = (u) => {
    setUser(u);
    setCurrentPage('dashboard'); // FIX: Go to dashboard, not profile
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setRepoInfo(null);
    setFiles([]);
    localStorage.removeItem('repoInfo');
  };

  // Auth pages (not logged in)
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-burgundy-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-burgundy-700/10 rounded-full blur-3xl" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md animate-slide-up">
            {currentPage === 'signup' ? (
              <>
                <Signup onSignup={handleLogin} />
                <div className="mt-6 text-center">
                  <span className="text-dark-muted">Already have an account? </span>
                  <button
                    className="link font-medium"
                    onClick={() => setCurrentPage('login')}
                  >
                    Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <Login onLogin={handleLogin} />
                <div className="mt-6 text-center">
                  <span className="text-dark-muted">Don't have an account? </span>
                  <button
                    className="link font-medium"
                    onClick={() => setCurrentPage('signup')}
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Logout handling
  if (currentPage === 'logout') {
    return <Logout onLogout={handleLogout} />;
  }

  // Profile page
  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header
          user={user}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="container-app py-6 animate-fade-in">
          <Profile user={user} onLogout={() => setCurrentPage('logout')} onBack={() => setCurrentPage('dashboard')} />
        </main>
      </div>
    );
  }

  // Saved test cases page
  if (currentPage === 'saved') {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header
          user={user}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="container-app py-6 animate-fade-in">
          <SavedTestCases user={user} onBack={() => setCurrentPage('dashboard')} />
        </main>
      </div>
    );
  }

  // Main dashboard (default for logged-in users)
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="flex-1 overflow-hidden">
        <Dashboard
          api={api}
          repoInfo={repoInfo}
          setRepoInfo={fetchFiles}
          files={files}
          setFiles={setFiles}
        />
      </main>

      <footer className="border-t border-dark-border bg-dark-surface py-4 mt-auto">
        <div className="container-app text-center text-sm text-dark-muted">
          Built with <span className="text-burgundy-400">♥</span> by Arjunbir Singh
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        theme="dark"
        toastClassName="!bg-dark-surface !border !border-dark-border !rounded-xl"
      />
    </div>
  );
}
