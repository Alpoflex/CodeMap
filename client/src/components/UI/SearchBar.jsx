import { useState } from 'react';

export default function SearchBar({ onAnalyze, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !loading) {
      onAnalyze(url.trim());
    }
  };

  const placeholderRepos = [
    'https://github.com/facebook/react',
    'https://github.com/expressjs/express',
    'https://github.com/vercel/next.js',
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan rounded-2xl opacity-20 group-hover:opacity-30 blur-lg transition-opacity" />

        <div className="relative flex items-center glass-input rounded-2xl overflow-hidden">
          {/* GitHub icon */}
          <div className="pl-5 pr-2 text-gray-500">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>

          {/* Input */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a GitHub repo URL..."
            className="flex-1 bg-transparent py-4 px-2 text-white placeholder-gray-500 focus:outline-none text-base"
            disabled={loading}
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={!url.trim() || loading}
            className="glass-button px-6 py-3 mr-2 text-sm font-semibold flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick examples */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        <span className="text-xs text-gray-500">Try:</span>
        {placeholderRepos.map((repo) => (
          <button
            key={repo}
            type="button"
            onClick={() => setUrl(repo)}
            className="text-xs text-gray-400 hover:text-accent-blue transition-colors px-2 py-1 rounded-md hover:bg-white/5"
          >
            {repo.replace('https://github.com/', '')}
          </button>
        ))}
      </div>
    </form>
  );
}
