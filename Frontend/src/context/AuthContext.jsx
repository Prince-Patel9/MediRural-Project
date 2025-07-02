import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isSupplier, setIsSupplier] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin , setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      setToken(token);
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        setIsSupplier(false);
        return;
      }
      
      const response = await axios.get('https://medirural.onrender.com/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const userData = response.data.user;
        setIsAuthenticated(true);
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
        setIsSupplier(userData.role === 'supplier');
      }
    } catch (error) {
      console.error('Auth check error:', error.response?.status, error.response?.data);
      // Clear invalid token
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      setIsSupplier(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('https://medirural.onrender.com/api/users/login', 
      { email, password }
    );
    
    if (response.data.success) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      
      setIsAuthenticated(true);
      
      // Manually fetch profile data using token
      try {
        const profileResponse = await axios.get('https://medirural.onrender.com/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${response.data.token}`
          }
        });
        
        if (profileResponse.data.success) {
          const userData = profileResponse.data.user;
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          setIsSupplier(userData.role === 'supplier');
        }
      } catch (profileError) {
        console.error('Profile fetch failed after login:', profileError.response?.status, profileError.response?.data);
        // Don't throw error here, login was successful
      }
      
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const logout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      setToken(null);
      
      // Try to logout from server (optional)
      const token = localStorage.getItem('token');
      if (token) {
        await axios.get('https://medirural.onrender.com/api/users/logout', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      setIsSupplier(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, reset local state
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      setIsSupplier(false);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    isAdmin,
    isSupplier,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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