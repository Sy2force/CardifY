import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT || '10000', 10);

// Middleware minimal
app.use(cors());
app.use(express.json());

// Route de test simple
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Cardify API is running',
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Démarrage du serveur
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Minimal server running on port ${PORT}`);
  });
}

export default app;
