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
  const [areasProtegidas, setAreasProtegidas] = useState([])
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [atractivoSeleccionado, setAtractivoSeleccionado] = useState(null)
  const [areaSeleccionada, setAreaSeleccionada] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupType, setPopupType] = useState('') // 'servicio', 'atractivo' o 'area'
  const popupRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Fetch para áreas protegidas
  useEffect(() => {
    const fetchAreasProtegidas = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/area_prot")
        const data = await res.json()
        setAreasProtegidas(data)
      } catch (error) {
        console.error("Error obteniendo áreas protegidas:", error)
      }
    }

    fetchAreasProtegidas()
  }, [])

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
      setMapLoaded(true)
      
      // Cargar el sprite personalizado con el ícono de casa
      map.current.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          map.current.addImage('custom-marker', image);
        }
      );

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
    })
  }, [])

  // Primero: Agregar tracks
  useEffect(() => {
    if (!map.current || !tracks.features || tracks.features.length === 0 || !mapLoaded) return

    const addTracksToMap = () => {
      // Remover capas existentes si las hay
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

    if (map.current.isStyleLoaded()) {
      addTracksToMap()
    } else {
      map.current.once("idle", addTracksToMap)
    }
  }, [tracks, mapLoaded])

  // Segundo: Agregar áreas protegidas
  useEffect(() => {
    if (!map.current || !areasProtegidas.length || !mapLoaded) return

    const addAreasProtegidasToMap = () => {
      // Remover capas existentes si las hay
      if (map.current.getLayer('areas-3d')) {
        map.current.removeLayer('areas-3d')
      }
      if (map.current.getLayer('areas-fill')) {
        map.current.removeLayer('areas-fill')
      }
      if (map.current.getLayer('areas-border')) {
        map.current.removeLayer('areas-border')
      }
      if (map.current.getSource('areas')) {
        map.current.removeSource('areas')
      }

      // Crear GeoJSON para áreas protegidas
      const areasGeoJSON = {
        type: 'FeatureCollection',
        features: areasProtegidas.map(area => ({
          type: 'Feature',
          geometry: JSON.parse(area.area_geojson),
          properties: {
            id: area.id_area_prot,
            descripcion: area.descripcion,
            atractivo_turistico_id: area.atractivo_turistico_id,
            height: 50,
            base_height: 0
          }
        }))
      }

      // Agregar fuente
      map.current.addSource('areas', {
        type: 'geojson',
        data: areasGeoJSON
      })

      // Capa 3D para áreas protegidas (extrusión)
      map.current.addLayer({
        id: 'areas-3d',
        type: 'fill-extrusion',
        source: 'areas',
        paint: {
          'fill-extrusion-color': '#8b5cf6',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, 10,
            15, 30,
            18, 50
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.4,
          'fill-extrusion-vertical-gradient': false
        }
      })

      // Capa de relleno para áreas
      map.current.addLayer({
        id: 'areas-fill',
        type: 'fill',
        source: 'areas',
        paint: {
          'fill-color': '#8b5cf6',
          'fill-opacity': 0.1
        }
      })

      // Capa de borde para áreas
      map.current.addLayer({
        id: 'areas-border',
        type: 'line',
        source: 'areas',
        paint: {
          'line-color': '#7c3aed',
          'line-width': 3,
          'line-opacity': 0.8,
          'line-dasharray': [2, 2]
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addAreasProtegidasToMap()
    } else {
      map.current.once('idle', addAreasProtegidasToMap)
    }
  }, [areasProtegidas, mapLoaded])

  // Tercero: Agregar servicios
  useEffect(() => {
    if (!map.current || !servicios.length || !mapLoaded) return

    const addServiciosToMap = () => {
      // Remover capas existentes si las hay
      if (map.current.getLayer('servicios-layer')) {
        map.current.removeLayer('servicios-layer')
      }
      if (map.current.getLayer('servicios-labels')) {
        map.current.removeLayer('servicios-labels')
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

      // Usar símbolos con ícono de casa
      map.current.addLayer({
        id: 'servicios-layer',
        type: 'symbol',
        source: 'servicios',
        layout: {
          'icon-image': 'custom-marker',
          'icon-size': 0.5,
          'icon-allow-overlap': true
        },
        paint: {
          'icon-opacity': 0.9
        }
      })

      // Etiquetas de servicios
      map.current.addLayer({
        id: 'servicios-labels',
        type: 'symbol',
        source: 'servicios',
        layout: {
          'text-field': ['get', 'nombre'],
          'text-size': 12,
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
          'text-optional': true
        },
        paint: {
          'text-color': '#1e40af',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addServiciosToMap()
    } else {
      map.current.once('idle', addServiciosToMap)
    }
  }, [servicios, mapLoaded])

  // Cuarto: Agregar atractivos (últimos para que queden encima)
  useEffect(() => {
    if (!map.current || !atractivos.length || !mapLoaded) return

    const addAtractivosToMap = () => {
      // Remover capas existentes si las hay
      if (map.current.getLayer('atractivos-layer')) {
        map.current.removeLayer('atractivos-layer')
      }
      if (map.current.getLayer('atractivos-labels')) {
        map.current.removeLayer('atractivos-labels')
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

      // Capa de círculos para atractivos
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

      // Etiquetas de atractivos
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

    if (map.current.isStyleLoaded()) {
      addAtractivosToMap()
    } else {
      map.current.once('idle', addAtractivosToMap)
    }
  }, [atractivos, mapLoaded])

  // Configurar eventos una vez que todas las capas estén cargadas
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const setupMapEvents = () => {
      // Eventos para servicios
      map.current.on('mouseenter', 'servicios-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('servicios-layer', 'icon-opacity', 1)
      })

      map.current.on('mouseleave', 'servicios-layer', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('servicios-layer', 'icon-opacity', 0.9)
      })

      map.current.on('click', 'servicios-layer', (e) => {
        const feature = e.features[0]
        if (feature) {
          const servicio = servicios.find(s => s.id_servicio === feature.properties.id)
          if (servicio) {
            setServicioSeleccionado(servicio)
            setAtractivoSeleccionado(null)
            setAreaSeleccionada(null)
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
            setAreaSeleccionada(null)
            setPopupType('atractivo')
            setShowPopup(true)
          }
        }
      })

      // Eventos para áreas protegidas
      map.current.on('mouseenter', 'areas-3d', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('areas-3d', 'fill-extrusion-opacity', 0.7)
        map.current.setPaintProperty('areas-3d', 'fill-extrusion-color', '#7c3aed')
        map.current.setPaintProperty('areas-border', 'line-width', 4)
      })

      map.current.on('mouseleave', 'areas-3d', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('areas-3d', 'fill-extrusion-opacity', 0.4)
        map.current.setPaintProperty('areas-3d', 'fill-extrusion-color', '#8b5cf6')
        map.current.setPaintProperty('areas-border', 'line-width', 3)
      })

      map.current.on('click', 'areas-3d', (e) => {
        const feature = e.features[0]
        if (feature) {
          const area = areasProtegidas.find(a => a.id_area_prot === feature.properties.id)
          if (area) {
            const atractivoAsociado = atractivos.find(a => a.id_atrac_turist === area.atractivo_turistico_id)
            setAreaSeleccionada({
              ...area,
              nombre_atractivo: atractivoAsociado ? atractivoAsociado.nombre : null
            })
            setServicioSeleccionado(null)
            setAtractivoSeleccionado(null)
            setPopupType('area')
            setShowPopup(true)
          }
        }
      })
    }

    // Esperar a que el mapa esté completamente cargado
    if (map.current.isStyleLoaded()) {
      setupMapEvents()
    } else {
      map.current.once('idle', setupMapEvents)
    }
  }, [mapLoaded, servicios, atractivos, areasProtegidas])

  const ocultarInfo = () => {
    setShowPopup(false)
    setServicioSeleccionado(null)
    setAtractivoSeleccionado(null)
    setAreaSeleccionada(null)
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
                🏠 {servicioSeleccionado.nombre_servicio}
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
                    Bs {servicioSeleccionado.costo}
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
                🏞️ {atractivoSeleccionado.nombre}
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

          {popupType === 'area' && areaSeleccionada && (
            <>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                color: '#333',
                borderBottom: '2px solid #8b5cf6',
                paddingBottom: '8px'
              }}>
                🛡️ Área Protegida 3D
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#666' }}>Visualización:</strong>
                <span style={{ 
                  display: 'inline-block',
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  Extrusión 3D
                </span>
              </div>

              {areaSeleccionada.descripcion && (
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '5px' }}>
                    Descripción:
                  </strong>
                  <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>
                    {areaSeleccionada.descripcion}
                  </p>
                </div>
              )}

              {areaSeleccionada.nombre_atractivo && (
                <div style={{ 
                  marginTop: '15px',
                  padding: '10px',
                  background: '#faf5ff',
                  borderRadius: '6px',
                  borderLeft: '4px solid #8b5cf6'
                }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '5px' }}>
                    Atractivo Turístico Asociado:
                  </strong>
                  <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>
                    {areaSeleccionada.nombre_atractivo}
                  </span>
                </div>
              )}

              <div style={{ 
                marginTop: '15px',
                padding: '10px',
                background: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}