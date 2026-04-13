import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskgh_token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authToken) => {
    try {
      // We assume /api/profiles/me returns { user: { id, full_name, is_admin, ... } }
      const data = await api.get('/profiles/me');
      setUser(data.user);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('taskgh_token', newToken);
    localStorage.setItem('taskgh_user_id', userData.id);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('taskgh_token');
    localStorage.removeItem('taskgh_user_id');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isAuthenticated: !!token, 
      isAdmin: user?.is_admin || false,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
