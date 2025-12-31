import { useMemo, useState } from 'react';

export default function FileList({ files, onSelect, selected }) {
  const [search, setSearch] = useState('');

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;
    const query = search.toLowerCase();
    return files.filter(f => f.path.toLowerCase().includes(query));
  }, [files, search]);

  const getFileIcon = (path) => {
    const ext = path.split('.').pop()?.toLowerCase();
    const icons = {
      js: { icon: 'JS', color: 'text-yellow-400' },
      jsx: { icon: '⚛', color: 'text-cyan-400' },
      ts: { icon: 'TS', color: 'text-blue-400' },
      tsx: { icon: '⚛', color: 'text-blue-400' },
      py: { icon: '🐍', color: 'text-green-400' },
      java: { icon: '☕', color: 'text-orange-400' },
      go: { icon: 'Go', color: 'text-cyan-300' },
      rb: { icon: '💎', color: 'text-red-400' },
      php: { icon: 'PHP', color: 'text-purple-400' },
      css: { icon: '🎨', color: 'text-pink-400' },
      json: { icon: '{ }', color: 'text-yellow-300' },
    };
    return icons[ext] || { icon: '📄', color: 'text-dark-muted' };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-dark-border">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* File Count */}
      <div className="px-4 py-2 text-xs text-dark-muted border-b border-dark-border bg-dark-elevated/30">
        {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <svg className="w-12 h-12 text-dark-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-dark-muted text-sm">No files found</p>
          </div>
        ) : (
          <ul className="py-2">
            {filteredFiles.map((f) => {
              const { icon, color } = getFileIcon(f.path);
              const isSelected = selected === f.path;
              const fileName = f.path.split('/').pop();
              const dirPath = f.path.split('/').slice(0, -1).join('/');

              return (
                <li key={f.path}>
                  <button
                    onClick={() => onSelect(f.path)}
                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-all duration-150 ${isSelected
                        ? 'bg-burgundy-500/20 border-l-2 border-burgundy-500'
                        : 'hover:bg-dark-elevated border-l-2 border-transparent'
                      }`}
                  >
                    <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${color}`}>
                      {icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={`font-medium text-sm truncate ${isSelected ? 'text-burgundy-300' : 'text-dark-text'}`}>
                        {fileName}
                      </div>
                      {dirPath && (
                        <div className="text-xs text-dark-muted truncate">
                          {dirPath}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
