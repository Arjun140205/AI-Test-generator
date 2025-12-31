import { useEffect } from 'react';

export default function Logout({ onLogout }) {
  useEffect(() => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      .finally(() => onLogout());
  }, [onLogout]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-12 h-12 mx-auto mb-4 border-2 border-slate-700 border-t-accent-500 rounded-full animate-spin" />
        <p className="text-slate-400">Signing out...</p>
      </div>
    </div>
  );
}
