package com.guardianes.TuTicket.servicioS3.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL; // Para hacerlo público
import software.amazon.awssdk.services.s3.model.GetUrlRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {
    private final S3Client s3Client;
    //Leer el nombre del bucket de application.properties
    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Autowired
    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    // SUBIR UN ARCHIVO S3 Y DEVOLVER LA URL PÚBLICA

    public String uploadFile(MultipartFile file) throws IOException {

        //Generar un nombre de archivo único
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        //Crear la solicitud de subida (PutObjectRequest)
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .build();

        //Subir el archivo
        s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        //Obtener la URL del objeto recién subido
        GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .build();

        return s3Client.utilities().getUrl(getUrlRequest).toString();
    }
}
