package com.guardianes.TuTicket.servicioExepciones;

public class LogicaNegocioException extends RuntimeException {
    public LogicaNegocioException(String message) {
        super(message);
    }
}
