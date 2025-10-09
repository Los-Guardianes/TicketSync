
import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const readAuth = () => {
  try { return JSON.parse(localStorage.getItem('auth')) || null; }
  catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readAuth()); // { user, token, exp? }

  const login = (user, token, exp) => {
    const payload = { user, token, exp };
    localStorage.setItem('auth', JSON.stringify(payload));
    setAuth(payload);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
  };

  const value = useMemo(() => ({
    user: auth?.user ?? null,
    token: auth?.token ?? null,
    isAuthenticated: Boolean(auth?.token),
    login, logout,
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
