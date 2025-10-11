export class OrdenCompra {

    constructor(metodoPago, idUsuario, idFuncion, listaDetalles = []) {        
        this.metodoPago = metodoPago;
        this.idUsuario = idUsuario;
        this.idFuncion = idFuncion;
        this.listaDetalles = listaDetalles;
    }

    GetMetodoPago() { return this.metodoPago }
    SetMetodoPago(metodoPago) { this.metodoPago = metodoPago }
    GetIdFuncion() { return this.idFuncion }
    SetIdFuncion(idFuncion) { this.idFuncion = idFuncion }
}