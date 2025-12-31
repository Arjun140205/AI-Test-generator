import { useState } from 'react';

export default function Header({ user, currentPage, onNavigate, mobileMenuOpen, setMobileMenuOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'saved', label: 'Saved Tests', icon: '💾' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-surface/95 backdrop-blur-md border-b border-dark-border">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-burgundy flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zm13 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zm-3 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-dark-text leading-tight">
                Workik TestGen
              </h1>
              <p className="text-xs text-dark-muted">AI-powered test generation</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === item.id
                    ? 'bg-burgundy-500/20 text-burgundy-300'
                    : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated'
                  }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div className="w-px h-6 bg-dark-border mx-2" />
            <button
              onClick={() => onNavigate('logout')}
              className="btn-ghost text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden btn-icon"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-border animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${currentPage === item.id
                      ? 'bg-burgundy-500/20 text-burgundy-300'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <div className="h-px bg-dark-border my-2" />
              <button
                onClick={() => {
                  onNavigate('logout');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-left text-dark-muted hover:text-red-400 hover:bg-dark-elevated transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </nav>

            {/* User info */}
            {user && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <div className="px-4 text-sm text-dark-muted">
                  Signed in as <span className="text-dark-text font-medium">{user.email}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
