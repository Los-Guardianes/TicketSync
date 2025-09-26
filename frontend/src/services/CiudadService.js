export async function getCiudades() {
  try {
    // Se hace el get a la api
    const response = await fetch("http://localhost:8080/api/ciudad");
    if (!response.ok) {
      throw new Error("Error al obtener ciudades: " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetch ciudades:", error);
    return [];
  }
}
