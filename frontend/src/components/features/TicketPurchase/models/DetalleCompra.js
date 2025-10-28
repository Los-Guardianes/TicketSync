export class DetalleCompra {
  constructor({ cantidad, precioDetalle, tarifa, idPeriodo }) {
    this.cantidad = cantidad;
    this.precioDetalle = precioDetalle;
    this.tarifa = tarifa;
    this.idPeriodo = idPeriodo;
  }

  static fromApi(data) {
    if (!data) return null;
    return new DetalleCompra({
      cantidad: data.cantidad,
      precioDetalle: data.precioDetalle,
      tarifa: data.tarifa,
      idPeriodo: data.idPeriodo,
    });
  }

  toApi() {
    return {
      cantidad: this.cantidad,
      precioDetalle: this.precioDetalle,
      tarifa: this.tarifa,
      idPeriodo: this.idPeriodo,
    };
  }
}
