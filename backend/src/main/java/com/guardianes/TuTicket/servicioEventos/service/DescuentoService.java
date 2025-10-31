package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.DescuentoOutDTO;
import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import com.guardianes.TuTicket.servicioEventos.repo.DescuentoRepo;
import com.guardianes.TuTicket.servicioExepciones.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DescuentoService {

    private final DescuentoRepo repo;

    public List<Descuento> getAllDescuentos() {
        return repo.findAll();
    }

    public Descuento getDescuentoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Descuento addDescuento(Descuento descuento) {
        return repo.save(descuento);
    }

    public Descuento updateDescuento(Descuento descuento) {
        return repo.save(descuento);
    }

    public void deleteDescuento(Integer id) {
        repo.deleteById(id);
    }

    public DescuentoOutDTO verificarCodigo(String codigo) {
        Optional<Descuento> descuento = repo.findByCodigo(codigo);
        if(descuento.isPresent()){
            return new DescuentoOutDTO(descuento.get());
        }else{
            throw new RecursoNoEncontradoException("Código de descuento no encontrado");
        }
    }

    public Integer actualizarUsoDescuento(Integer idDescuento){

    }
    public List<Descuento> getActivosByEvento(Integer idEvento) {
        return repo.findByEvento_IdEventoAndActivoTrueOrderByFechaInicioAsc(idEvento);
    }

}

