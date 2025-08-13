import { useEffect, useState } from 'react'
import Header from './components/Header'
import RepoConnect from './components/RepoConnect'
import FileList from './components/FileList'
import SummaryList from './components/SummaryList'
import CodeViewer from './components/CodeViewer'
import { api } from './lib/fetcher'

export default function App() {
  const [healthOk, setHealthOk] = useState(false)
  const [repoInfo, setRepoInfo] = useState(null) // {owner, repo, ref}
  const [files, setFiles] = useState([])
  const [summaries, setSummaries] = useState({ files: [] })
  const [code, setCode] = useState('')
  const [codeMeta, setCodeMeta] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.health().then(()=>setHealthOk(true)).catch(()=>setHealthOk(false))
  }, [])

  const fetchFiles = async ({ owner, repo, ref }) => {
    const data = await api.getTree(owner, repo, ref)
    setRepoInfo({ owner, repo, ref: ref || 'main' })
    setFiles(data.files)
    setSummaries({ files: [] })
    setCode('')
  }

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

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6">
          {!healthOk && <div className="text-red-400 text-sm">Backend not reachable. Start server on port 8080.</div>}
        </div>

        <div className="grid gap-6">
          <RepoConnect onConnect={fetchFiles} />

          {files.length > 0 && (
            <FileList files={files} onGenerateSummaries={handleGenerateSummaries} />
          )}

          {busy && <div className="card p-5 text-slate-300">Working…</div>}

          {summaries.files.length > 0 && (
            <SummaryList data={summaries} onGenerateCode={handleGenerateCode} />
          )}

          {code && <CodeViewer code={code} meta={codeMeta} />}
        </div>
      </main>
    </div>
  )
}
