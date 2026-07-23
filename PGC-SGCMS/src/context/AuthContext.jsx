// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

function getDefaultApiUrl() {
  const saved = localStorage.getItem('pgc_api_url');
  if (saved) return saved;
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const protocol = window.location.protocol || 'http:';
    const host = window.location.hostname;
    const port = window.location.port;

    // If accessed via Cloudflare Tunnel, domain, or non-5000 port, use relative /api proxy
    if (host.includes('trycloudflare') || host.includes('cloudflare') || (port !== '5000' && port !== '5173')) {
      return '/api';
    }
    return `${protocol}//${host}:5000/api`;
  }
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return '/api';
}




export function AuthProvider({ children }) {
  const [apiUrl, setApiUrl] = useState(getDefaultApiUrl);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pgc_user')) ?? null; }
    catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('pgc_token') ?? null
  );

  const updateServerUrl = useCallback((newUrl) => {
    const trimmed = newUrl.trim().replace(/\/+$/, '');
    const finalUrl = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    localStorage.setItem('pgc_api_url', finalUrl);
    setApiUrl(finalUrl);
  }, []);

  const login = useCallback(async (username, password) => {
    const { data } = await axios.post(`${apiUrl}/auth/login`, { username, password });
    const { accessToken: token, refreshToken, role, linkedId } = data.data;
    const userData = { username, role, linkedId };
    localStorage.setItem('pgc_token', token);
    localStorage.setItem('pgc_refresh', refreshToken);
    localStorage.setItem('pgc_user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
    return userData;
  }, [apiUrl]);

  const logout = useCallback(() => {
    localStorage.removeItem('pgc_token');
    localStorage.removeItem('pgc_refresh');
    localStorage.removeItem('pgc_user');
    setAccessToken(null);
    setUser(null);
  }, []);

  // Axios instance dynamically created/updated with current API URL
  const authAxios = useMemo(() => {
    const instance = axios.create({ baseURL: apiUrl });
    instance.interceptors.request.use(cfg => {
      cfg.headers['ngrok-skip-browser-warning'] = 'true';
      const t = localStorage.getItem('pgc_token');
      if (t) cfg.headers.Authorization = `Bearer ${t}`;
      return cfg;
    });
    instance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const rToken = localStorage.getItem('pgc_refresh');
          if (rToken) {
            try {
              const { data } = await axios.post(`${apiUrl}/auth/refresh`, { refreshToken: rToken });
              const { accessToken: newAccess, refreshToken: newRefresh } = data.data;
              localStorage.setItem('pgc_token', newAccess);
              localStorage.setItem('pgc_refresh', newRefresh);
              setAccessToken(newAccess);
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
              return instance(originalRequest); // Retry original request with new token
            } catch (refreshErr) {
              // Refresh token is also expired, trigger full login redirect
              localStorage.removeItem('pgc_token');
              localStorage.removeItem('pgc_refresh');
              localStorage.removeItem('pgc_user');
              window.location.href = '/login?expired=true';
              return Promise.reject(refreshErr);
            }
          } else {
            localStorage.removeItem('pgc_token');
            localStorage.removeItem('pgc_refresh');
            localStorage.removeItem('pgc_user');
            window.location.href = '/login?expired=true';
          }
        }
        return Promise.reject(error);
      }
    );
    return instance;
  }, [apiUrl]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, authAxios, API: apiUrl, apiUrl, updateServerUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

