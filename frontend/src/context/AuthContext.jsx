
import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const readAuth = () => {
  try { 
    const raw = localStorage.getItem('auth');
    if(!raw)return null;
    const data = JSON.parse(raw);
    if(data.exp && Date.now() >= data.exp * 1000) { //Se multiplica por 1000 para pasar a ms
      localStorage.removeItem('auth');
      return null;
    }
    return data;
  }
  catch { 
    return null; 
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readAuth()); 

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
