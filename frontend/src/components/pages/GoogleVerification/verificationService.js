// Simulación de servicio de verificación
export const verificationService = {
    // Simular verificación del código
    
    // eslint-disable-next-line no-unused-vars
    verifyCode: async (code, email) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // En un caso real, aquí harías una petición a tu API


        // Por ahora simulamos que 123456 es el código correcto
        if (code === '123456') {
            return { success: true, message: '¡Código verificado correctamente! Tu correo ha sido validado.' };
        } else {
            return { success: false, message: 'Código incorrecto. Por favor, inténtalo de nuevo.' };
        }
    },
    
    // Simular reenvío del código
    
    // eslint-disable-next-line no-unused-vars
    resendCode: async (email) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true, message: 'Se ha reenviado el código de verificación a tu correo.' };
    }
};