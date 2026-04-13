import ReactMarkdown from 'react-markdown';

export default function RepoSummary({
  isOpen,
  onClose,
  summary,
  loading,
  error,
  onSummarize,
  deadCodeAnalysis,
  loadingDeadCode,
  onDetectDeadCode,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            AI Repository Analysis
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Summary section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300">📋 Architecture Overview</h3>
              {!summary && (
                <button
                  onClick={onSummarize}
                  disabled={loading}
                  className="glass-button px-4 py-2 text-xs"
                >
                  {loading ? 'Generating...' : '✨ Generate Summary'}
                </button>
              )}
            </div>

            {loading && (
              <div className="flex flex-col items-center py-8">
                <div className="loading-dots mb-3">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className="text-xs text-gray-500">Claude is analyzing the repository architecture...</p>
              </div>
            )}

            {summary && (
              <div className="bg-dark-900/50 rounded-xl p-5 border border-accent-purple/10 markdown-content">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Dead code section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300">🔴 Dead Code Detection</h3>
              {!deadCodeAnalysis && (
                <button
                  onClick={onDetectDeadCode}
                  disabled={loadingDeadCode}
                  className="px-4 py-2 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 font-medium disabled:opacity-50"
                >
                  {loadingDeadCode ? 'Analyzing...' : '🔍 Detect Dead Code'}
                </button>
              )}
            </div>

            {loadingDeadCode && (
              <div className="flex flex-col items-center py-8">
                <div className="loading-dots mb-3">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className="text-xs text-gray-500">Checking for orphaned and dead code files...</p>
              </div>
            )}

            {deadCodeAnalysis && (
              <div className="bg-dark-900/50 rounded-xl p-5 border border-red-500/10 markdown-content">
                <ReactMarkdown>{deadCodeAnalysis}</ReactMarkdown>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
