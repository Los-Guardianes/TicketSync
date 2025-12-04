import React from 'react';
import './PasswordStrengthIndicator.css';

export const PasswordStrengthIndicator = ({ password }) => {
    const criteria = [
        {
            id: 'length',
            label: 'Mínimo 8 caracteres',
            test: (pwd) => pwd.length >= 8
        },
        {
            id: 'uppercase',
            label: 'Al menos 1 letra mayúscula',
            test: (pwd) => /[A-Z]/.test(pwd)
        },
        {
            id: 'lowercase',
            label: 'Al menos 1 letra minúscula',
            test: (pwd) => /[a-z]/.test(pwd)
        },
        {
            id: 'number',
            label: 'Al menos 1 número',
            test: (pwd) => /[0-9]/.test(pwd)
        }
    ];

    return (
        <div className="password-strength-indicator">
            <p className="password-strength-title">Requisitos de seguridad:</p>
            <ul className="password-criteria-list">
                {criteria.map((criterion) => {
                    const isValid = criterion.test(password);
                    return (
                        <li
                            key={criterion.id}
                            className={`password-criterion ${isValid ? 'valid' : 'invalid'}`}
                        >
                            <span className="criterion-icon">
                                {isValid ? '✓' : '○'}
                            </span>
                            <span className="criterion-label">{criterion.label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// Función auxiliar para validar contraseña (exportable para usar en validación de formularios)
export const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Debe incluir al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Debe incluir al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Debe incluir al menos un número');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};
