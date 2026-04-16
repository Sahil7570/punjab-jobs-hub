import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';
import { ADMIN_TOKEN_KEY } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      authApi.me()
        .then((res) => setAdmin(res.admin))
        .catch(() => localStorage.removeItem(ADMIN_TOKEN_KEY))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
    setAdmin(res.admin);
    return res;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isLoggedIn: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
