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

  // Fecha de hoy
  const today = new Date().toISOString().slice(0, 10)

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
      console.log("Imágenes para el carrusel:", images)
      setHeroImages(images)
    }
  }, [eventos])
  // Valida fecha
  const inRange = (dateStr) => {
    if (!dateStr) return false
    const d = String(dateStr).slice(0, 10)
    if (d < today) return false
    if (fechaInicio && d < fechaInicio) return false
    if (fechaFin && d > fechaFin) return false
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
    const matchFecha = funciones.some((fn) => inRange(fn?.fechaInicio))

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
           <div className="hero-loading" style={{height: '100%', background: '#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <p>Cargando eventos destacados...</p>
           </div>
        )}
      </div>

    <div className="events-container">     
        <div className="section-header">
          <h2 className="section-title">Eventos Recomendados</h2>          
          <div className="title-underline"></div>
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