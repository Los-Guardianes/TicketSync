package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import com.guardianes.TuTicket.servicioEventos.DTO.DescuentoDTO;
import com.guardianes.TuTicket.servicioEventos.service.DescuentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DescuentoController {

    private final DescuentoService service;

    @PostMapping("/descuento")
    public ResponseEntity<?> addDescuento(@RequestBody List<Descuento> descuento) {
        try {
            List<Descuento> nuevos = new ArrayList<>();
            for (Descuento d : descuento) {
                Descuento creado = service.addDescuento(d);
                nuevos.add(creado);
            }
            return new ResponseEntity<>(nuevos, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/descuento")
    public ResponseEntity<List<Descuento>> getAllDescuentos() {
        return ResponseEntity.ok(service.getAllDescuentos());
    }

    @GetMapping("/descuento/{id}")
    public ResponseEntity<?> getDescuentoById(@PathVariable Integer id) {
        Descuento descuento = service.getDescuentoById(id);
        if (descuento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Descuento no encontrado");
        }
        return ResponseEntity.ok(descuento);
    }

    @PutMapping("/descuento/{id}")
    public ResponseEntity<?> updateDescuento(@PathVariable Integer id, @RequestBody Descuento descuento) {
        try {
            descuento.setIdDescuento(id);
            Descuento actualizado = service.updateDescuento(descuento);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/descuento/{id}")
    public ResponseEntity<?> deleteDescuento(@PathVariable Integer id) {
        try {
            service.deleteDescuento(id);
            return ResponseEntity.ok("Descuento eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/descuento/verify")
    public ResponseEntity<?> verifyDescuento(@RequestParam String codigo){
        try{
            return ResponseEntity.ok(service.verificarCodigo(codigo));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping("/descuento/evento/{idEvento}/activos")
    public ResponseEntity<List<DescuentoDTO>> getActivosByEvento(
            @PathVariable Integer idEvento
    ) {
        List<Descuento> lista = service.getActivosByEvento(idEvento);

        List<DescuentoDTO> resp = lista.stream().map(d -> {
            DescuentoDTO dto = new DescuentoDTO();

            dto.setIdDescuento(d.getIdDescuento());         // Integer
            dto.setCodigo(d.getCodigo());                   // String
            dto.setTipoDesc(d.getTipoDesc().name());        // Enum -> String ("MONTO"/"PORCENTAJE")
            dto.setValorDescuento(d.getValorDescuento());   // BigDecimal
            dto.setFechaInicio(d.getFechaInicio());         // LocalDate
            dto.setFechaFin(d.getFechaFin());               // LocalDate
            dto.setLimiteTotal(d.getLimiteTotal());         // Integer
            dto.setLimiteCliente(d.getLimiteCliente());     // Integer (nullable)
            dto.setActivo(d.getActivo());                   // Boolean

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/descuento/bulk")
    public ResponseEntity<?> addDescuentoBulk(@RequestBody List<Descuento> descuentos) {
        try {
            List<Descuento> nuevos = new ArrayList<>();
            for (Descuento d : descuentos) {
                Descuento creado = service.addDescuento(d);
                nuevos.add(creado);
            }
            return new ResponseEntity<>(nuevos, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
