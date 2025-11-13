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

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("[JWTFilter] Path: " + path);

        String authHeader = request.getHeader("Authorization");
        System.out.println("[JWTFilter] Authorization: " + authHeader);

        // Si no hay Bearer → no autenticamos pero TAMPOCO bloqueamos aquí.
        // La seguridad posterior devolverá 401 si la ruta lo requiere.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtService.getEmailFromToken(token);
            String rol = jwtService.getRolFromToken(token); // p.ej. "ORGANIZADOR" / "CLIENTE" / "ADMINISTRADOR"
            System.out.println("[JWTFilter] email=" + email + ", rol(raw)=" + rol);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                String springRole = (rol == null)
                        ? "ROLE_CLIENTE" // Asigna el rol menos privilegiado si el rol es nulo
                        : (rol.toUpperCase().startsWith("ROLE_") ? rol.toUpperCase() : "ROLE_" + rol.toUpperCase());

                UserDetails userDetails = User.builder()
                        .username(email)
                        .password("") // no se usa aquí
                        .authorities(Collections.singletonList(new SimpleGrantedAuthority(springRole)))
                        .build();

                if (jwtService.validateToken(token)) {
                    System.out.println("[JWTFilter] token válido → set SecurityContext, authority=" + springRole);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            chain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            System.out.println("[JWTFilter] token EXPIRADO");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"Token expirado. Por favor, inicie sesión nuevamente.\"}");
        } catch (JwtException ex) {
            System.out.println("[JWTFilter] token INVÁLIDO");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"Token inválido.\"}");
        }
    }
}
