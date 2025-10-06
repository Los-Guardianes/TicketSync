const API_URL = "http://localhost:8080/api/evento";

export async function getEventos() {
  try {
    // Se hace el get a la api
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener eventos: " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetch eventos:", error);
    return [];
  }
}

export async function getEventosById(idevento) {
  try {
    // Se hace el get a la api
    const response = await fetch(API_URL+`/${idevento}`);
    if (!response.ok) {
      throw new Error(`Error al obtener evento con id ${idevento}: ` + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetch evento con id ${idevento}:`, error);
    return [];
  }
}