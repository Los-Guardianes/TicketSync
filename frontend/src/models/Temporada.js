export class Temporada{
    constructor(id, nombre, fecha_inicio, fecha_fin, descuento, activo){
        this.id = id;
        this.nombre = nombre;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.descuento = descuento;
        this.activo = activo;
    }

    GetId() { return this.id }

    GetNombre() { return this.nombre }

    GetFechaInicio() { return this.fecha_inicio }

    GetFechaFin() { return this.fecha_fin }

    GetDescuento() { return this.descuento }

    GetActivo() { return this.activo }
}