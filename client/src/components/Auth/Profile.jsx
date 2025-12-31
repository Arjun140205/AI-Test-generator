import React from 'react';

export default function Profile({ user, onLogout, onBack }) {
  return (
    <div className="max-w-md mx-auto">
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

      <div className="card p-8 animate-scale-in">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-burgundy flex items-center justify-center shadow-glow-md">
            <span className="text-3xl font-heading font-bold text-white">
              {user.email?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-heading font-bold text-dark-text mb-2">
            Your Profile
          </h2>
          <p className="text-dark-muted">
            Manage your account settings
          </p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <label className="block text-xs font-medium text-dark-muted uppercase tracking-wide mb-1">
              Email Address
            </label>
            <div className="text-dark-text font-medium">
              {user.email}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <label className="block text-xs font-medium text-dark-muted uppercase tracking-wide mb-1">
              Account ID
            </label>
            <div className="text-dark-text font-mono text-sm">
              {user.id || user._id || 'N/A'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="btn-secondary w-full py-3 text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
