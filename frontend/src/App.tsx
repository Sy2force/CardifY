// App principal - Configuration des routes et layout global
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContextProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cards from './pages/Cards';
import CardDetails from './pages/CardDetails';
import Favorites from './pages/Favorites';
import Register from './pages/Register';
import Admin from './pages/Admin';

// Route protégée - Nécessite une connexion
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Affichage du loader pendant vérification auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Redirection vers login si non connecté
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Route admin - Nécessite le rôle administrateur
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Loader pendant vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Pas connecté : vers login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Pas admin : vers dashboard
  if (!user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Route publique - Redirige vers dashboard si déjà connecté
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Loader pendant vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Déjà connecté : vers dashboard
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
};

// Composant principal de l'application
function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Routes publiques - accessibles à tous */}
            <Route path="/" element={<Landing />} />              {/* Page d'accueil */}
            <Route path="/cards" element={<Cards />} />            {/* Liste des cartes */}
            <Route path="/cards/:id" element={<CardDetails />} /> {/* Détails carte */}
            
            {/* Routes d'authentification - redirige si connecté */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />                                           {/* Connexion */}
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />                                        {/* Inscription */}
              </PublicRoute>
            } />
            
            {/* Routes protégées - connexion requise */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />                                       {/* Tableau de bord */}
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />                                       {/* Cartes favorites */}
              </ProtectedRoute>
            } />
            
            {/* Routes admin - rôle admin requis */}
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />                                           {/* Panel admin */}
              </AdminRoute>
            } />
            
            {/* Route par défaut - retour accueil */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
