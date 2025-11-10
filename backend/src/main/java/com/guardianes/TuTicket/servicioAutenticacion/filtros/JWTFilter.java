package com.guardianes.TuTicket.servicioAutenticacion.filtros;

import com.guardianes.TuTicket.servicioAutenticacion.service.JWTService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTService jwtService;

    // Prefijos públicos (rutas que no deberían pedir token / no deben botar 401)
    private static final List<String> PUBLIC_PREFIXES = List.of(
     "/api/login",
     "/api/auth/google",
     "/api/cliente",
     "/api/register",
     "/api/organizador",
     "/api/organizador/reporte/excel",
     "/api/evento",
     "/api/zona",
     "/api/ciudad",
     "/api/dpto",
     "/api/comp",
     "/api/miticket",
     "/api/temporada",
     "/api/funcion",
     "/api/orden",
     "/api/ticket",
     "/api/descuento" // <- IMPORTANTE para /api/descuento/evento/{id}/activos

    );

    private boolean isPublic(HttpServletRequest request) {
        String path = request.getServletPath(); // ej: "/api/descuento/evento/1/activos"

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        for (String prefix : PUBLIC_PREFIXES) {
            if (path.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        // 🔎 LOGS DE DEPURACIÓN (PASO 1)
        String path = request.getServletPath();
        System.out.println("[JWTFilter] Path recibido: " + path);

        if (isPublic(request)) {
            System.out.println("[JWTFilter] -> Ruta pública, skip JWT");
            chain.doFilter(request, response);
            return;
        } else {
            System.out.println("[JWTFilter] -> Ruta protegida, validar JWT");
        }

        // A partir de aquí es tu código original tal cual:
        String authHeader = request.getHeader("Authorization");
        System.out.println("[JWTFilter] Authorization header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // Extraer email
                String email = jwtService.getEmailFromToken(token);
                System.out.println("[JWTFilter] email extraído: " + email);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Extraer rol
                    String rol = jwtService.getRolFromToken(token);
                    System.out.println("[JWTFilter] rol extraído: " + rol);

                    UserDetails userDetails = User.builder()
                            .username(email)
                            .password("") // no importa
                            .authorities(Collections.singletonList(
                                    new SimpleGrantedAuthority(rol.toUpperCase())))
                            .build();

                    if (jwtService.validateToken(token)) {
                        System.out.println("[JWTFilter] token válido, seteando SecurityContext");
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }

            } catch (ExpiredJwtException ex) {
                System.out.println("[JWTFilter] token EXPIRADO");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"Token expirado. Por favor, inicie sesión nuevamente.\"}");
                return;
            } catch (JwtException ex) {
                System.out.println("[JWTFilter] token INVÁLIDO");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"Token inválido.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
