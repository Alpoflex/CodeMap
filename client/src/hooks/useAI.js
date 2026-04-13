import { useState, useCallback } from 'react';
import { explainFile, summarizeRepo, analyzeDeadCode, fetchFile } from '../utils/api';

/**
 * Custom hook for AI API interactions
 */
export function useAI() {
  const [explanation, setExplanation] = useState(null);
  const [summary, setSummary] = useState(null);
  const [deadCodeAnalysis, setDeadCodeAnalysis] = useState(null);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingDeadCode, setLoadingDeadCode] = useState(false);
  const [aiError, setAiError] = useState(null);

  const explain = useCallback(async (node, owner, repo) => {
    setLoadingExplain(true);
    setExplanation(null);
    setAiError(null);

    try {
      // First fetch the file content
      const fileData = await fetchFile(owner, repo, node.path);
      // Then get AI explanation
      const result = await explainFile(node.path, fileData.content, owner, repo);
      setExplanation(result.explanation);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setLoadingExplain(false);
    }
  }, []);

  const summarize = useCallback(async (owner, repo, nodes, edges) => {
    setLoadingSummary(true);
    setSummary(null);
    setAiError(null);

    try {
      const result = await summarizeRepo(owner, repo, nodes, edges);
      setSummary(result.summary);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const detectDeadCode = useCallback(async (orphanedFiles, owner, repo) => {
    setLoadingDeadCode(true);
    setDeadCodeAnalysis(null);
    setAiError(null);

    try {
      const result = await analyzeDeadCode(orphanedFiles, owner, repo);
      setDeadCodeAnalysis(result.analysis);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setLoadingDeadCode(false);
    }
  }, []);

  const clearAI = useCallback(() => {
    setExplanation(null);
    setSummary(null);
    setDeadCodeAnalysis(null);
    setAiError(null);
  }, []);

  return {
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
  };
}
