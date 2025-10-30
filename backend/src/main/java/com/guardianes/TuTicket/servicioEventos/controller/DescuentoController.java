package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import com.guardianes.TuTicket.servicioEventos.service.DescuentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DescuentoController {

    private final DescuentoService service;

    // Crear un descuento
//    @PostMapping("/descuento")
//    public ResponseEntity<?> addDescuento(@RequestBody Descuento descuento) {
//        try {
//            Descuento nuevo = service.addDescuento(descuento);
//            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
//        } catch (Exception e) {
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
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

    // Listar todos los descuentos
    @GetMapping("/descuento")
    public ResponseEntity<List<Descuento>> getAllDescuentos() {
        return ResponseEntity.ok(service.getAllDescuentos());
    }

    // Buscar descuento por ID
    @GetMapping("/descuento/{id}")
    public ResponseEntity<?> getDescuentoById(@PathVariable Integer id) {
        Descuento descuento = service.getDescuentoById(id);
        if (descuento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Descuento no encontrado");
        }
        return ResponseEntity.ok(descuento);
    }

    // Actualizar un descuento
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
    // Eliminar un descuento
    @DeleteMapping("/descuento/{id}")
    //api/descuento/1
    public ResponseEntity<?> deleteDescuento(@PathVariable Integer id) {
        try {
            service.deleteDescuento(id);
            return ResponseEntity.ok("Descuento eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("descuento/verify")
    /*FALTAN MÁS FUNCINOALIDADES DE VERIFICACIÓN (LIMITE POR USUARIO, LIMITE GLOBAL, ES GLOBAL, ETC)
    Por ahora, si el nombre del código está bien, funciona bien.
    /api/descuento/verify?nombre="CODIGO"
     */
    public ResponseEntity<?> verifyDescuento(@RequestParam String codigo){
        try{
            return ResponseEntity.ok(service.verificarCodigo(codigo));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}


