import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AUTH_STORAGE_KEYS } from '@/constants';
import { clearAccessToken, setAccessToken, setUnauthorizedHandler } from '@/lib';
import { authService } from '@/services';
import AuthContext from './AuthContext';

const getRememberMe = () => window.localStorage.getItem(AUTH_STORAGE_KEYS.rememberMe) === 'true';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const hasInitialized = useRef(false);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setAccessTokenState(null);
    setUser(null);
    setAuthenticated(false);
  }, []);

  const applySession = useCallback((session) => {
    const nextToken = session.accessToken || null;
    setAccessToken(nextToken);
    setAccessTokenState(nextToken);
    setUser(session.user || null);
    setAuthenticated(Boolean(session.user));
  }, []);

  const initialize = useCallback(async () => {
    try {
      const session = await authService.refreshToken();
      applySession(session);
    } catch {
      clearSession();
    } finally {
      setInitialized(true);
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initialize();
    }

    return () => setUnauthorizedHandler(null);
  }, [clearSession, initialize]);

  const signIn = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const session = await authService.login(credentials);
      window.localStorage.setItem(AUTH_STORAGE_KEYS.rememberMe, String(Boolean(credentials.rememberMe)));
      applySession(session);
      return session;
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      window.localStorage.removeItem(AUTH_STORAGE_KEYS.rememberMe);
      clearSession();
      setLoading(false);
    }
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isInitialized,
    rememberMe: getRememberMe(),
    signIn,
    signOut,
  }), [accessToken, isAuthenticated, isInitialized, isLoading, signIn, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
