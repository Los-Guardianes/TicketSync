package com.guardianes.TuTicket.servicioExepciones;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExcepcionHandler {

    private Map<String, Object> construirRespuesta
                                ( RuntimeException ex, HttpStatus status,
                                  WebRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", ex.getMessage());
        response.put("exception", ex.getClass().getSimpleName());
        response.put("path", request.getDescription(false).replace("uri=", ""));
        return response;
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String,Object>> handleRecursoNoEncontradoException(RecursoNoEncontradoException ex, WebRequest request) {
        return new ResponseEntity<>(construirRespuesta(ex,HttpStatus.NOT_FOUND,request), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RecursoExistenteException.class)
    public ResponseEntity<Map<String, Object>> handleRecursoExistente(RecursoExistenteException ex, WebRequest request) {
        return new ResponseEntity<>(
                construirRespuesta(ex, HttpStatus.CONFLICT, request), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DatosInvalidosException.class)
    public ResponseEntity<Map<String, Object>> handleDatosInvalidos(DatosInvalidosException ex, WebRequest request) {
        return new ResponseEntity<>(construirRespuesta(ex, HttpStatus.BAD_REQUEST, request), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OperacionNoPermitidaException.class)
    public ResponseEntity<Map<String, Object>> handleOperacionNoPermitida(OperacionNoPermitidaException ex, WebRequest request) {
        return new ResponseEntity<>(construirRespuesta(ex, HttpStatus.FORBIDDEN, request), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(LogicaNegocioException.class)
    public ResponseEntity<Map<String, Object>> handleLogicaNegocio(LogicaNegocioException ex, WebRequest request) {
        return new ResponseEntity<>(construirRespuesta(ex, HttpStatus.CONFLICT, request), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccessException(LogicaNegocioException ex, WebRequest request) {
        return new ResponseEntity<>(construirRespuesta(ex, HttpStatus.INTERNAL_SERVER_ERROR, request), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(GenericException.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(GenericException ex, WebRequest request) {
        return new ResponseEntity<>(construirRespuesta(ex, HttpStatus.INTERNAL_SERVER_ERROR, request), HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}