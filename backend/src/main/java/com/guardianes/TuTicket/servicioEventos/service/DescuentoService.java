package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import com.guardianes.TuTicket.servicioEventos.repo.DescuentoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
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

    public Descuento verificarCodigo(String codigo) throws NameNotFoundException {
        Optional<Descuento> descuento = repo.findByCodigo(codigo);
        if(descuento.isPresent()){
            return descuento.get();
        }else{
            throw new NameNotFoundException("Código de descuento no encontrado");
        }
    }

    public List<Descuento> getActivosByEvento(Integer idEvento) {
        return repo.findByEvento_IdEventoAndActivoTrueOrderByFechaInicioAsc(idEvento);
    }

}

