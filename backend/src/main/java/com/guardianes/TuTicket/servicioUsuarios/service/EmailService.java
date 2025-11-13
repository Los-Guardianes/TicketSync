package com.guardianes.TuTicket.servicioUsuarios.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username}")
    private String myEmail;


    public void sendResetPasswordEmail(String to, String token) {
        String resetUrl = frontendBaseUrl + "/reset-password?token=" + token;

        String subject = "Restablece tu contraseña - TuTicket";
        String content = """
                <p>Hola,</p>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Haz clic en el siguiente enlace para continuar:</p>
                <p><a href="%s">Restablecer contraseña</a></p>
                <br/>
                <p>Si no solicitaste esto, ignora este mensaje.</p>
                """.formatted(resetUrl);

        sendHtmlEmail(to, subject, content);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(myEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo", e);
        }
    }
}
