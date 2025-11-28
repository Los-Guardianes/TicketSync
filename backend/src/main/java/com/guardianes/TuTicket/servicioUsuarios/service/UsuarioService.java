package com.guardianes.TuTicket.servicioUsuarios.service;

import com.guardianes.TuTicket.servicioAutenticacion.service.JWTService;
import com.guardianes.TuTicket.servicioExepciones.OperacionNoPermitidaException;
import com.guardianes.TuTicket.servicioExepciones.RecursoNoEncontradoException;
import com.guardianes.TuTicket.servicioUsuarios.DTO.in.ForgotPasswordDTO;
import com.guardianes.TuTicket.servicioUsuarios.DTO.in.ResetPasswordDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.repo.UsuarioRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepo repo;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public List<Usuario> getAllUsuarios() {
        return repo.findAll();
    }

    public Usuario getUsuarioById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Usuario getUsuarioByEmail(String email) { return repo.findByEmail(email).orElse(null); }

    public Usuario getUsuarioByTelefono(String telefono) { return repo.findByTelefono(telefono).orElse(null); }

    public Usuario addUsuario(Usuario usuario) {
        return repo.save(usuario);
    }

    public Usuario updateUsuario(Usuario usuario) {
        return repo.save(usuario);
    }

    public void deleteUsuario(Integer id) {
        repo.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String email){
        Optional<Usuario> u = repo.findByEmail(email);
        if(u.isPresent()) {
            return u.get();
        }
        throw new UsernameNotFoundException("No se encontró al usuario con email: " + email);
    }

    public String forgotPassword(ForgotPasswordDTO request) {
        String email = request.getEmail();
        Optional<Usuario> u = repo.findByEmail(email);
        if(u.isEmpty())throw new RecursoNoEncontradoException("No se encontró al usuario con email: " + email);
        String resetToken = jwtService.generateResetPasswordToken(email);
        emailService.sendResetPasswordEmail(email, resetToken);
        System.out.println("Reset Token: " + resetToken);
        return resetToken;
    }

    @Transactional
    public Usuario resetPassword(ResetPasswordDTO request) {
        boolean validToken = jwtService.validateToken(request.getToken());
        if (!validToken) {
            throw new OperacionNoPermitidaException("El token no es válido");
        }

        String email = jwtService.getEmailFromToken(request.getToken());
        Usuario usuario = repo.findByEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró al usuario con email: " + email));

        String hashedPassword = passwordEncoder.encode(request.getNewPassword());
        usuario.setHashCtr(hashedPassword);
        return usuario;
    }
}
