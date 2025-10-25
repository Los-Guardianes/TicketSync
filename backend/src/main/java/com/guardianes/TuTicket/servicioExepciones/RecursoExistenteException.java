package com.guardianes.TuTicket.servicioExepciones;

public class RecursoExistenteException extends RuntimeException {
    public RecursoExistenteException(String message) {
        super(message);
    }
}
