import { HiOutlineHome, HiOutlineFolder, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { RiSparklingLine } from 'react-icons/ri';

export default function Header({ user, currentPage, onNavigate, mobileMenuOpen, setMobileMenuOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiOutlineHome },
    { id: 'saved', label: 'Saved Tests', icon: HiOutlineFolder },
    { id: 'profile', label: 'Profile', icon: HiOutlineUser },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center group-hover:shadow-glow transition-shadow">
              <RiSparklingLine className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white hidden sm:block">TestGen</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <div className="w-px h-5 bg-slate-800 mx-2" />
            <button
              onClick={() => onNavigate('logout')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-error-400 hover:bg-slate-800/50 transition-colors"
            >
              <HiOutlineLogout className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden btn-icon"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/50 animate-fade-in">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${currentPage === item.id
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <div className="divider my-3" />
              <button
                onClick={() => {
                  onNavigate('logout');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-slate-400 hover:text-error-400 hover:bg-slate-800/50 transition-colors"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>

            {user && (
              <div className="mt-4 pt-4 border-t border-slate-800/50 px-4">
                <p className="text-sm text-slate-500">
                  Signed in as <span className="text-slate-300">{user.email}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
