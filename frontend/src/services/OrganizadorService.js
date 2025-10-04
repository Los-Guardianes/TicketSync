// src/services/OrganizadorService.js

const API_URL = "http://localhost:8080/api/organizador";

export const postOrganizador = async (organizador) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(organizador)
        });

        if (!response.ok) {
            throw new Error("Error al registrar organizador");
        }

        return await response.json(); // Devuelve el organizador creado
    } catch (error) {
        console.error("Error en createOrganizador:", error);
        throw error;
    }
};
