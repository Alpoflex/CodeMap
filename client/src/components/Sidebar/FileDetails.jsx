import { FILE_TYPE_COLORS, CATEGORY_LABELS } from '../../utils/colors';

export default function FileDetails({ node, onClose }) {
  if (!node) return null;

  const color = FILE_TYPE_COLORS[node.type] || '#9ca3af';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}40` }}
          />
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{node.name}</h3>
            <p className="text-gray-500 text-xs truncate">{node.path}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Type', value: CATEGORY_LABELS[node.type] || node.type },
          { label: 'Lines', value: node.lines || 0 },
          { label: 'Imports', value: node.outDegree || 0 },
          { label: 'Imported by', value: node.inDegree || 0 },
        ].map(item => (
          <div key={item.label} className="bg-dark-900/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
            <p className="text-sm text-white font-medium mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {node.isOrphan && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            🔴 Orphaned
          </span>
        )}
        {node.lines > 300 && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            ⚠️ Large File
          </span>
        )}
        {node.inDegree > 5 && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            🔗 High Import
          </span>
        )}
      </div>

      {/* Directory */}
      <div className="text-xs text-gray-500">
        <span className="text-gray-600">Directory: </span>
        <span className="font-mono text-gray-400">{node.directory}</span>
      </div>
    </div>
  );
}
