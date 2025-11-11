package com.guardianes.TuTicket.servicioS3.controller;

import com.guardianes.TuTicket.servicioS3.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:3000")
public class SubidaArchivoController {
    //@Autowired
    private final S3Service s3Service;
    public SubidaArchivoController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/subirImagens3")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = s3Service.uploadFile(file);
            //Devolver JSON un JSON con la URL
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al subir el archivo: " + e.getMessage());
        }
    }
}
