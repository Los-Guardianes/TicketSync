import { TipoEntrada } from "./TipoEntrada.js";
import { Zona } from "./Zona.js";

export class Tarifa {
  constructor({ idTarifa, precioBase, tipoEntrada, zona }) {
    this.idTarifa = idTarifa;
    this.precioBase = precioBase;
    this.tipoEntrada = tipoEntrada;
    this.zona = zona;
  }

  static fromApi(data) {
    return new Tarifa({
      idTarifa: data.idTarifa,
      precioBase: data.precioBase,
      tipoEntrada: TipoEntrada.fromApi(data.tipoEntradaDTO),
      zona: Zona.fromApi(data.zonaDTO),
    });
  }
}
