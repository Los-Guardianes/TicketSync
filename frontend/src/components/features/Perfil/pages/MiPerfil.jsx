// src/components/features/Perfil/pages/MiPerfil.jsx
import React, { useState } from "react";
import "./MiPerfil.css";
import { useAuth } from "../../../../context/AuthContext";

export const MiPerfil = () => {
    const { user, token } = useAuth();

    const nombre = user?.nombre || "";
    const apellido = user?.apellido || "";
    const email = user?.email || "";
    const telefono = user?.telefono || "";
    const ciudad = user?.ciudad || "";
    const departamento = user?.departamento || "";
    const rol = user?.rol || "";

    // --- ESTADO DEL MODAL DE CONTRASEÑA ---
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [pwdForm, setPwdForm] = useState({
        actual: "",
        nueva: "",
        confirmar: "",
    });
    const [pwdError, setPwdError] = useState("");
    const [pwdSuccess, setPwdSuccess] = useState("");
    const [pwdLoading, setPwdLoading] = useState(false);

    const openPasswordModal = () => {
        setPwdForm({ actual: "", nueva: "", confirmar: "" });
        setPwdError("");
        setPwdSuccess("");
        setShowPwdModal(true);
    };

    const closePasswordModal = () => {
        if (pwdLoading) return;
        setShowPwdModal(false);
    };

    const handlePwdInputChange = (e) => {
        const { name, value } = e.target;
        setPwdForm((prev) => ({ ...prev, [name]: value }));
        setPwdError("");
        setPwdSuccess("");
    };

    const handleSubmitPasswordChange = async (e) => {
        e.preventDefault();
        setPwdError("");
        setPwdSuccess("");

        if (!pwdForm.actual || !pwdForm.nueva || !pwdForm.confirmar) {
            setPwdError("Todos los campos son obligatorios.");
            return;
        }

        if (pwdForm.nueva.length < 6) {
            setPwdError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (pwdForm.nueva !== pwdForm.confirmar) {
            setPwdError("La confirmación no coincide con la nueva contraseña.");
            return;
        }

        try {
            setPwdLoading(true);

            const response = await fetch(
                "https://api.tuticket.space/api/usuario/cambiar-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        idUsuario: user.idUsuario,
                        passwordActual: pwdForm.actual,
                        nuevaPassword: pwdForm.nueva,
                    }),
                }
            );

            // Leer como texto para no reventar si el body está vacío
            const text = await response.text();
            let result = {};
            if (text) {
                try {
                    result = JSON.parse(text);
                } catch {
                    result = {};
                }
            }

            if (!response.ok) {
                if (response.status === 403) {
                    setPwdError(
                        result.message ||
                        "No tienes permisos para cambiar la contraseña."
                    );
                } else {
                    setPwdError(
                        result.message || "No se pudo cambiar la contraseña."
                    );
                }
                return;
            }

            setPwdSuccess(result.message || "¡Contraseña cambiada con éxito!");
            // opcional: cerrar modal después de 1.5s
            // setTimeout(() => setShowPwdModal(false), 1500);

        } catch (err) {
            console.error(err);
            setPwdError("Error de conexión. Intenta nuevamente.");
        } finally {
            setPwdLoading(false);
        }
    };



    return (
        <div className="perfil-page">

            {/* Contenido principal del perfil */}
            <div className="perfil-wrapper">
                <div className="perfil-header">
                    <h1 className="perfil-title">Mi Perfil</h1>
                </div>

                <div className="perfil-card">
                    {/* Avatar */}
                    <div className="perfil-avatar-wrapper">
                        <div className="perfil-avatar">
                            <span className="perfil-avatar-icon">👤</span>
                        </div>
                    </div>

                    {/* Rol */}
                    <div className="perfil-status-row">
                        <span className="perfil-rol-pill">{rol}</span>
                    </div>

                    {/* Datos */}
                    <div className="perfil-form">
                        <div className="perfil-row">
                            <div className="perfil-field">
                                <label className="perfil-label">Nombres</label>
                                <input
                                    type="text"
                                    className="perfil-input"
                                    value={nombre}
                                    disabled
                                />
                            </div>

                            <div className="perfil-field">
                                <label className="perfil-label">Apellidos</label>
                                <input
                                    type="text"
                                    className="perfil-input"
                                    value={apellido}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="perfil-row">
                            <div className="perfil-field">
                                <label className="perfil-label">Email</label>
                                <input
                                    type="email"
                                    className="perfil-input"
                                    value={email}
                                    disabled
                                />
                            </div>

                            <div className="perfil-field">
                                <label className="perfil-label">Teléfono</label>
                                <input
                                    type="text"
                                    className="perfil-input"
                                    value={telefono}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="perfil-row">
                            <div className="perfil-field">
                                <label className="perfil-label">Departamento</label>
                                <input
                                    type="text"
                                    className="perfil-input"
                                    value={departamento}
                                    disabled
                                />
                            </div>

                            <div className="perfil-field">
                                <label className="perfil-label">Ciudad</label>
                                <input
                                    type="text"
                                    className="perfil-input"
                                    value={ciudad}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="perfil-row">
                            <div className="perfil-field">
                                <label className="perfil-label">Contraseña</label>
                                <button
                                    type="button"
                                    className="perfil-btn-change-pass"
                                    onClick={openPasswordModal}
                                >
                                    Cambiar contraseña
                                </button>
                            </div>
                            <div />
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CAMBIO DE CONTRASEÑA */}
            {showPwdModal && (
                <div className="perfil-modal-overlay">
                    <div className="perfil-modal">
                        <h2 className="perfil-modal-title">Cambiar contraseña</h2>

                        <form onSubmit={handleSubmitPasswordChange}>
                            <div className="perfil-modal-field">
                                <label className="perfil-label">Contraseña actual</label>
                                <input
                                    type="password"
                                    name="actual"
                                    className="perfil-input"
                                    value={pwdForm.actual}
                                    onChange={handlePwdInputChange}
                                    disabled={pwdLoading}
                                />
                            </div>

                            <div className="perfil-modal-field">
                                <label className="perfil-label">Nueva contraseña</label>
                                <input
                                    type="password"
                                    name="nueva"
                                    className="perfil-input"
                                    value={pwdForm.nueva}
                                    onChange={handlePwdInputChange}
                                    disabled={pwdLoading}
                                />
                            </div>

                            <div className="perfil-modal-field">
                                <label className="perfil-label">Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    name="confirmar"
                                    className="perfil-input"
                                    value={pwdForm.confirmar}
                                    onChange={handlePwdInputChange}
                                    disabled={pwdLoading}
                                />
                            </div>

                            {pwdError && <div className="perfil-modal-error">{pwdError}</div>}
                            {pwdSuccess && (
                                <div className="perfil-modal-success">{pwdSuccess}</div>
                            )}

                            <div className="perfil-modal-actions">
                                <button
                                    type="button"
                                    className="perfil-modal-btn secundario"
                                    onClick={closePasswordModal}
                                    disabled={pwdLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="perfil-modal-btn primario"
                                    disabled={pwdLoading}
                                >
                                    {pwdLoading ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
