import ReactMarkdown from 'react-markdown';

export default function AIAnalysis({ explanation, loading, error, onAnalyze, hasNode }) {
  return (
    <div className="mt-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          AI Analysis
        </h4>
        {hasNode && (
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="text-[10px] px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 text-accent-purple hover:from-accent-purple/30 hover:to-accent-pink/30 transition-all border border-accent-purple/20 font-medium disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : '✨ Explain with AI'}
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
          <p className="text-xs text-gray-500">Claude is analyzing this file...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {explanation && (
        <div className="bg-dark-900/50 rounded-xl p-4 border border-accent-purple/10 markdown-content">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>
      )}

      {!loading && !explanation && !error && (
        <div className="text-center py-6">
          <p className="text-xs text-gray-500">
            {hasNode
              ? 'Click "Explain with AI" to get Claude\'s analysis of this file.'
              : 'Select a node from the graph to analyze with AI.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
