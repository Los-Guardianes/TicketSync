package com.guardianes.TuTicket.config;

import com.guardianes.TuTicket.servicioAutenticacion.filtros.JWTFilter;
import com.guardianes.TuTicket.servicioUsuarios.model.Rol;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class FilterChainConfig {

    private final JWTFilter jwtFilter;

    // Rutas públicas (no requieren autenticación)
    private static final String[] PUBLIC_ENDPOINTS = {
            // Auth / registro
            "/api/login",
            "/api/auth/google",
            "/api/cliente",
            "/api/register",

            // Catálogos y consultas públicas
            "/api/evento/**",
            "/api/zona/**",
            "/api/ciudad/**",
            "/api/dpto/**",
            "/api/temporada/**",
            "/api/funcion/**",
            "/api/catevento/**",
            "/api/tarifa/**",
            "/api/tipoentrada/**",
            "/api/periodo/**"

            /* En caso error inesperado, descomentar esta línea
            "/api/cliente/**",
            "/api/organizador",
            "/api/organizador/reporte/excel", // Cambiar luego si es público o no
            "/api/miticket/**", //descargar ticket
            "/api/orden/**",
            "/api/ticket/**",
            "/api/descuento/**",
            "/api/subirImagens3/**"
             */
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults())
            .headers(headers ->
                    headers.addHeaderWriter(new StaticHeadersWriter(
                            "Cross-Origin-Opener-Policy", "same-origin-allow-popups"
                    ))
            )
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers(HttpMethod.GET,PUBLIC_ENDPOINTS).permitAll()
                    .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/cliente").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/login/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/google").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/register/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/cliente/{id}").hasAnyRole("CLIENTE", "ORGANIZADOR")
                    .requestMatchers("/api/cliente/**").hasAnyRole("ADMINISTRADOR", "ORGANIZADOR")
                    .requestMatchers(HttpMethod.GET,"/api/organizador/**").hasAnyRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.GET,"/api/comp/**").authenticated()
                    .requestMatchers(HttpMethod.GET,"/api/miticket/**").authenticated()
                    .requestMatchers("/api/orden/**").authenticated()
                    .requestMatchers(HttpMethod.GET ,"/api/ticket/**").authenticated()
                    .requestMatchers("/api/descuento/**").authenticated()
                    .requestMatchers("/api/subirImagens3/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.POST,"/api/evento/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.POST,"/api/zona/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.POST,"/api/ciudad/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.POST,"/api/dpto/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.POST,"/api/funcion/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.POST,"/api/catevento/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers("/api/**").hasRole(Rol.ADMINISTRADOR.name())
                    .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
//            .httpBasic(withDefaults())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationProvider authenticationProvider(UserDetailsService uds, PasswordEncoder pwe) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(uds);
        provider.setPasswordEncoder(pwe);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Para producción, usar BCrypt:
        // return new BCryptPasswordEncoder(12);
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
