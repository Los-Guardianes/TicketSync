export class OrdenCompra {

    constructor(metodoPago, totalBruto, descuentoAplicado, total,idUsuario, idFuncion, idDescuentoUtilizado,detallesCompras = []) {        
        this.metodoPago = metodoPago;
        this.totalBruto = totalBruto;
        this.descuentoAplicado = descuentoAplicado;
        this.total = total;
        this.idUsuario = idUsuario;
        this.idFuncion = idFuncion;
        this.idDescuentoUtilizado = idDescuentoUtilizado;
        this.detallesCompras = detallesCompras;
    }
}