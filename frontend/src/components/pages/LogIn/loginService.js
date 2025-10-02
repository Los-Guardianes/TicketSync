// Simulación de servicio de login
export const loginService = {
    // Simular login
    login: async (email, password) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // En un caso real, aquí harías una petición a tu API
        // Por ahora simulamos credenciales específicas
        if (email === 'usuario@ejemplo.com' && password === '123456') {
            return { 
                success: true, 
                message: '¡Inicio de sesión exitoso!',
                user: {
                    id: 1,
                    name: 'Usuario Ejemplo',
                    email: email
                }
            };
        } else {
            return { 
                success: false, 
                message: 'Correo o contraseña incorrectos. Intente de nuevo.' 
            };
        }
    },

    // Simular recuperación de contraseña
    forgotPassword: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return { 
            success: true, 
            message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.' 
        };
    }
};