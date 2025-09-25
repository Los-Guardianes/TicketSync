package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@Data
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Administrador extends Usuario {

}
