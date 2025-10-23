package com.guardianes.TuTicket.servicioUbicacion.controller;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUbicacion.service.CiudadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CiudadController {

    @Autowired
    private CiudadService service;

    @PostMapping("/ciudad")
    public ResponseEntity<?> addCiudad(@RequestBody Ciudad ciudad) {
        try {
            Ciudad nueva = service.addCiudad(ciudad);
            return new ResponseEntity<>(nueva, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/ciudad")
    public ResponseEntity<List<Ciudad>> getAllCiudades() {
        List<Ciudad> ciudades = service.getAllCiudades();
        return new ResponseEntity<>(ciudades, HttpStatus.OK);
    }

    @GetMapping("/ciudad/{id}")
    public ResponseEntity<?> getCiudadById(@PathVariable Integer id) {
        Ciudad ciudad = service.getCiudadById(id);
        if (ciudad == null) {
            return new ResponseEntity<>("Ciudad no encontrada", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ciudad, HttpStatus.OK);
    }

    @PutMapping("/ciudad/{id}")
    public ResponseEntity<?> updateCiudad(@PathVariable Integer id, @RequestBody Ciudad ciudad) {
        try {
            ciudad.setIdCiudad(id);
            Ciudad actualizada = service.updateCiudad(ciudad);
            return new ResponseEntity<>(actualizada, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/ciudad/{id}")
    public ResponseEntity<?> deleteCiudad(@PathVariable Integer id) {
        try {
            service.deleteCiudad(id);
            return new ResponseEntity<>("Ciudad eliminada", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/ciudad/dpto/{id}")
    public ResponseEntity<List<Ciudad>> getCiudadesPorDpto(@PathVariable Integer id) {
        List<Ciudad> ciudades = service.getCiudadesByDptoId(id);
        return new ResponseEntity<>(ciudades, HttpStatus.OK);
    }
}
