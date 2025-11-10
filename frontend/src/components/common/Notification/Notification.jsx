import "./Notification.css"
import { useState, useEffect } from "react"

export const Notification = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">
        {type === "success" && "✔️"}
        {type === "error" && "❌"}
        {type === "info" && "ℹ️"}
      </div>
      <p className="notification-message">{message}</p>
      <button
        className="notification-close"
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  )
}
