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
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.health().then(() => setHealthOk(true)).catch(() => setHealthOk(false));
    fetch('/api/auth/profile', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          setCurrentPage('dashboard');
        }
      })
      .catch(() => { });
  }, []);

  const fetchFiles = async ({ owner, repo, ref }) => {
    const data = await api.getTree(owner, repo, ref);
    const info = { owner, repo, ref: ref || 'main' };
    setRepoInfo(info);
    setFiles(data.files);
    localStorage.setItem('repoInfo', JSON.stringify(info));
  };

  const handleLogin = (u) => {
    setUser(u);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setRepoInfo(null);
    setFiles([]);
    localStorage.removeItem('repoInfo');
  };

  // Auth screens
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Gradient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
          <div className="w-full max-w-sm animate-fade-up">
            {currentPage === 'signup' ? (
              <Signup
                onSignup={handleLogin}
                onSwitch={() => setCurrentPage('login')}
              />
            ) : (
              <Login
                onLogin={handleLogin}
                onSwitch={() => setCurrentPage('signup')}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'logout') {
    return <Logout onLogout={handleLogout} />;
  }

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header
          user={user}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex-1 container-page py-6 sm:py-8 animate-fade-in">
          <Profile user={user} onLogout={() => setCurrentPage('logout')} onBack={() => setCurrentPage('dashboard')} />
        </main>
      </div>
    );
  }

  if (currentPage === 'saved') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header
          user={user}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex-1 container-page py-6 sm:py-8 animate-fade-in">
          <SavedTestCases user={user} onBack={() => setCurrentPage('dashboard')} />
        </main>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="flex-1">
        <Dashboard
          api={api}
          repoInfo={repoInfo}
          setRepoInfo={fetchFiles}
          files={files}
          setFiles={setFiles}
        />
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}
