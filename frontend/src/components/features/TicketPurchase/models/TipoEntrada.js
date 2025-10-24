export class TipoEntrada {
  constructor({ idTipoEntrada, nombre, descripcion, idEvento }) {
    this.idTipoEntrada = idTipoEntrada;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.idEvento = idEvento;
  }

  static fromApi(data) {
    return new TipoEntrada({
      idTipoEntrada: data.idTipoEntrada,
      nombre: data.nombre,
      descripcion: data.descripcion,
      idEvento: data.idEvento,
    });
  }
}
