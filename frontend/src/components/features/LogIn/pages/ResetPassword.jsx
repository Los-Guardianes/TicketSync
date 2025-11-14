import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../globalServices/API";
import { useNotification } from "../../../../context/NotificationContext"
import "./ResetPassword.css";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { 
        showNotification 
    } = useNotification()
    // Obtener el token del query param
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const postResetPassword = async ({ token, newPassword }) => {
        return apiFetch("/api/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, newPassword }),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();        

        if (form.newPassword !== form.confirmPassword) {
            showNotification("Las contraseñas debe de coincidr", "error")
            return;
        }

        try {
            setIsLoading(true);
            console.log("Token: ", token)
            const data = await postResetPassword({
                token: token,
                newPassword: form.newPassword,
            });
            /*
            // Si tu backend devuelve el token y usuario (como sugerimos antes)
            if (data.token) {
                // Guardar sesión y redirigir
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        token: data.token,
                        email: data.email,
                        rol: data.rol,
                    })
                );

                setMessage({
                    text: "Contraseña actualizada correctamente. Iniciando sesión...",
                    type: "success",
                });

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                // Si solo devuelve un mensaje genérico

                setMessage({
                    text: data.message || "Contraseña actualizada correctamente",
                    type: "success",
                });
                setTimeout(() => navigate("/login"), 2500);
            }
            */
           showNotification("Contraseña actualizada correctamente", "success")
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            showNotification("La sesión para cambiar su contraseña caducó, intentelo nuevamente.", "error")
            //navigate("/forgot-password")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-form">
                <img
                    className="login-logo"
                    src="/tuticket_logo.png"
                    alt="TuTicket Logo"
                />
                <h2>Restablecer contraseña</h2>
                <p>Ingresa tu nueva contraseña.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        name="newPassword"
                        className="input-form"
                        placeholder="Nueva contraseña"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        className="input-form"
                        placeholder="Confirmar contraseña"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />

                    <button
                        type="button"
                        className="btn btn-secondary btn-lg mt-3"
                        onClick={() => navigate("/login")}
                    >
                        Volver al login
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg mt-3"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Actualizando..."
                            : "Actualizar contraseña"}
                    </button>
                </form>
            </div>
        </div>
    );
};
