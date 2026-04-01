import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const userData = { ...res.data.user, token: res.data.token };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Login failed');
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      const userData = { ...res.data.user, token: res.data.token };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
