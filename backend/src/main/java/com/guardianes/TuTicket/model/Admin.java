package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@Data
@Table(name = "admint")
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Admin extends Usuario {

}
