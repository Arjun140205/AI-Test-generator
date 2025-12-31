import React from 'react';

export default function Logout({ onLogout }) {
  React.useEffect(() => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      .then(() => onLogout())
      .catch(() => onLogout());
  }, [onLogout]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-burgundy-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-burgundy-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h2 className="text-xl font-heading font-semibold text-dark-text mb-2">
          Signing out...
        </h2>
        <p className="text-dark-muted">
          See you next time!
        </p>
      </div>
    </div>
  );
}
