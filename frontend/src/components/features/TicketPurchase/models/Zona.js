export class Zona {
  constructor({ idZona, nombre, comprasActuales, aforo, idEvento }) {
    this.idZona = idZona;
    this.nombre = nombre;
    this.comprasActuales = comprasActuales;
    this.aforo = aforo;
    this.idEvento = idEvento;
  }

  static fromApi(data) {
    return new Zona({
      idZona: data.idZona,
      nombre: data.nombre,
      comprasActuales: data.comprasActuales,
      aforo: data.aforo,
      idEvento: data.idEvento,
    });
  }
}
