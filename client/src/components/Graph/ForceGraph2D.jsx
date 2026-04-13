import { useRef, useEffect, useCallback } from 'react';
import ForceGraph from 'react-force-graph-2d';

export default function ForceGraph2DComponent({
  data,
  onNodeClick,
  highlightNodes,
  highlightLinks,
  orphanedFiles,
}) {
  const graphRef = useRef();

  useEffect(() => {
    if (graphRef.current && data?.nodes?.length) {
      graphRef.current.d3Force('charge').strength(-80);
      graphRef.current.d3Force('link').distance(50);

      setTimeout(() => {
        graphRef.current?.zoomToFit(800, 40);
      }, 300);
    }
  }, [data]);

  const paintNode = useCallback((node, ctx) => {
    const size = node.val || 3;
    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node.id);
    const isOrphan = orphanedFiles?.includes(node.id);

    // Glow for highlighted nodes
    if (isHighlighted && highlightNodes.size > 0) {
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 15;
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.globalAlpha = isHighlighted ? 0.9 : 0.2;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Orphan ring
    if (isOrphan) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Label for larger/highlighted nodes
    if (size > 5 || (highlightNodes.has(node.id) && highlightNodes.size > 0)) {
      ctx.font = `${Math.max(3, size * 0.6)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = isHighlighted ? '#e2e8f0' : 'rgba(226, 232, 240, 0.3)';
      ctx.fillText(node.name, node.x, node.y + size + 2);
    }
  }, [highlightNodes, orphanedFiles]);

  const getLinkColor = useCallback((link) => {
    if (highlightLinks.size > 0) {
      return highlightLinks.has(link)
        ? 'rgba(99, 102, 241, 0.6)'
        : 'rgba(99, 102, 241, 0.04)';
    }
    return 'rgba(99, 102, 241, 0.12)';
  }, [highlightLinks]);

  if (!data?.nodes?.length) return null;

  return (
    <ForceGraph
      ref={graphRef}
      graphData={data}
      backgroundColor="rgba(10, 10, 26, 0)"
      nodeCanvasObject={paintNode}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.val || 3) + 3, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }}
      linkColor={getLinkColor}
      linkWidth={(link) => highlightLinks.has(link) ? 2 : 0.5}
      linkDirectionalParticles={(link) => highlightLinks.has(link) ? 2 : 0}
      linkDirectionalParticleWidth={2}
      linkDirectionalParticleColor={() => 'rgba(99, 102, 241, 0.6)'}
      linkDirectionalParticleSpeed={0.008}
      onNodeClick={onNodeClick}
      onBackgroundClick={() => onNodeClick(null)}
      enableNodeDrag={true}
      cooldownTime={5000}
      warmupTicks={50}
    />
  );
}
