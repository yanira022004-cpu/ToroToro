import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = "pk.eyJ1IjoidXNvcGRldiIsImEiOiJjbWd2ZW1ubGkwcW5xMm5uYXhtb2ptZHF4In0.OE8nb_G4PE0_PduKWdjunw"

export const Mapa3d = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [servicios, setServicios] = useState([])
  const [atractivos, setAtractivos] = useState([])
  const [tracks, setTracks] = useState([])
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [atractivoSeleccionado, setAtractivoSeleccionado] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupType, setPopupType] = useState('') // 'servicio' o 'atractivo'
  const popupRef = useRef(null)

  useEffect(() => {
    const fetchAtractivos = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/atractivo_coords")
        const data = await res.json()
        setAtractivos(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAtractivos()
  }, [])

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/servicio_coords")
        const data = await res.json()
        setServicios(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchServicios()
  }, [])

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/track_toro_toro")
        const data = await res.json()
        setTracks(data)
      } catch (error) {
        console.error("Error obteniendo tracks:", error)
      }
    }

    fetchTracks()
  }, [])

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-65.76089878880695, -18.133500687445764],
      zoom: 14.5,
      pitch: 70,
      bearing: -17.6,
      antialias: true,
    })

    map.current.on("load", () => {
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      })

      map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 })

      map.current.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      })

      const layers = map.current.getStyle().layers
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      )?.id

      map.current.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"]
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      )

      if (tracks.features && tracks.features.length > 0) {
        addTracksToMap()
      }
    })
  }, [])

  const addTracksToMap = () => {
    if (!map.current || !tracks.features) return

    if (map.current.getLayer("tracks-layer")) {
      map.current.removeLayer("tracks-layer")
    }
    if (map.current.getLayer("tracks-glow")) {
      map.current.removeLayer("tracks-glow")
    }
    if (map.current.getSource("tracks")) {
      map.current.removeSource("tracks")
    }

    map.current.addSource("tracks", {
      type: "geojson",
      data: tracks,
    })

    map.current.addLayer({
      id: "tracks-layer",
      type: "line",
      source: "tracks",
      paint: {
        "line-color": "#ff0000",
        "line-width": 5,
        "line-opacity": 0.9,
        "line-offset": 1
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
    })

    map.current.addLayer({
      id: "tracks-glow",
      type: "line",
      source: "tracks",
      paint: {
        "line-color": "#3b82f6",
        "line-width": 8,
        "line-opacity": 0.3,
        "line-blur": 2,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
    })
  }

  // Agregar servicios como capas vectoriales
  const addServiciosToMap = () => {
    if (!map.current || !servicios.length) return

    if (map.current.getLayer('servicios-layer')) {
      map.current.removeLayer('servicios-layer')
    }
    if (map.current.getSource('servicios')) {
      map.current.removeSource('servicios')
    }

    const serviciosGeoJSON = {
      type: 'FeatureCollection',
      features: servicios.map(servicio => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [servicio.longitud, servicio.latitud]
        },
        properties: {
          id: servicio.id_servicio,
          nombre: servicio.nombre_servicio,
          tipo_servicio: servicio.tipo_servicio,
          costo: servicio.costo,
          direccion: servicio.direccion,
          telefono: servicio.telefono,
          calificacion: servicio.calificacion,
          nombre_atractivo: servicio.nombre_atractivo
        }
      }))
    }

    map.current.addSource('servicios', {
      type: 'geojson',
      data: serviciosGeoJSON
    })

    map.current.addLayer({
      id: 'servicios-layer',
      type: 'circle',
      source: 'servicios',
      paint: {
        'circle-radius': 8,
        'circle-color': '#3b82f6',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    })

    map.current.addLayer({
      id: 'servicios-labels',
      type: 'symbol',
      source: 'servicios',
      layout: {
        'text-field': ['get', 'nombre'],
        'text-size': 12,
        'text-offset': [0, 1.5],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#333333',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2
      }
    })
  }

  // Agregar atractivos como capas vectoriales
  const addAtractivosToMap = () => {
    if (!map.current || !atractivos.length) return

    if (map.current.getLayer('atractivos-layer')) {
      map.current.removeLayer('atractivos-layer')
    }
    if (map.current.getSource('atractivos')) {
      map.current.removeSource('atractivos')
    }

    const atractivosGeoJSON = {
      type: 'FeatureCollection',
      features: atractivos.map(atractivo => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [atractivo.longitud, atractivo.latitud]
        },
        properties: {
          id: atractivo.id_atrac_turist,
          nombre: atractivo.nombre,
          tipo_atractivo: atractivo.tipo_atractivo,
          estado: atractivo.estado,
          tiempo_visita: atractivo.tiempo_visita,
          elevacion: atractivo.elevacion,
          este: atractivo.este,
          norte: atractivo.norte
        }
      }))
    }

    map.current.addSource('atractivos', {
      type: 'geojson',
      data: atractivosGeoJSON
    })

    map.current.addLayer({
      id: 'atractivos-layer',
      type: 'circle',
      source: 'atractivos',
      paint: {
        'circle-radius': 10,
        'circle-color': '#10b981',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    })

    map.current.addLayer({
      id: 'atractivos-labels',
      type: 'symbol',
      source: 'atractivos',
      layout: {
        'text-field': ['get', 'nombre'],
        'text-size': 12,
        'text-offset': [0, 2],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#333333',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2
      }
    })
  }

  // Configurar eventos de mouse para las capas
  const setupMapEvents = () => {
    if (!map.current) return

    // Eventos para servicios
    map.current.on('mouseenter', 'servicios-layer', () => {
      map.current.getCanvas().style.cursor = 'pointer'
      map.current.setPaintProperty('servicios-layer', 'circle-color', '#1d4ed8')
    })

    map.current.on('mouseleave', 'servicios-layer', () => {
      map.current.getCanvas().style.cursor = ''
      map.current.setPaintProperty('servicios-layer', 'circle-color', '#3b82f6')
    })

    map.current.on('click', 'servicios-layer', (e) => {
      const feature = e.features[0]
      if (feature) {
        const servicio = servicios.find(s => s.id_servicio === feature.properties.id)
        if (servicio) {
          setServicioSeleccionado(servicio)
          setAtractivoSeleccionado(null)
          setPopupType('servicio')
          setShowPopup(true)
        }
      }
    })

    // Eventos para atractivos
    map.current.on('mouseenter', 'atractivos-layer', () => {
      map.current.getCanvas().style.cursor = 'pointer'
      map.current.setPaintProperty('atractivos-layer', 'circle-color', '#059669')
    })

    map.current.on('mouseleave', 'atractivos-layer', () => {
      map.current.getCanvas().style.cursor = ''
      map.current.setPaintProperty('atractivos-layer', 'circle-color', '#10b981')
    })

    map.current.on('click', 'atractivos-layer', (e) => {
      const feature = e.features[0]
      if (feature) {
        const atractivo = atractivos.find(a => a.id_atrac_turist === feature.properties.id)
        if (atractivo) {
          setAtractivoSeleccionado(atractivo)
          setServicioSeleccionado(null)
          setPopupType('atractivo')
          setShowPopup(true)
        }
      }
    })
  }

  useEffect(() => {
    if (map.current && tracks.features && tracks.features.length > 0) {
      if (map.current.isStyleLoaded()) {
        addTracksToMap()
      } else {
        map.current.once("idle", addTracksToMap)
      }
    }
  }, [tracks])

  useEffect(() => {
    if (!map.current || !servicios.length) return

    if (map.current.isStyleLoaded()) {
      addServiciosToMap()
      setupMapEvents()
    } else {
      map.current.once('load', () => {
        addServiciosToMap()
        setupMapEvents()
      })
    }
  }, [servicios])

  useEffect(() => {
    if (!map.current || !atractivos.length) return

    if (map.current.isStyleLoaded()) {
      addAtractivosToMap()
      setupMapEvents()
    } else {
      map.current.once('load', () => {
        addAtractivosToMap()
        setupMapEvents()
      })
    }
  }, [atractivos])

  const ocultarInfo = () => {
    setShowPopup(false)
    setServicioSeleccionado(null)
    setAtractivoSeleccionado(null)
    setPopupType('')
  }

  // Función para obtener color según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'BUENO': return '#10b981'
      case 'REGULAR': return '#f59e0b'
      case 'MALO': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ position: 'relative', width: "100%", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      
      {/* Panel de información */}
      {showPopup && (
        <div 
          ref={popupRef}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '350px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            padding: '20px',
            zIndex: 1000,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <button 
            onClick={ocultarInfo}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '25px',
              height: '25px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ×
          </button>
          
          {popupType === 'servicio' && servicioSeleccionado && (
            <>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                color: '#333',
                borderBottom: '2px solid #3b82f6',
                paddingBottom: '8px'
              }}>
                {servicioSeleccionado.nombre_servicio}
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#666' }}>Tipo de servicio:</strong>
                <span style={{ 
                  display: 'inline-block',
                  background: '#3b82f6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  {servicioSeleccionado.tipo_servicio}
                </span>
              </div>
              
              {servicioSeleccionado.costo && (
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#666' }}>Costo:</strong>
                  <span style={{ marginLeft: '8px', color: '#2ecc71', fontWeight: 'bold' }}>
                    ${servicioSeleccionado.costo}
                  </span>
                </div>
              )}
              
              {servicioSeleccionado.direccion && (
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#666' }}>Dirección:</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#555' }}>
                    {servicioSeleccionado.direccion}
                  </p>
                </div>
              )}
              
              {servicioSeleccionado.telefono && (
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#666' }}>Teléfono:</strong>
                  <span style={{ marginLeft: '8px', color: '#555' }}>
                    {servicioSeleccionado.telefono}
                  </span>
                </div>
              )}
              
              {servicioSeleccionado.calificacion && (
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#666' }}>Calificación:</strong>
                  <span style={{ 
                    marginLeft: '8px', 
                    color: '#f39c12', 
                    fontWeight: 'bold' 
                  }}>
                    ⭐ {servicioSeleccionado.calificacion}/5
                  </span>
                </div>
              )}
              
              {servicioSeleccionado.nombre_atractivo && (
                <div style={{ 
                  marginTop: '15px',
                  padding: '10px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: '4px solid #28a745'
                }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '5px' }}>
                    Atractivo turístico asociado:
                  </strong>
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                    {servicioSeleccionado.nombre_atractivo}
                  </span>
                </div>
              )}
            </>
          )}

          {popupType === 'atractivo' && atractivoSeleccionado && (
            <>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                color: '#333',
                borderBottom: '2px solid #10b981',
                paddingBottom: '8px'
              }}>
                {atractivoSeleccionado.nombre}
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#666' }}>Tipo de atractivo:</strong>
                <span style={{ 
                  display: 'inline-block',
                  background: '#10b981',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  {atractivoSeleccionado.tipo_atractivo}
                </span>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#666' }}>Estado:</strong>
                <span style={{ 
                  display: 'inline-block',
                  background: getEstadoColor(atractivoSeleccionado.estado),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  {atractivoSeleccionado.estado}
                </span>
              </div>

              {atractivoSeleccionado.tiempo_visita && (
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#666' }}>Tiempo de visita:</strong>
                  <span style={{ marginLeft: '8px', color: '#555' }}>
                    {atractivoSeleccionado.tiempo_visita} minutos
                  </span>
                </div>
              )}

              {atractivoSeleccionado.elevacion && (
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: '#666' }}>Elevación:</strong>
                  <span style={{ marginLeft: '8px', color: '#555' }}>
                    {atractivoSeleccionado.elevacion} m.s.n.m
                  </span>
                </div>
              )}

              <div style={{ 
                marginTop: '15px',
                padding: '10px',
                background: '#f0fdf4',
                borderRadius: '6px',
                borderLeft: '4px solid #10b981'
              }}>
                <strong style={{ color: '#666', display: 'block', marginBottom: '5px' }}>
                  Coordenadas:
                </strong>
                <div style={{ fontSize: '12px', color: '#555' }}>
                  <div>Lat: {atractivoSeleccionado.latitud}</div>
                  <div>Lng: {atractivoSeleccionado.longitud}</div>
                  {atractivoSeleccionado.este && atractivoSeleccionado.norte && (
                    <>
                      <div>Este: {atractivoSeleccionado.este}</div>
                      <div>Norte: {atractivoSeleccionado.norte}</div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}