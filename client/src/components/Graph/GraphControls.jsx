import { FILE_TYPE_COLORS, CATEGORY_LABELS } from '../../utils/colors';

export default function GraphControls({
  mode,
  onModeChange,
  filterTypes,
  onToggleFilter,
  nodes,
  showOrphans,
  onToggleOrphans,
  stats,
}) {
  // Get unique categories from nodes
  const categories = [...new Set((nodes || []).map(n => n.type))].sort();

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
      {/* Mode toggle */}
      <div className="glass rounded-xl p-1 flex gap-1">
        <button
          onClick={() => onModeChange('2d')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === '2d'
              ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          2D
        </button>
        <button
          onClick={() => onModeChange('3d')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === '3d'
              ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          3D
        </button>
      </div>

      {/* Filter by type */}
      {categories.length > 0 && (
        <div className="glass rounded-xl p-3 max-w-[200px]">
          <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Filter by Type</p>
          <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
            {categories.map(cat => {
              const active = filterTypes.size === 0 || filterTypes.has(cat);
              const color = FILE_TYPE_COLORS[cat] || '#9ca3af';
              const count = (nodes || []).filter(n => n.type === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => onToggleFilter(cat)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all ${
                    active
                      ? 'text-gray-200 bg-white/5'
                      : 'text-gray-500 opacity-50'
                  } hover:bg-white/10`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-1 truncate">{CATEGORY_LABELS[cat] || cat}</span>
                  <span className="text-gray-500 text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Orphan toggle */}
      <button
        onClick={onToggleOrphans}
        className={`glass rounded-xl px-3 py-2 text-xs font-medium transition-all text-left ${
          showOrphans
            ? 'border-red-500/30 text-red-400'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        🔴 Orphaned Files
        {stats?.orphans > 0 && (
          <span className="ml-1 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
            {stats.orphans}
          </span>
        )}
      </button>

      {/* Stats */}
      {stats && (
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Stats</p>
          <div className="space-y-1">
            {[
              { label: 'Files', value: stats.nodes },
              { label: 'Dependencies', value: stats.edges },
              { label: 'Analyzed', value: stats.fetchedFiles },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-xs">
                <span className="text-gray-500">{s.label}</span>
                <span className="text-gray-300 font-mono">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
