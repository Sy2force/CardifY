// Service de logging - Gestion centralisée des logs avec fichiers quotidiens
import fs from 'fs';
import path from 'path';

// Création du répertoire logs s'il n'existe pas
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Génère le nom du fichier de log basé sur la date actuelle
const getLogFileName = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}.log`; // Format: YYYY-MM-DD.log
};

// Écrit une entrée de log dans le fichier quotidien
const writeLog = (level: string, message: string, data?: Record<string, unknown>): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ''}\n`;
  
  const logFile = path.join(logsDir, getLogFileName());
  fs.appendFileSync(logFile, logEntry);
  
  // Affichage console en développement uniquement
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(logEntry.trim()); // Affichage pour debug local
  }
};

// Logger centralisé avec différents niveaux de log
export const logger = {
  info: (message: string, data?: Record<string, unknown>): void => writeLog('info', message, data),   // Informations générales
  error: (message: string, data?: Record<string, unknown>): void => writeLog('error', message, data), // Erreurs critiques
  warn: (message: string, data?: Record<string, unknown>): void => writeLog('warn', message, data),   // Avertissements
  debug: (message: string, data?: Record<string, unknown>): void => writeLog('debug', message, data)  // Debug développement
};
