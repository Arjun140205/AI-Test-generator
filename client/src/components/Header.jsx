import GithubIcon from '../icons/GithubIcon'
import SparklesIcon from '../icons/SparklesIcon'

export default function Header() {
  return (
    <header className="py-6">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 grid place-items-center shadow-soft">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Workik Test Case Generator</h1>
            <p className="text-sm text-slate-300/80">AI-powered summaries → one-click test code</p>
          </div>
        </div>
        <a href="https://github.com" target="_blank" className="text-slate-300 hover:text-white flex items-center gap-2">
          <GithubIcon />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  )
}
