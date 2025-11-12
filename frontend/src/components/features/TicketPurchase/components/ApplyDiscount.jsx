"use client"

import "./ApplyDiscount.css"
import { useState } from "react"

export const ApplyDiscount = ({
  formData,
  descuentoCodigo,
  handleFormData,
  handleDeleteDiscount,
  handleAplicarCodigo,
  setNotification,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleApplyClick = async (e) => {
    setIsLoading(true)
    setMessage(null)

    try {
      await handleAplicarCodigo(e, formData.discount, setNotification)
      setMessage({ type: "success", text: "Código aplicado correctamente" })

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage({ type: "error", text: "Error al aplicar el código" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveClick = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      await handleDeleteDiscount()
      setMessage({ type: "success", text: "Código removido" })
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage({ type: "error", text: "Error al remover el código" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="apply-discount-container">
        <div className="apply-discount-header">
          <h2>Canjear código de descuento</h2>
          <p>Ingresa tu código promocional para obtener descuentos especiales</p>
        </div>

        <div className="apply-discount-form">
          <div className="apply-discount-input-group">
            <input
              className={`apply-discount-input ${
                descuentoCodigo ? "apply-discount-input--disabled" : ""
              } ${message?.type === "error" ? "apply-discount-input--error" : ""} 
              ${message?.type === "success" ? "apply-discount-input--success" : ""}`}
              name="discount"
              placeholder="Ej: VERANO2024"
              maxLength={100}
              value={formData.discount}
              onChange={handleFormData}
              disabled={descuentoCodigo || isLoading}
            />

            {!descuentoCodigo ? (
              <button
                type="button"
                className="apply-discount-button apply-discount-button--apply"
                onClick={handleApplyClick}
                disabled={isLoading || !formData.discount.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="apply-discount-spinner"></span>
                    Aplicando...
                  </>
                ) : (
                  <>
                    Aplicar
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                className="apply-discount-button apply-discount-button--remove"
                onClick={handleRemoveClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="apply-discount-spinner"></span>
                    Removiendo...
                  </>
                ) : (
                  <>
                    <span className="apply-discount-icon">×</span>
                    Remover
                  </>
                )}
              </button>
            )}
          </div>
        </div>
    </article>
  )
}
