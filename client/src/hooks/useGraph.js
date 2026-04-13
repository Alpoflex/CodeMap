import { useState, useCallback } from 'react';
import { analyzeRepo } from '../utils/api';

/**
 * Custom hook for graph state management
 */
export function useGraph() {
  const [graphData, setGraphData] = useState(null);
  const [repoInfo, setRepoInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [orphanedFiles, setOrphanedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [filterTypes, setFilterTypes] = useState(new Set());
  const [showOrphans, setShowOrphans] = useState(false);

  const analyze = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    setSelectedNode(null);
    setGraphData(null);

    try {
      const data = await analyzeRepo(url);

      setRepoInfo({ owner: data.owner, repo: data.repo });
      setStats(data.stats);
      setOrphanedFiles(data.orphanedFiles || []);

      // Transform for react-force-graph
      const nodes = data.graph.nodes.map(node => ({
        ...node,
        val: Math.max(Math.sqrt(node.lines || 1) * 2, 3), // Node size based on LOC
      }));

      const links = data.graph.edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        importPath: edge.importPath,
      }));

      setGraphData({ nodes, links });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);

    // Highlight connected nodes
    const connectedNodes = new Set();
    const connectedLinks = new Set();

    if (graphData) {
      graphData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        if (sourceId === node.id || targetId === node.id) {
          connectedNodes.add(sourceId);
          connectedNodes.add(targetId);
          connectedLinks.add(link);
        }
      });
    }

    connectedNodes.add(node.id);
    setHighlightNodes(connectedNodes);
    setHighlightLinks(connectedLinks);
  }, [graphData]);

  const clearSelection = useCallback(() => {
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  const toggleFilter = useCallback((type) => {
    setFilterTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  // Filter graph data
  const filteredGraphData = graphData ? {
    nodes: graphData.nodes.filter(node => {
      if (filterTypes.size > 0 && !filterTypes.has(node.type)) return false;
      if (showOrphans && !orphanedFiles.includes(node.id)) return false;
      return true;
    }),
    links: graphData.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;

      const sourceVisible = graphData.nodes.some(n =>
        n.id === sourceId && (filterTypes.size === 0 || filterTypes.has(n.type))
      );
      const targetVisible = graphData.nodes.some(n =>
        n.id === targetId && (filterTypes.size === 0 || filterTypes.has(n.type))
      );

      return sourceVisible && targetVisible;
    }),
  } : null;

  return {
    graphData: filteredGraphData,
    rawGraphData: graphData,
    repoInfo,
    stats,
    orphanedFiles,
    loading,
    error,
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
    setFilterTypes,
  };
}
