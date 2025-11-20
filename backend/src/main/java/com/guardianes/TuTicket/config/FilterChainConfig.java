package com.guardianes.TuTicket.config;

import com.guardianes.TuTicket.servicioAutenticacion.filtros.JWTFilter;
import com.guardianes.TuTicket.servicioUsuarios.model.Rol;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
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
                    .requestMatchers(HttpMethod.GET, "/").permitAll()
                /*=================================
                       1. ENDPOINTS PÚBLICOS
                =================================*/
                    //Endpoints de autenticacion y registro
                    .requestMatchers(HttpMethod.POST,
                            "/api/login",
                            "/api/auth/google",
                            "/api/cliente/register",
                            "/api/organizador/register",
                            "/api/forgot-password",
                            "/api/reset-password"
                    ).permitAll()
                    // --- Endpoints de Consulta Pública (Solo GET) ---
                    .requestMatchers(HttpMethod.GET,
                            "/api/evento/**",
                            "/api/zona/**",
                            "/api/ciudad/**",
                            "/api/dpto/**",
                            "/api/temporada/**",
                            "/api/funcion/**",
                            "/api/catevento/**",
                            "/api/tarifa/**",
                            "/api/tipoentrada/**",
                            "/api/periodo/**",
                            "/api/zonaxfuncion/**"
                    ).permitAll()
                /*===============================================
                        2. Autenticados (roles específicos)
                ================================================*/
                    .requestMatchers(HttpMethod.GET, "/api/cliente/{id}").hasAnyRole(Rol.CLIENTE.name(), Rol.ORGANIZADOR.name(), Rol.ADMINISTRADOR.name())
                    .requestMatchers("/api/subirImagens3/**").hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.POST,
                            "/api/evento/**",
                            "/api/zona/**",
                            "/api/ciudad/**",
                            "/api/dpto/**",
                            "/api/funcion/**",
                            "/api/catevento/**"
                    ).hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.PUT, "/api/evento/**")
                    .hasRole(Rol.ORGANIZADOR.name())
                    .requestMatchers(HttpMethod.PUT, "/api/cliente/{id}", "/api/admin/{id}", "/api/organizador/{id}", "/api/params/**")
                    .hasRole(Rol.ADMINISTRADOR.name())
                    .requestMatchers(HttpMethod.GET,"/api/organizador/**")
                    .hasAnyRole(Rol.ORGANIZADOR.name(), Rol.ADMINISTRADOR.name())
                /*===============================================
                        3. Autenticados en general
                ================================================*/
                    .requestMatchers(
                            "/api/orden/**",
                            "/api/descuento/**"
                    ).authenticated()
                    .requestMatchers(HttpMethod.GET,
                            "/api/comp/**",
                            "/api/miticket/**",
                            "/api/ticket/**"
                    ).authenticated()
                    .requestMatchers("/api/usuario/**").authenticated()
                /*===============================================
                            4. Administrador
                ================================================*/
                    .requestMatchers("/api/cliente/**")
                    .hasRole(Rol.ADMINISTRADOR.name())

                     /*Regla catch-all todo lo demás bajo api es solo admin*/
                    .requestMatchers("/api/**")
                    .hasRole(Rol.ADMINISTRADOR.name())

                /*===============================================
                            5. Administrador (regla final, si hay alguna específica de rol agregar arriba)
                ================================================*/
                    .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
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
