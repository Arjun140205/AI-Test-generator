import { HiOutlineArrowLeft, HiOutlineLogout, HiOutlineMail, HiOutlineIdentification } from 'react-icons/hi';

export default function Profile({ user, onLogout, onBack }) {
  return (
    <div className="max-w-md mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      )}

      <div className="card p-6 sm:p-8 animate-scale-up">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-glow">
            <span className="text-2xl font-bold text-white">
              {user.email?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white mb-1">Your Profile</h1>
          <p className="text-slate-400 text-sm">Manage your account</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
            <HiOutlineMail className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
              <p className="text-slate-200 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
            <HiOutlineIdentification className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Account ID</p>
              <p className="text-slate-200 font-mono text-sm truncate">{user.id || user._id || 'N/A'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn-secondary w-full py-3 text-error-400 border-error-500/20 hover:bg-error-500/10 hover:border-error-500/30"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
