export class OrdenCompra {

    constructor(metodoPago, idUsuario, idFuncion, detallesCompras = []) {        
        this.metodoPago = metodoPago;
        this.idUsuario = idUsuario;
        this.idFuncion = idFuncion;
        this.detallesCompras = detallesCompras;
    }

    GetMetodoPago() { return this.metodoPago }
    SetMetodoPago(metodoPago) { this.metodoPago = metodoPago }
    GetIdFuncion() { return this.idFuncion }
    SetIdFuncion(idFuncion) { this.idFuncion = idFuncion }
}