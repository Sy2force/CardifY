import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { AuthContextType } from './AuthContextType';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('cardify_token');
        const savedUser = localStorage.getItem('cardify_user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            
            // Verify token is still valid
            const response = await authAPI.getProfile();
            if (response.user) {
              setUser(response.user);
              localStorage.setItem('cardify_user', JSON.stringify(response.user));
            }
          } catch (parseError) {
            // eslint-disable-next-line no-console
            console.error('Error parsing saved user:', parseError);
            // Clear invalid data
            localStorage.removeItem('cardify_token');
            localStorage.removeItem('cardify_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auth initialization error:', error);
        // Clear auth data on any error
        localStorage.removeItem('cardify_token');
        localStorage.removeItem('cardify_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('cardify_token', response.token);
      localStorage.setItem('cardify_user', JSON.stringify(response.user));
      
      toast.success(t('common.login_success'));
    } catch (error: any) {
      let message;
      if (error.name === 'NetworkError') {
        message = error.message;
      } else {
        message = error.response?.data?.message || t('common.login_error');
      }
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('cardify_token', response.token);
      localStorage.setItem('cardify_user', JSON.stringify(response.user));
      
      // Don't show toast here, let the component handle it
    } catch (error: any) {
      let message;
      if (error.name === 'NetworkError') {
        message = error.message;
      } else {
        message = error.response?.data?.message || 'Erreur lors de la création du compte';
      }
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cardify_token');
    localStorage.removeItem('cardify_user');
    toast.success(t('common.logout_success'));
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
