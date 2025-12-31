import { useMemo, useState } from 'react';
import { HiOutlineSearch, HiOutlineDocument, HiOutlineCode } from 'react-icons/hi';
import { SiJavascript, SiTypescript, SiPython, SiReact } from 'react-icons/si';
import { VscJson } from 'react-icons/vsc';

export default function FileList({ files, onSelect, selected }) {
  const [search, setSearch] = useState('');

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;
    const q = search.toLowerCase();
    return files.filter(f => f.path.toLowerCase().includes(q));
  }, [files, search]);

  const getFileIcon = (path) => {
    const ext = path.split('.').pop()?.toLowerCase();
    const icons = {
      js: { Icon: SiJavascript, color: 'text-yellow-400' },
      jsx: { Icon: SiReact, color: 'text-cyan-400' },
      ts: { Icon: SiTypescript, color: 'text-blue-400' },
      tsx: { Icon: SiReact, color: 'text-blue-400' },
      py: { Icon: SiPython, color: 'text-green-400' },
      json: { Icon: VscJson, color: 'text-yellow-300' },
    };
    return icons[ext] || { Icon: HiOutlineDocument, color: 'text-slate-400' };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Count */}
      <div className="px-4 py-2 text-xs text-slate-500">
        {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto scrollbar-none">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <HiOutlineCode className="w-10 h-10 text-slate-600 mb-3" />
            <p className="text-slate-500 text-sm">No files found</p>
          </div>
        ) : (
          <div className="py-1">
            {filteredFiles.map((f) => {
              const { Icon, color } = getFileIcon(f.path);
              const isSelected = selected === f.path;
              const fileName = f.path.split('/').pop();
              const dirPath = f.path.split('/').slice(0, -1).join('/');

              return (
                <button
                  key={f.path}
                  onClick={() => onSelect(f.path)}
                  className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-all ${isSelected
                      ? 'bg-accent-500/10 border-l-2 border-accent-500'
                      : 'hover:bg-slate-900 border-l-2 border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium truncate ${isSelected ? 'text-accent-400' : 'text-slate-200'}`}>
                      {fileName}
                    </div>
                    {dirPath && (
                      <div className="text-xs text-slate-500 truncate">{dirPath}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
