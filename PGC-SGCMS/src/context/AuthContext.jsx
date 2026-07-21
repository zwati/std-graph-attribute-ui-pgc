// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pgc_user')) ?? null; }
    catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('pgc_token') ?? null
  );

  const login = useCallback(async (username, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { username, password });
    const { accessToken: token, refreshToken, role, linkedId } = data.data;
    const userData = { username, role, linkedId };
    localStorage.setItem('pgc_token', token);
    localStorage.setItem('pgc_refresh', refreshToken);
    localStorage.setItem('pgc_user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pgc_token');
    localStorage.removeItem('pgc_refresh');
    localStorage.removeItem('pgc_user');
    setAccessToken(null);
    setUser(null);
  }, []);

  // Axios instance with auth header
  const authAxios = axios.create({ baseURL: API });
  authAxios.interceptors.request.use(cfg => {
    const t = localStorage.getItem('pgc_token');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
  });

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, authAxios, API }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
