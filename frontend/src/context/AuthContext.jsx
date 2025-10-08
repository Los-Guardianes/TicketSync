
import { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};

// Creamos el proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // useEffect para cargar el usuario desde localStorage al iniciar la app
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Función para iniciar sesión
    const login = (userData) => {
        // Guardamos el usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };
    const logout = () => {
        // Removemos el usuario de localStorage
        localStorage.removeItem('user');
        // Limpiamos el estado del usuario
        setUser(null);
    };

    // El valor que proveeremos a los componentes hijos
    const value = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};