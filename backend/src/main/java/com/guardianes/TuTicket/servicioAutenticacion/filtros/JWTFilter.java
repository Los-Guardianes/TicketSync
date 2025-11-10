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

    /**
     * Prefijos PÚBLICOS. Deben coincidir con los que realmente son públicos
     * en tu FilterChainConfig. OJO: quitamos /api/ticket, /api/miticket y /api/comp.
     */
    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/api/login",
            "/api/auth/google",
            "/api/cliente",     // (solo POST / register es público; GET por id lo controla la chain)
            "/api/register",

            // Catálogos realmente públicos:
            "/api/evento",
            "/api/zona",
            "/api/ciudad",
            "/api/dpto",
            "/api/temporada",
            "/api/funcion",
            "/api/catevento",
            "/api/tarifa",
            "/api/tipoentrada",
            "/api/periodo"
    );

    private boolean isPublic(HttpServletRequest request) {
        String path = request.getServletPath();

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        for (String prefix : PUBLIC_PREFIXES) {
            if (path.startsWith(prefix)) return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("[JWTFilter] Path: " + path);

        if (isPublic(request)) {
            System.out.println("[JWTFilter] Ruta pública → skip JWT");
            chain.doFilter(request, response);
            return;
        } else {
            System.out.println("[JWTFilter] Ruta protegida → validar JWT");
        }

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

                String springRole = (rol == null) ? "ROLE_USER"
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
