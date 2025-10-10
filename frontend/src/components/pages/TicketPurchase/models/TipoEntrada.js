export class TipoEntrada {
    constructor(id, nombre, precioBase, cantidad_maxima,activo) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
        this.cantidad_maxima = cantidad_maxima;
        this.activo = activo;
    }
    
    getNombre() { return this.nombre }

    getPrecioBase() { return this.precioBase }

    getCantidadMaxima() { return this.cantidad_maxima }

    getActivo() { return this.activo }

}