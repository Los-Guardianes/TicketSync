// NotificationContext.jsx
import { createContext, useContext, useState, useCallback } from "react"
import { Notification } from "./../components/common/Notification/Notification"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = useCallback((message, type, duration = 3000) => {
    const id = Date.now()
    const newNotification = { id, message, type, duration }

    setNotifications(prev => [...prev, newNotification])

    // Auto-eliminar luego de `duration`
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, duration)
    }
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(n => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            duration={n.duration}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

// Custom hook para acceder fácilmente
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error("useNotification debe usarse dentro de un NotificationProvider")
  return context
}
