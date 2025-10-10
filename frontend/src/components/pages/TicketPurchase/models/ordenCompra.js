export class OrdenCompra {

    constructor(fechaOrden, metodoPago, idUsuario) {
        this.fechaOrden = fechaOrden;
        this.metodoPago = metodoPago;
        this.idUsuario = idUsuario;
    }

    GetFechaOrden() { return this.fechaOrden }
    SetFechaOrden(fechaOrden) { this.fechaOrden = fechaOrden }
    GetMetodoPago() { return this.metodoPago }
    SetMetodoPago(metodoPago) { this.metodoPago = metodoPago }
}