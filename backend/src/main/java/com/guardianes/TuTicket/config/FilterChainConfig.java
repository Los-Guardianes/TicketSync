package com.guardianes.TuTicket.config;

import com.amazonaws.HttpMethod;
import com.guardianes.TuTicket.servicioAutenticacion.filtros.JWTFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class FilterChainConfig {

    private final JWTFilter jwtFilter;

    //Esta variable tiene las rutas que serán públicas (no necesitan autenticación)
    private static final String[] PUBLIC_ENDPOINTS = {
            //Para la página de registro y loginh
            "/api/login",
             "/api/cliente",
            "/api/register",
            "/api/organizador",
            //Para la página del home
            "/api/evento/**",
            "/api/zona/**",
            "/api/ciudad/**",
            "/api/comp/**",
            "/api/miticket/**",
            "/api/temporada/**",
            "/api/funcion/**",
            "/api/ticket/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // Ojalá funcione xd
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()   // GET /api/evento también público
                        .anyRequest().authenticated()            // el resto requiere JWT
                )
                .httpBasic(withDefaults())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    AuthenticationProvider authenticationProvider(UserDetailsService uds, PasswordEncoder pwe) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(uds);
        provider.setPasswordEncoder(pwe);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        //return new BCryptPasswordEncoder(12);
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();

    }
}
