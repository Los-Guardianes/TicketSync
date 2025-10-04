const API_URL = "http://localhost:8080/api/cliente";

export const postClient = async (cliente) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error("Error al registrar cliente");
        }

        return await response.json(); // Devuelve el cliente creado
    } catch (error) {
        console.error("Error en createCliente:", error);
        throw error;
    }
};