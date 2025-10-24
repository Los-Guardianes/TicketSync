import { TipoEntrada } from "./TipoEntrada.js";
import { Zona } from "./Zona.js";

export class Tarifa {
  constructor({ idTarifa, precioBase, tipoEntrada, zona }) {
    this.idTarifa = idTarifa;
    this.precioBase = precioBase;
    this.tipoEntrada = tipoEntrada instanceof TipoEntrada ? tipoEntrada : new TipoEntrada(tipoEntrada);
    this.zona = zona instanceof Zona ? zona : new Zona(zona);
  }

  static fromApi(data) {
    return new Tarifa({
      idTarifa: data.idTarifa,
      precioBase: data.precioBase,
      tipoEntrada: TipoEntrada.fromApi(data.tipoEntrada || data.tipoEntradaDTO),
      zona: Zona.fromApi(data.zona || data.zonaDTO),
    });
  }
}
