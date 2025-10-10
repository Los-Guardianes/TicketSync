export class OrdenCompra {

    constructor(fechaOrden, metodoPago, idUsuario, idFuncion, listaDetalles = []) {
        this.fechaOrden = fechaOrden;
        this.metodoPago = metodoPago;
        this.idUsuario = idUsuario;
        this.idFuncion = idFuncion;
        this.listaDetalles = listaDetalles;
    }

    GetFechaOrden() { return this.fechaOrden }
    SetFechaOrden(fechaOrden) { this.fechaOrden = fechaOrden }
    GetMetodoPago() { return this.metodoPago }
    SetMetodoPago(metodoPago) { this.metodoPago = metodoPago }
    GetIdFuncion() { return this.idFuncion }
    SetIdFuncion(idFuncion) { this.idFuncion = idFuncion }
}