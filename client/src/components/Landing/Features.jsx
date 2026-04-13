const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="3"/>
        <circle cx="16" cy="16" r="3"/>
        <circle cx="18" cy="6" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <line x1="10.5" y1="9.5" x2="14" y2="14"/>
        <line x1="9.5" y1="6.5" x2="16" y2="6"/>
        <line x1="7" y1="10.5" x2="6" y2="16"/>
      </svg>
    ),
    title: 'Interactive Graph',
    description: 'Explore your codebase as a beautiful 2D/3D force-directed graph. Zoom, pan, drag nodes — full interactivity.',
    gradient: 'from-accent-blue to-accent-cyan',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'AI-Powered Insights',
    description: 'Claude AI explains what each file does, suggests improvements, and generates architecture overviews.',
    gradient: 'from-accent-purple to-accent-pink',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
    title: 'Dependency Analysis',
    description: 'Automatically parse imports and dependencies across 10+ languages. Detect orphaned files and dead code.',
    gradient: 'from-accent-green to-accent-cyan',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: '2D & 3D Modes',
    description: 'Switch between D3.js 2D canvas and Three.js 3D WebGL. Each mode offers unique navigation and aesthetics.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Code Health Metrics',
    description: 'Node sizes reflect complexity (LOC). Colors map to file types. Instantly spot hotspots and bottlenecks.',
    gradient: 'from-red-400 to-accent-pink',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Open Source',
    description: 'MIT licensed, fully open source. Fork it, customize it, contribute back. Built for the community.',
    gradient: 'from-accent-cyan to-accent-blue',
  },
];

export default function Features() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to <span className="gradient-text">Understand Code</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Powerful features designed to make codebase exploration effortless and insightful.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <div className="text-white">{feature.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
