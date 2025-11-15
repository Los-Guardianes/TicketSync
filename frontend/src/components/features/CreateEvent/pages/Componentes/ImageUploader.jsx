// ./Componentes/ImageUploader.jsx
import { useEffect, useMemo } from "react";

/**
 * Props:
 * - file: File|null                     // archivo seleccionado
 * - dragActive: boolean                 // estado visual de drag & drop
 * - onInputChange(file|null): void      // cuando se elige archivo por input
 * - onRemove(): void                    // limpiar archivo
 * - onDragEnter(e), onDragLeave(e), onDragOver(e), onDrop(e): void  // DnD handlers
 * - inputRef?: React.RefObject<HTMLInputElement>  // opcional, para controlar el <input> desde el padre
 * - label?: string                      // texto del label
 * - accept?: string                     // ej. "image/*"
 */
export const ImageUploader = ({
    file,
    dragActive,
    onInputChange,
    onRemove,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    inputRef,
    label = "Imagen (836px x 522px)",
    accept = "image/*",
}) => {
    // URL de preview (se recalcula cuando cambia "file")
    const previewUrl = useMemo(() => {
        if (!file) return null;
        const url = URL.createObjectURL(file);
        return url;
    }, [file]);

    // Limpia el objectURL cuando cambie/limpie el archivo
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Helpers para prevenir el comportamiento por defecto en DnD
    const wrap = (fn) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        fn?.(e);
    };

    const openFileDialog = () => inputRef?.current?.click();

    const handleInputChange = (e) => {
        const chosen = e.target.files?.[0] ?? null;
        onInputChange?.(chosen);
    };

    return (
        <div className="campo">
            <div className="section-title">Imagen del Evento</div>
            <label htmlFor="imagen">{label}</label>

            <div
                className={`imagen-placeholder${dragActive ? " drag-active" : ""}`}
                onClick={openFileDialog}
                onDragEnter={wrap(onDragEnter)}
                onDragLeave={wrap(onDragLeave)}
                onDragOver={wrap(onDragOver)}
                onDrop={wrap(onDrop)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFileDialog()}
                style={{ cursor: "pointer", position: "relative" }}
                aria-label="Subir imagen del evento"
            >
                {previewUrl ? (
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "180px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={previewUrl}
                            alt="Vista previa"
                            style={{
                                maxWidth: "300px",
                                maxHeight: "160px",
                                objectFit: "contain",
                                borderRadius: "8px",
                                margin: "0 auto",
                            }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove?.();
                            }}
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                background: "#fff",
                                color: "#d32f2f",
                                border: "1px solid #d32f2f",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                zIndex: 3,
                            }}
                            title="Eliminar imagen"
                            aria-label="Eliminar imagen"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    !dragActive && (
                        <span style={{ color: "#219653", fontWeight: 500, fontSize: "1.2rem" }}>
                            Presione o arrastre aquí para subir una imagen
                        </span>
                    )
                )}

                <input
                    id="imagen"
                    type="file"
                    accept={accept}
                    ref={inputRef}
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                />

                {dragActive && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(33,150,83,0.08)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#219653",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            zIndex: 2,
                        }}
                    >
                        Suelta la imagen aquí
                    </div>
                )}
            </div>
        </div>
    );
};
