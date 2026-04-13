import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Hero() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/visualize?repo=${encodeURIComponent(url.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-blue/20 mb-8 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-sm text-gray-300">Open Source Codebase Visualizer</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">See Your Code</span>
          <br />
          <span className="gradient-text">Like Never Before</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Visualize any GitHub repository as an interactive force-directed graph.
          AI-powered insights help you understand architecture at a glance.
        </p>

        {/* Search bar */}
        <form onSubmit={handleAnalyze} className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-all duration-500" />

            <div className="relative flex items-center glass-input rounded-2xl overflow-hidden">
              <div className="pl-5 pr-2 text-gray-500">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a GitHub repo URL to visualize..."
                className="flex-1 bg-transparent py-4 px-2 text-white placeholder-gray-500 focus:outline-none text-base"
              />
              <button
                type="submit"
                disabled={!url.trim()}
                className="glass-button px-8 py-3 mr-2 text-sm font-semibold flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Visualize
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-gray-500">Try:</span>
            {[
              'facebook/react',
              'expressjs/express',
              'tailwindlabs/tailwindcss',
            ].map((repo) => (
              <button
                key={repo}
                type="button"
                onClick={() => setUrl(`https://github.com/${repo}`)}
                className="text-xs text-gray-400 hover:text-accent-blue transition-colors px-2 py-1 rounded-md hover:bg-white/5"
              >
                {repo}
              </button>
            ))}
          </div>
        </form>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {[
            { value: '2D/3D', label: 'Visualization Modes' },
            { value: 'AI', label: 'Powered Analysis' },
            { value: '10+', label: 'Languages Supported' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
}
