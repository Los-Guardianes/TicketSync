export class Zona {
    constructor(id, nombre, num_asientos, activo){
        this.id = id;
        this.nombre = nombre;
        this.num_asientos = num_asientos;
        this.activo = activo;
    }

    GetId() { return this.id }

    GetNombre() { return this.nombre }

    GetNumAsientos() { return this.num_asientos }

    GetActivo() { return this.activo }
}