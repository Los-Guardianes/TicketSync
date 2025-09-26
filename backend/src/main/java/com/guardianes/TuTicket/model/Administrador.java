package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table (name = "admint")
@NoArgsConstructor
@Data
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Administrador extends Usuario {

}
