import React from 'react';
import './VerificationModal.css'; // We'll create a simple CSS for it or use Bootstrap classes

export const VerificationModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header bg-warning text-dark">
                        <h5 className="modal-title">Cuenta no verificada</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center p-4">
                        <div className="mb-3">
                            <span style={{ fontSize: '3rem' }}>⚠️</span>
                        </div>
                        <p className="fs-5">Usted no se encuentra verificado.</p>
                        <p className="text-muted">El equipo de <strong>TuTicket</strong> está trabajando para verificar su cuenta.</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-primary" onClick={onClose}>
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
