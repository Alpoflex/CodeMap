import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20 group-hover:shadow-accent-blue/40 transition-all">
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="22" r="5" fill="#fff" opacity="0.9"/>
                <circle cx="44" cy="18" r="4" fill="#fff" opacity="0.7"/>
                <circle cx="32" cy="40" r="6" fill="#fff" opacity="0.9"/>
                <line x1="20" y1="22" x2="44" y2="18" stroke="#fff" strokeWidth="2" opacity="0.5"/>
                <line x1="20" y1="22" x2="32" y2="40" stroke="#fff" strokeWidth="2" opacity="0.5"/>
                <line x1="44" y1="18" x2="32" y2="40" stroke="#fff" strokeWidth="2" opacity="0.5"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Code<span className="gradient-text">Map</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {!isHome && (
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
            )}

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
