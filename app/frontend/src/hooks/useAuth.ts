// Hook personnalisé - Accès au contexte d'authentification
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook pour utiliser les données d'auth dans les composants
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context; // Retourne user, login, logout, loading
};
