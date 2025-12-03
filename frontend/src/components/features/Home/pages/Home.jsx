"use client"

import { useState, useEffect } from "react"
import { Card } from "../components/Card"
// import { PrimImage } from "../components/PrimImage" // Ya no se usa
import { getEventos } from "../../../../globalServices/EventoService"
import { useOutletContext } from "react-router-dom"
import "./Home.css"

// --- IMPORTACIONES DE SWIPER ---
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"

export const Home = () => {
  const [eventos, setEventos] = useState([])
  const [heroImages, setHeroImages] = useState([])

  // Filtros que vienen de Layout/NavBar
  const { search, ubicacion, fechaInicio, fechaFin, categoria } = useOutletContext()

  // 1. Cargar eventos de la API
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventos()
        const eventosData = Array.isArray(data) ? data : []
        setEventos(eventosData)
      } catch (error) {
        console.error("Error cargando eventos:", error)
        setEventos([])
      }
    }
    fetchEventos()
  }, [])

  // 2. Actualizar imágenes del carrusel cuando lleguen los eventos
  useEffect(() => {
    // Solo si hay eventos, extraemos las imágenes
    if (eventos.length > 0) {
      const images = eventos
        .map((evento) => evento.urlImagen)
        .filter((url) => url && url.trim() !== "") // Filtra nulos y strings vacíos
      setHeroImages(images)
    }
  }, [eventos])

  // ✅ FIX: Valida si una función todavía no ha terminado (compara con hora de fin)
  const isEventoActivo = (funcion) => {
    if (!funcion?.fechaInicio) return false

    const ahora = new Date()

    // Usar fechaFin/horaFin si existen, sino usar fechaInicio/horaInicio
    const fechaFinFunc = funcion.fechaFin || funcion.fechaInicio
    const horaFinFunc = funcion.horaFin || funcion.horaInicio

    // Construir DateTime de fin
    const fechaHoraFin = new Date(`${fechaFinFunc}T${horaFinFunc}`)

    // El evento sigue activo si su hora de fin es futura
    if (fechaHoraFin < ahora) return false

    // Aplicar filtros de usuario
    const fechaInicioStr = String(funcion.fechaInicio).slice(0, 10)
    if (fechaInicio && fechaInicioStr < fechaInicio) return false
    if (fechaFin && fechaInicioStr > fechaFin) return false

    return true
  }

  // Aplicar filtros
  const eventosFiltrados = eventos.filter((evento) => {
    const matchActivo = evento?.activo !== false
    const matchSearch = !search || evento?.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchUbicacion = ubicacion === "Todas" || evento?.ciudad?.dpto?.nombre === ubicacion
    const matchCategoria =
      categoria === "Todas" ||
      (evento?.categoria?.nombre && evento.categoria.nombre.toLowerCase() === String(categoria).toLowerCase()) ||
      (evento?.categoria?.idCategoria && String(evento.categoria.idCategoria) === String(categoria))

    const funciones = Array.isArray(evento?.funciones) ? evento.funciones : []
    const matchFecha = funciones.some((fn) => isEventoActivo(fn))

    return matchActivo && matchSearch && matchUbicacion && matchCategoria && matchFecha
  })

  return (
    <>
      <div className="hero-carousel-container">
        {heroImages.length > 0 ? (
          <Swiper
            // 1. Quitamos Navigation de los modulos
            modules={[Autoplay, Pagination]}

            // 2. IMPORTANTE: Esto activa la lógica de "Imagen central principal"
            centeredSlides={true}
            loop={heroImages.length > 1}
            speed={800}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            // 3. Quitamos navigation={true}
            pagination={{ clickable: true }}
            className="heroSwiper"

            // 4. Configuración Responsive
            breakpoints={{
              // Móvil: mostramos un poco de los lados para invitar a deslizar
              0: {
                slidesPerView: 1.2,
                spaceBetween: 5,
                centeredSlides: true, // IMPORTANTE: Forzamos centrado aquí también
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 8,
                centeredSlides: true, // IMPORTANTE: Forzamos centrado aquí también
              },
              1024: {
                slidesPerView: 3, // Se verán 3: Izquierda(borrosa), Centro(nítida), Derecha(borrosa)
                spaceBetween: 15,
                centeredSlides: true, // IMPORTANTE: Forzamos centrado aquí también
              },
            }}
          >
            {heroImages.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="hero-slide-image"
                  style={{ backgroundImage: `url(${url})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="hero-loading" style={{ height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Cargando eventos destacados...</p>
          </div>
        )}
      </div>

      <div className="events-container">
        <div className="mis-tickets-header__content">
          <h1 className="mis-tickets-header__title">Eventos Recomendados</h1>
        </div>
      </div>

      <div className="events-container">
        <div className="events-grid">
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((evento) => (
              <Card
                key={evento.idEvento}
                id={evento.idEvento}
                ubicacion={evento.direccion}
                titulo={evento.nombre}
                fecha={evento.funciones?.[0]?.fechaInicio || "Sin fecha definida"}
                ulrimagen={evento.urlImagen}
              />
            ))
          ) : (
            <p className="no-events-message">No hay eventos disponibles.</p>
          )}
        </div>
      </div>
    </>
  )
}