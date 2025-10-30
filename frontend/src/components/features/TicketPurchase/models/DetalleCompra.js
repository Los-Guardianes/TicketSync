export class DetalleCompra {

    constructor(zona, temporada, precioDetalle, cantidad) {
        this.zona = zona;
        this.temporada = temporada;
        this.precioDetalle = precioDetalle;
        this.cantidad = cantidad;
    }

    GetZona() { return this.zona }

    GetTemporada() { return this.temporada }

    GetPrecioDetalle() { return this.precioDetalle }

    GetCantidad() { return this.cantidad }

    SetCantidad(cantidad) { this.cantidad = cantidad }
}