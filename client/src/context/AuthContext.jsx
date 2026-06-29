import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await api.get('/auth/profile');
      setUser(data.user || data);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(data.user || data);
      toast.success('Welcome back! Login successful.');
      navigate('/dashboard');
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      const token = data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(data.user || data);
      toast.success('Account created successfully! Welcome aboard.');
      navigate('/dashboard');
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Logout even if API call fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully.');
      navigate('/login');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser(data.user || data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
