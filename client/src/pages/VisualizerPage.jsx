import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGraph } from '../hooks/useGraph';
import { useAI } from '../hooks/useAI';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import Toast from '../components/UI/Toast';
import SearchBar from '../components/UI/SearchBar';
import ForceGraph2DComponent from '../components/Graph/ForceGraph2D';
import ForceGraph3DComponent from '../components/Graph/ForceGraph3D';
import GraphControls from '../components/Graph/GraphControls';
import FileDetails from '../components/Sidebar/FileDetails';
import AIAnalysis from '../components/Sidebar/AIAnalysis';
import RepoSummary from '../components/Sidebar/RepoSummary';

export default function VisualizerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const repoUrl = searchParams.get('repo');

  const {
    graphData,
    rawGraphData,
    repoInfo,
    stats,
    orphanedFiles,
    loading: graphLoading,
    error: graphError,
    selectedNode,
    highlightNodes,
    highlightLinks,
    filterTypes,
    showOrphans,
    analyze,
    handleNodeClick,
    clearSelection,
    toggleFilter,
    setShowOrphans,
  } = useGraph();

  const {
    explanation,
    summary,
    deadCodeAnalysis,
    loadingExplain,
    loadingSummary,
    loadingDeadCode,
    aiError,
    explain,
    summarize,
    detectDeadCode,
    clearAI,
  } = useAI();

  const [mode, setMode] = useState('2d');
  const [showSummary, setShowSummary] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initial load
  useEffect(() => {
    if (repoUrl) {
      analyze(repoUrl);
      clearAI();
    }
  }, [repoUrl, analyze, clearAI]);

  // When node is selected, clear previous AI explanation
  useEffect(() => {
    if (selectedNode) {
      clearAI();
      setSidebarOpen(true);
    }
  }, [selectedNode, clearAI]);

  const handleAnalyzeNew = (url) => {
    navigate(`/visualize?repo=${encodeURIComponent(url)}`);
  };

  const handleExplain = () => {
    if (selectedNode && repoInfo) {
      explain(selectedNode, repoInfo.owner, repoInfo.repo);
    }
  };

  const handleSummarize = () => {
    if (repoInfo && rawGraphData) {
      summarize(repoInfo.owner, repoInfo.repo, rawGraphData.nodes, rawGraphData.links);
    }
  };

  const handleDetectDeadCode = () => {
    if (repoInfo && orphanedFiles.length > 0) {
      // Map orphaned IDs back to full node objects for better context
      const orphanNodes = rawGraphData.nodes.filter(n => orphanedFiles.includes(n.id));
      detectDeadCode(orphanNodes, repoInfo.owner, repoInfo.repo);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] mt-16 flex overflow-hidden bg-dark-800">
      {/* Search Header Output (if error or empty) */}
      {!graphData && !graphLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-2xl mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Analyze a new repository</h2>
            <SearchBar onAnalyze={handleAnalyzeNew} loading={graphLoading} />
          </div>
          {graphError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 max-w-2xl text-center">
              {graphError}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {graphLoading && (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="Parsing repository structure and dependencies..." />
        </div>
      )}

      {/* Graph Area */}
      {graphData && !graphLoading && (
        <div className="flex-1 relative cursor-crosshair">
          {/* Controls */}
          <GraphControls
            mode={mode}
            onModeChange={setMode}
            filterTypes={filterTypes}
            onToggleFilter={toggleFilter}
            nodes={rawGraphData?.nodes}
            showOrphans={showOrphans}
            onToggleOrphans={() => setShowOrphans(!showOrphans)}
            stats={stats}
          />

          {/* Repo action buttons */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={() => setShowSummary(true)}
              className="glass-button px-4 py-2 text-sm flex items-center gap-2"
            >
              ✨ Summarize Repo
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="glass rounded-xl p-2 text-gray-400 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="15" y1="3" x2="15" y2="21"/>
              </svg>
            </button>
          </div>

          {/* Render Graph */}
          {mode === '2d' ? (
            <ForceGraph2DComponent
              data={graphData}
              onNodeClick={handleNodeClick}
              highlightNodes={highlightNodes}
              highlightLinks={highlightLinks}
              orphanedFiles={showOrphans ? orphanedFiles : []}
            />
          ) : (
            <ForceGraph3DComponent
              data={graphData}
              onNodeClick={handleNodeClick}
              highlightNodes={highlightNodes}
              highlightLinks={highlightLinks}
              orphanedFiles={showOrphans ? orphanedFiles : []}
            />
          )}

          {/* Selected node name overlay at bottom */}
          {selectedNode && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full pointer-events-none z-10 animate-slide-up">
              <span className="font-mono text-sm text-white">{selectedNode.path}</span>
            </div>
          )}
        </div>
      )}

      {/* Sidebar for File Details & AI */}
      {graphData && sidebarOpen && (
        <div className="w-96 border-l border-white/5 bg-dark-900/80 backdrop-blur-xl h-full overflow-y-auto z-30 transition-all">
          <div className="p-5">
            {selectedNode ? (
              <>
                <FileDetails node={selectedNode} onClose={clearSelection} />
                <div className="my-6 border-t border-white/5"></div>
                <AIAnalysis
                  explanation={explanation}
                  loading={loadingExplain}
                  error={aiError}
                  onAnalyze={handleExplain}
                  hasNode={true}
                />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-20">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <p>Select a node on the graph to view file details and AI analysis.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Repo Summary Modal */}
      <RepoSummary
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        summary={summary}
        loading={loadingSummary}
        deadCodeAnalysis={deadCodeAnalysis}
        loadingDeadCode={loadingDeadCode}
        error={aiError}
        onSummarize={handleSummarize}
        onDetectDeadCode={handleDetectDeadCode}
      />

      {/* Toasts */}
      {aiError && !showSummary && !selectedNode && (
        <Toast
          message={aiError}
          type="error"
          onClose={() => clearAI()}
        />
      )}
    </div>
  );
}
