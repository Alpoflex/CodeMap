import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

/**
 * Demo graph for the landing page — shows a sample repository visualization
 */

// Generate demo data that looks like a real repo
function generateDemoData() {
  const types = [
    { type: 'javascript', color: '#f7df1e', count: 8 },
    { type: 'typescript', color: '#3178c6', count: 6 },
    { type: 'style', color: '#264de4', count: 3 },
    { type: 'config', color: '#6b7280', count: 4 },
    { type: 'python', color: '#3776ab', count: 3 },
    { type: 'docs', color: '#8b5cf6', count: 2 },
    { type: 'test', color: '#22c55e', count: 3 },
    { type: 'html', color: '#e34c26', count: 2 },
  ];

  const nodes = [];
  const links = [];
  let id = 0;

  const fileNames = [
    'index.js', 'App.jsx', 'Router.jsx', 'api.js', 'utils.js',
    'auth.ts', 'database.ts', 'middleware.ts', 'types.ts', 'config.ts',
    'server.js', 'routes.js', 'controllers.js',
    'styles.css', 'theme.scss', 'globals.css',
    'package.json', 'tsconfig.json', 'vite.config.js', '.eslintrc',
    'main.py', 'models.py', 'views.py',
    'README.md', 'CHANGELOG.md',
    'App.test.js', 'api.test.js', 'utils.test.ts',
    'index.html', 'template.html',
  ];

  types.forEach(({ type, color, count }) => {
    for (let i = 0; i < count; i++) {
      const name = fileNames[id] || `file_${id}`;
      nodes.push({
        id: id.toString(),
        name,
        type,
        color,
        val: Math.random() * 8 + 2,
        lines: Math.floor(Math.random() * 300 + 20),
      });
      id++;
    }
  });

  // Create realistic dependency connections
  const connectionPairs = [
    [0, 1], [1, 2], [1, 3], [3, 4], [0, 4], // JS core
    [5, 6], [5, 7], [6, 8], [7, 8], [5, 9], // TS core
    [10, 11], [11, 12], [10, 7], // Server
    [1, 13], [0, 14], [1, 15], // Styles
    [0, 16], [5, 17], [0, 18], // Config
    [20, 21], [21, 22], // Python
    [1, 25], [3, 26], // Tests
    [0, 27], // HTML
    [3, 10], [4, 6], [12, 6], // Cross connections
    [2, 3], [8, 9], [18, 0],
  ];

  connectionPairs.forEach(([source, target]) => {
    if (source < nodes.length && target < nodes.length) {
      links.push({
        source: source.toString(),
        target: target.toString(),
      });
    }
  });

  return { nodes, links };
}

export default function DemoGraph() {
  const graphRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const data = useMemo(() => generateDemoData(), []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.min(rect.width * 0.6, 500) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-rotate / zoom
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-120);
      graphRef.current.d3Force('link').distance(60);

      // Zoom to fit after a moment
      setTimeout(() => {
        graphRef.current?.zoomToFit(1000, 60);
      }, 500);
    }
  }, [data]);

  const paintNode = useCallback((node, ctx) => {
    const size = node.val || 3;

    // Glow
    ctx.shadowColor = node.color;
    ctx.shadowBlur = 12;

    // Node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }, []);

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Live Demo
          </h2>
          <p className="text-gray-400 text-sm">
            Interactive force-directed graph — drag nodes, zoom in and out
          </p>
        </div>

        <div
          ref={containerRef}
          className="glass-card overflow-hidden p-1"
          style={{ minHeight: '400px' }}
        >
          <div className="rounded-xl overflow-hidden bg-dark-900/50">
            <ForceGraph2D
              ref={graphRef}
              graphData={data}
              width={dimensions.width - 10}
              height={dimensions.height}
              backgroundColor="rgba(10, 10, 26, 0)"
              nodeCanvasObject={paintNode}
              nodePointerAreaPaint={(node, color, ctx) => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.val + 2, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
              }}
              linkColor={() => 'rgba(99, 102, 241, 0.15)'}
              linkWidth={1}
              linkDirectionalParticles={1}
              linkDirectionalParticleWidth={2}
              linkDirectionalParticleColor={() => 'rgba(99, 102, 241, 0.4)'}
              linkDirectionalParticleSpeed={0.005}
              enableNodeDrag={true}
              enableZoomInteraction={true}
              enablePanInteraction={true}
              cooldownTime={3000}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-3 px-4">
            {[
              { color: '#f7df1e', label: 'JavaScript' },
              { color: '#3178c6', label: 'TypeScript' },
              { color: '#264de4', label: 'CSS' },
              { color: '#3776ab', label: 'Python' },
              { color: '#6b7280', label: 'Config' },
              { color: '#22c55e', label: 'Test' },
              { color: '#8b5cf6', label: 'Docs' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
