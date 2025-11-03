const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de Cardify...');
console.log('📱 Frontend: http://localhost:3008');
console.log('🔧 Backend API: http://localhost:3006');

// Démarrer le backend sur le port 3006
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '3006', CLIENT_URL: 'http://localhost:3008' }
});

// Démarrer le frontend sur le port 3008 avec proxy vers le backend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  env: { 
    ...process.env, 
    VITE_API_URL: 'http://localhost:3006/api'
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt des serveurs...');
  backend.kill();
  frontend.kill();
  process.exit();
});
