import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartwaste_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('smartwaste_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('smartwaste_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Auth session expired or backend unreachable');
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data?.success) {
      localStorage.setItem('smartwaste_token', res.data.token);
      localStorage.setItem('smartwaste_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.data?.success) {
      localStorage.setItem('smartwaste_token', res.data.token);
      localStorage.setItem('smartwaste_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('smartwaste_token');
    localStorage.removeItem('smartwaste_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
