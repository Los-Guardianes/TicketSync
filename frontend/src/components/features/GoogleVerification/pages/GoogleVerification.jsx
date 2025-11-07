import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerificationCode } from '../services/useVerificationCode';
import { verificationService } from '../services/verificationService';
import './GoogleVerification.css';

export const GoogleVerification = () => {
    const correo = "luisizarra@gmail.com";
    const navigate = useNavigate();

    const {
        codeArray,
        message,
        inputsRef,
        isCodeComplete,
        handleInputChange,
        handleKeyDown,
        handlePaste,
        clearCode,
        showMessage,
        hideMessage,
        setInputRef
    } = useVerificationCode(6);

    // Efecto para enfocar el primer input al cargar
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    // Manejar la verificación del código
    const handleVerification = async (e) => {
        e.preventDefault();
        const code = codeArray.join('');
        
        try {
            const result = await verificationService.verifyCode(code, correo);
            
            if (result.success) {
                showMessage(result.message, 'success');
                // Deshabilitar inputs después de verificación exitosa
                inputsRef.current.forEach(input => {
                    if (input) input.disabled = true;
                });
                setTimeout(() => {
                    navigate('/');// Volver al inicio
                }, 1500);
            } else {
                showMessage(result.message, 'error');
                clearCode();
                setTimeout(() => {
                    hideMessage();
                }, 3000);
            }
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            showMessage('Error al verificar el código. Por favor, intenta nuevamente.', 'error');
            clearCode();
        }
    };

    // Manejar el reenvío del código
    const handleResendCode = async (e) => {
        e.preventDefault();
        try {
            const result = await verificationService.resendCode(correo);
            showMessage(result.message, 'success');
            clearCode();
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                hideMessage();
            }, 3000);
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            showMessage('Error al reenviar el código. Por favor, intenta nuevamente.', 'error');
        }
    };

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isCodeComplete) {
            handleVerification();
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <img className='login-logo' src="/tuticket_logo.png" alt="TuTicket Logo" />
            
                <h2>Verificación por correo</h2>
                <p>Por su seguridad, hemos enviado un código de verificación al correo ingresado que expira en 15 minutos.</p>
                <p>Introduce el código de 6 dígitos</p>

                <form id="verificationForm" className="digit-code" onSubmit={handleSubmit}>
                    <h3 className="input-form">{correo}</h3>
                    
                    <div className="code-inputs">
                        {codeArray.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => setInputRef(index, el)}
                                type="text"
                                className={`code-input ${digit ? 'filled' : ''}`}
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                onFocus={(e) => e.target.select()}
                            />
                        ))}
                    </div>
                    
                    {/* Input oculto para mejorar la experiencia de pegado en móviles */}
                    <input 
                        type="text" 
                        className="hidden-input" 
                        maxLength="6"
                        onChange={(e) => {
                            if (/^\d{6}$/.test(e.target.value)) {
                                handlePaste({ 
                                    preventDefault: () => {}, 
                                    clipboardData: { getData: () => e.target.value } 
                                });
                                e.target.value = '';
                            }
                        }}
                    />
                </form>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                
                <button
                    className='btn-primary btn-lg mt-3' 
                    onClick={handleVerification}
                    disabled={!isCodeComplete}
                >
                    Verificar
                </button>
                
                <a className='btn btn-secondary btn-lg mt-3' href="/login">
                    Cancelar
                </a>

                <div className="bottom-login">
                    <p>¿No recibiste el código?</p>
                    <button className="btn link-form" onClick={handleResendCode}>
                        Reenviar
                    </button>
                </div>
            </div>
        </div>
    );
};