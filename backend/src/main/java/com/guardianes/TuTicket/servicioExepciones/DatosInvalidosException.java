package com.guardianes.TuTicket.servicioExepciones;

public class DatosInvalidosException extends RuntimeException {
    public DatosInvalidosException(String message) {
        super(message);
    }
}
