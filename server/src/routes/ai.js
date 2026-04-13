import { Router } from 'express';
import { explainFile, summarizeRepo, detectDeadCode } from '../services/aiService.js';

const router = Router();

/**
 * POST /api/ai/explain
 * Get Claude's explanation of a file
 */
router.post('/explain', async (req, res) => {
  try {
    const { filePath, fileContent, owner, repo } = req.body;

    if (!filePath || !fileContent) {
      return res.status(400).json({ error: 'filePath and fileContent are required' });
    }

    const explanation = await explainFile(filePath, fileContent, { owner, repo });
    res.json({ explanation });

  } catch (error) {
    console.error('AI explain error:', error.message);

    if (error.message.includes('ANTHROPIC_API_KEY')) {
      return res.status(503).json({
        error: 'AI features are disabled. Set ANTHROPIC_API_KEY in your .env file.',
      });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/summarize
 * Get Claude's architecture overview of the repo
 */
router.post('/summarize', async (req, res) => {
  try {
    const { owner, repo, files, edges } = req.body;

    if (!owner || !repo || !files) {
      return res.status(400).json({ error: 'owner, repo, and files are required' });
    }

    const summary = await summarizeRepo({ owner, repo }, files, edges || []);
    res.json({ summary });

  } catch (error) {
    console.error('AI summarize error:', error.message);

    if (error.message.includes('ANTHROPIC_API_KEY')) {
      return res.status(503).json({
        error: 'AI features are disabled. Set ANTHROPIC_API_KEY in your .env file.',
      });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/dead-code
 * Detect dead code / orphaned files
 */
router.post('/dead-code', async (req, res) => {
  try {
    const { orphanedFiles, owner, repo } = req.body;

    if (!orphanedFiles) {
      return res.status(400).json({ error: 'orphanedFiles is required' });
    }

    const analysis = await detectDeadCode(orphanedFiles, { owner, repo });
    res.json({ analysis });

  } catch (error) {
    console.error('AI dead-code error:', error.message);

    if (error.message.includes('ANTHROPIC_API_KEY')) {
      return res.status(503).json({
        error: 'AI features are disabled. Set ANTHROPIC_API_KEY in your .env file.',
      });
    }

    res.status(500).json({ error: error.message });
  }
});

export default router;
