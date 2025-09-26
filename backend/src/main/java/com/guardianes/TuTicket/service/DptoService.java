package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.Dpto;
import com.guardianes.TuTicket.repo.DptoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DptoService {

    @Autowired
    private DptoRepo repo;

    public List<Dpto> getAllDptos() {
        return repo.findAll();
    }

    public Dpto getDptoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Dpto addDpto(Dpto dpto) {
        return repo.save(dpto);
    }

    public Dpto updateDpto(Dpto dpto) {
        return repo.save(dpto);
    }

    public void deleteDpto(Integer id) {
        repo.deleteById(id);
    }
}
