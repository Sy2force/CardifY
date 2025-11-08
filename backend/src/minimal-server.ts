import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware minimal
app.use(cors());
app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
  res.json({ 
    message: 'Cardify API is running',
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
});

export default app;
