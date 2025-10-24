package com.guardianes.TuTicket.servicioEventos.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ZonaXFuncionId implements Serializable {
    private Integer idZona;
    private Integer idFuncion;

    public ZonaXFuncionId() {}
    public ZonaXFuncionId(Integer idZona, Integer idFuncion) {
        this.idZona = idZona;
        this.idFuncion = idFuncion;
    }

    public Integer getIdZona() { return idZona; }
    public void setIdZona(Integer idZona) { this.idZona = idZona; }
    public Integer getIdFuncion() { return idFuncion; }
    public void setIdFuncion(Integer idFuncion) { this.idFuncion = idFuncion; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ZonaXFuncionId that)) return false;
        return Objects.equals(idZona, that.idZona) && Objects.equals(idFuncion, that.idFuncion);
    }
    @Override public int hashCode() { return Objects.hash(idZona, idFuncion); }
}
