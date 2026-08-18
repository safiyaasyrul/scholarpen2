import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  aiDecomposeTopic, 
  aiGenerateTaxonomyAndKeywords, 
  aiGenerateSearchStrategy, 
  aiScreenAbstract 
} from './server/ai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'ScholarPen API', timestamp: new Date().toISOString() });
  });

  // Step 2: AI Topic Decomposition Agent
  app.post('/api/ai/decompose', async (req, res) => {
    try {
      const { title, scope } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      const decomposition = await aiDecomposeTopic(title, scope);
      res.json({ decomposition });
    } catch (err: any) {
      console.error('Decompose error:', err);
      res.status(500).json({ error: err.message || 'Decomposition failed' });
    }
  });

  // Step 3: AI Taxonomy & Keyword Expansion Agent
  app.post('/api/ai/taxonomy', async (req, res) => {
    try {
      const { title, decomposition } = req.body;
      if (!title || !decomposition) {
        return res.status(400).json({ error: 'Title and decomposition are required' });
      }
      const result = await aiGenerateTaxonomyAndKeywords(title, decomposition);
      res.json(result);
    } catch (err: any) {
      console.error('Taxonomy error:', err);
      res.status(500).json({ error: err.message || 'Taxonomy generation failed' });
    }
  });

  // Step 4: AI Search Strategy Agent
  app.post('/api/ai/search-strategy', async (req, res) => {
    try {
      const { title, taxonomy, filters } = req.body;
      if (!title || !taxonomy) {
        return res.status(400).json({ error: 'Title and taxonomy are required' });
      }
      const result = await aiGenerateSearchStrategy(title, taxonomy, filters || {});
      res.json(result);
    } catch (err: any) {
      console.error('Search strategy error:', err);
      res.status(500).json({ error: err.message || 'Search strategy generation failed' });
    }
  });

  // Step 6: AI Abstract Screening Agent (Single Paper)
  app.post('/api/ai/screen-abstract', async (req, res) => {
    try {
      const { paper, researchScope } = req.body;
      if (!paper || !researchScope) {
        return res.status(400).json({ error: 'Paper and researchScope are required' });
      }
      const result = await aiScreenAbstract(paper, researchScope);
      res.json(result);
    } catch (err: any) {
      console.error('Screening error:', err);
      res.status(500).json({ error: err.message || 'Abstract screening failed' });
    }
  });

  // Step 6: Batch Screening Agent
  app.post('/api/ai/batch-screen', async (req, res) => {
    try {
      const { papers, researchScope } = req.body;
      if (!papers || !Array.isArray(papers) || !researchScope) {
        return res.status(400).json({ error: 'Papers array and researchScope are required' });
      }
      const results = [];
      for (const p of papers) {
        const screened = await aiScreenAbstract(p, researchScope);
        results.push(screened);
      }
      res.json({ screenings: results });
    } catch (err: any) {
      console.error('Batch screening error:', err);
      res.status(500).json({ error: err.message || 'Batch screening failed' });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScholarPen Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start ScholarPen server:', err);
});
