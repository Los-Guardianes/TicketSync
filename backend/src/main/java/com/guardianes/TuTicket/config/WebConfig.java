package com.guardianes.TuTicket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        // ✅ FIX: Sin slash final para Opera GX y otros navegadores estrictos
                        .allowedOrigins(
                                "http://localhost:5173",
                                "https://localhost:5173",
                                "https://tuticket.space",
                                "https://www.tuticket.space")
                        // .allowedOrigins("http://54.226.239.40:80","http://54.226.239.40") // frontend
                        // en la nube
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}