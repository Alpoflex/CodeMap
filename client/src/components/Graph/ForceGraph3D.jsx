import { useRef, useEffect, useCallback, useMemo } from 'react';
import ForceGraph from 'react-force-graph-3d';
import * as THREE from 'three';

export default function ForceGraph3DComponent({
  data,
  onNodeClick,
  highlightNodes,
  highlightLinks,
  orphanedFiles,
}) {
  const graphRef = useRef();

  useEffect(() => {
    if (graphRef.current && data?.nodes?.length) {
      graphRef.current.d3Force('charge').strength(-100);
      graphRef.current.d3Force('link').distance(60);

      setTimeout(() => {
        graphRef.current?.zoomToFit(800, 100);
      }, 500);

      // Add ambient light
      const scene = graphRef.current.scene();
      if (scene) {
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
      }
    }
  }, [data]);

  const nodeThreeObject = useCallback((node) => {
    const size = (node.val || 3) * 0.8;
    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node.id);
    const isOrphan = orphanedFiles?.includes(node.id);

    const group = new THREE.Group();

    // Main sphere
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(node.color),
      transparent: true,
      opacity: isHighlighted ? 0.9 : 0.2,
      emissive: new THREE.Color(node.color),
      emissiveIntensity: isHighlighted ? 0.3 : 0.05,
      shininess: 100,
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Glow sphere
    if (isHighlighted && highlightNodes.size > 0) {
      const glowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.1,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      group.add(glow);
    }

    // Orphan ring
    if (isOrphan) {
      const ringGeometry = new THREE.TorusGeometry(size + 1.5, 0.3, 8, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      group.add(ring);
    }

    return group;
  }, [highlightNodes, orphanedFiles]);

  const getLinkColor = useCallback((link) => {
    if (highlightLinks.size > 0) {
      return highlightLinks.has(link)
        ? 'rgba(99, 102, 241, 0.8)'
        : 'rgba(99, 102, 241, 0.03)';
    }
    return 'rgba(99, 102, 241, 0.1)';
  }, [highlightLinks]);

  if (!data?.nodes?.length) return null;

  return (
    <ForceGraph
      ref={graphRef}
      graphData={data}
      backgroundColor="rgba(10, 10, 26, 0)"
      nodeThreeObject={nodeThreeObject}
      nodeThreeObjectExtend={false}
      linkColor={getLinkColor}
      linkWidth={(link) => highlightLinks.has(link) ? 1.5 : 0.3}
      linkOpacity={0.3}
      linkDirectionalParticles={(link) => highlightLinks.has(link) ? 3 : 0}
      linkDirectionalParticleWidth={1.5}
      linkDirectionalParticleColor={() => 'rgba(99, 102, 241, 0.7)'}
      linkDirectionalParticleSpeed={0.006}
      onNodeClick={onNodeClick}
      onBackgroundClick={() => onNodeClick(null)}
      enableNodeDrag={true}
      showNavInfo={false}
    />
  );
}
