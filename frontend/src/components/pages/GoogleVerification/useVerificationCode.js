import { useState, useRef, useCallback } from 'react';

export const useVerificationCode = (codeLength = 6) => {
    const [code, setCode] = useState(Array(codeLength).fill(''));
    const [message, setMessage] = useState({ text: '', type: '' });
    const inputsRef = useRef([]);

    // Actualizar el código cuando cambia algún input
    const updateCode = useCallback((index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        return newCode;
    }, [code]);

    // Verificar si todos los campos están llenos
    const isCodeComplete = useCallback(() => {
        return code.every(digit => digit !== '');
    }, [code]);

    // Manejar el cambio en un input individual
    const handleInputChange = useCallback((index, value) => {
        // Permitir solo números
        if (!/^\d?$/.test(value)) return;

        const newCode = updateCode(index, value);
        
        // Auto-enfocar el siguiente input si se ingresó un dígito
        if (value && index < codeLength - 1) {
            inputsRef.current[index + 1]?.focus();
        }
        
        return newCode;
    }, [codeLength, updateCode]);

    // Manejar la tecla retroceso
    const handleKeyDown = useCallback((index, event) => {
        if (event.key === 'Backspace') {
            if (code[index] === '' && index > 0) {
                // Si está vacío, retroceder al anterior
                inputsRef.current[index - 1]?.focus();
            } else {
                // Limpiar el actual
                updateCode(index, '');
            }
        }
    }, [code, updateCode]);

    // Manejar el pegado de código completo
    const handlePaste = useCallback((event) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData('text');
        
        if (/^\d{6}$/.test(pastedText)) {
            const newCode = pastedText.split('').slice(0, codeLength);
            setCode(newCode);
            
            // Enfocar el último input
            setTimeout(() => {
                inputsRef.current[Math.min(newCode.length - 1, codeLength - 1)]?.focus();
            }, 0);
        }
    }, [codeLength]);

    // Limpiar el código
    const clearCode = useCallback(() => {
        setCode(Array(codeLength).fill(''));
        inputsRef.current[0]?.focus();
    }, [codeLength]);

    // Mostrar mensaje
    const showMessage = useCallback((text, type = '') => {
        setMessage({ text, type });
    }, []);

    // Ocultar mensaje
    const hideMessage = useCallback(() => {
        setMessage({ text: '', type: '' });
    }, []);

    return {
        code: code.join(''),
        codeArray: code,
        message,
        inputsRef,
        isCodeComplete: isCodeComplete(),
        handleInputChange,
        handleKeyDown,
        handlePaste,
        clearCode,
        showMessage,
        hideMessage,
        setInputRef: (index, element) => {
            inputsRef.current[index] = element;
        }
    };
};