package com.guardianes.TuTicket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {
    //Leer la propiedad 'aws.region' de application.properties
    @Value("${aws.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                // Usa la región que leyó del archivo properties
                .region(Region.of(region))

                // ¡MUY IMPORTANTE!
                // Esto le dice al SDK que busque las credenciales
                // en el orden estándar:
                //   - Variables de Entorno (Para entorno local)
                //   - Archivo ~/.aws/credentials
                //   - Roles de IAM (Para despliegue en entorno de produccion)
                .credentialsProvider(DefaultCredentialsProvider.create())

                .build();
    }
}
