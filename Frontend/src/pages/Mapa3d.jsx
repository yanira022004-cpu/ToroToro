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
  const [departamentos, setDepartamentos] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [poligTor, setPoligTor] = useState([])
  const [riosPrincipales, setRiosPrincipales] = useState([])
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const [showServicios, setShowServicios] = useState(true)
  const [showAtractivos, setShowAtractivos] = useState(true)
  const [showTracks, setShowTracks] = useState(true)
  const [showAreas, setShowAreas] = useState(true)
  const [showDepartamentos, setShowDepartamentos] = useState(true)
  const [showLocalidades, setShowLocalidades] = useState(true)
  const [showPoligTor, setShowPoligTor] = useState(true)
  const [showRios, setShowRios] = useState(true)

  const coloresDepartamentos = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  const coloresLocalidades = ['#FF9FF3', '#F368E0', '#FF9F43', '#FFCA3A', '#8AC926']

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/departamentos")
        const data = await res.json()
        if (data.type === "FeatureCollection" && data.features) {
          setDepartamentos(data.features)
        }
      } catch (error) {
        console.error("Error obteniendo departamentos:", error)
      }
    }

    const fetchLocalidades = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/localidades")
        const data = await res.json()
        if (data.type === "FeatureCollection" && data.features) {
          setLocalidades(data.features)
        }
      } catch (error) {
        console.error("Error obteniendo localidades:", error)
      }
    }

    const fetchAreasProtegidas = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/area_prot")
        const data = await res.json()
        setAreasProtegidas(data)
      } catch (error) {
        console.error("Error obteniendo áreas protegidas:", error)
      }
    }

    const fetchAtractivos = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/atractivo_coords")
        const data = await res.json()
        setAtractivos(data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchServicios = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/servicio_coords")
        const data = await res.json()
        setServicios(data)
      } catch (err) {
        console.error(err)
      }
    }

    const fetchTracks = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/track_toro_toro")
        const data = await res.json()
        setTracks(data)
      } catch (error) {
        console.error("Error obteniendo tracks:", error)
      }
    }

    const fetchPoligTor = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/polig_tor")
        const data = await res.json()
        setPoligTor(data.features || [])
      } catch (error) {
        console.error("Error obteniendo polígono Toro Toro:", error)
      }
    }

    const fetchRiosPrincipales = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/rios_principales")
        const data = await res.json()
        setRiosPrincipales(data.features || [])
      } catch (error) {
        console.error("Error obteniendo ríos principales:", error)
      }
    }

    fetchDepartamentos()
    fetchLocalidades()
    fetchAreasProtegidas()
    fetchAtractivos()
    fetchServicios()
    fetchTracks()
    fetchPoligTor()
    fetchRiosPrincipales()
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

  const toggleLayer = (layerType, isVisible) => {
    if (!map.current || !mapLoaded) return

    const layers = {
      servicios: ['servicios-layer', 'servicios-labels'],
      atractivos: ['atractivos-layer', 'atractivos-labels'],
      tracks: ['tracks-layer', 'tracks-glow'],
      areas: ['areas-3d', 'areas-fill', 'areas-border'],
      departamentos: ['departamentos-fill', 'departamentos-border'],
      localidades: ['localidades-layer', 'localidades-labels'],
      poligTor: ['polig-tor-fill', 'polig-tor-border'],
      rios: ['rios-layer', 'rios-labels']
    }

    layers[layerType]?.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(
          layerId,
          'visibility',
          isVisible ? 'visible' : 'none'
        )
      }
    })
  }

  useEffect(() => { toggleLayer('servicios', showServicios) }, [showServicios, mapLoaded])
  useEffect(() => { toggleLayer('atractivos', showAtractivos) }, [showAtractivos, mapLoaded])
  useEffect(() => { toggleLayer('tracks', showTracks) }, [showTracks, mapLoaded])
  useEffect(() => { toggleLayer('areas', showAreas) }, [showAreas, mapLoaded])
  useEffect(() => { toggleLayer('departamentos', showDepartamentos) }, [showDepartamentos, mapLoaded])
  useEffect(() => { toggleLayer('localidades', showLocalidades) }, [showLocalidades, mapLoaded])
  useEffect(() => { toggleLayer('poligTor', showPoligTor) }, [showPoligTor, mapLoaded])
  useEffect(() => { toggleLayer('rios', showRios) }, [showRios, mapLoaded])

  // Capa de Ríos Principales
  useEffect(() => {
    if (!map.current || !riosPrincipales.length || !mapLoaded) return

    const addRiosToMap = () => {
      if (map.current.getSource('rios')) {
        map.current.removeSource('rios')
      }

      const riosGeoJSON = {
        type: 'FeatureCollection',
        features: riosPrincipales
      }

      map.current.addSource('rios', {
        type: 'geojson',
        data: riosGeoJSON
      })

      map.current.addLayer({
        id: 'rios-layer',
        type: 'line',
        source: 'rios',
        layout: { 'visibility': showRios ? 'visible' : 'none' },
        paint: {
          'line-color': '#1e40af',
          'line-width': 3,
          'line-opacity': 0.8
        }
      })

      map.current.addLayer({
        id: 'rios-labels',
        type: 'symbol',
        source: 'rios',
        layout: {
          'visibility': showRios ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 12,
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-optional': true
        },
        paint: {
          'text-color': '#1e40af',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addRiosToMap()
    } else {
      map.current.once("idle", addRiosToMap)
    }
  }, [riosPrincipales, mapLoaded, showRios])

  useEffect(() => {
    if (!map.current || !poligTor.length || !mapLoaded) return

    const addPoligTorToMap = () => {
      if (map.current.getSource('polig-tor')) {
        map.current.removeSource('polig-tor')
      }

      const poligTorGeoJSON = {
        type: 'FeatureCollection',
        features: poligTor
      }

      map.current.addSource('polig-tor', {
        type: 'geojson',
        data: poligTorGeoJSON
      })

      map.current.addLayer({
        id: 'polig-tor-fill',
        type: 'fill',
        source: 'polig-tor',
        layout: { 'visibility': showPoligTor ? 'visible' : 'none' },
        paint: {
          'fill-color': '#9333ea',
          'fill-opacity': 0.3,
          'fill-outline-color': '#7c3aed'
        }
      })

      map.current.addLayer({
        id: 'polig-tor-border',
        type: 'line',
        source: 'polig-tor',
        layout: { 'visibility': showPoligTor ? 'visible' : 'none' },
        paint: {
          'line-color': '#7c3aed',
          'line-width': 3,
          'line-opacity': 0.8
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addPoligTorToMap()
    } else {
      map.current.once("idle", addPoligTorToMap)
    }
  }, [poligTor, mapLoaded, showPoligTor])

  useEffect(() => {
    if (!map.current || !departamentos.length || !mapLoaded) return

    const addDepartamentosToMap = () => {
      if (map.current.getSource('departamentos')) {
        map.current.removeSource('departamentos')
      }

      const departamentosGeoJSON = {
        type: 'FeatureCollection',
        features: departamentos.map((feature, index) => ({
          ...feature,
          properties: {
            ...feature.properties,
            color: coloresDepartamentos[index % coloresDepartamentos.length],
            nombre: feature.properties.nombre || `Departamento ${index + 1}`
          }
        }))
      }

      map.current.addSource('departamentos', {
        type: 'geojson',
        data: departamentosGeoJSON
      })

      map.current.addLayer({
        id: 'departamentos-fill',
        type: 'fill',
        source: 'departamentos',
        layout: { 'visibility': showDepartamentos ? 'visible' : 'none' },
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.6,
          'fill-outline-color': '#ffffff'
        }
      })

      map.current.addLayer({
        id: 'departamentos-border',
        type: 'line',
        source: 'departamentos',
        layout: { 'visibility': showDepartamentos ? 'visible' : 'none' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addDepartamentosToMap()
    } else {
      map.current.once("idle", addDepartamentosToMap)
    }
  }, [departamentos, mapLoaded, showDepartamentos])

  useEffect(() => {
    if (!map.current || !localidades.length || !mapLoaded) return

    const addLocalidadesToMap = () => {
      if (map.current.getSource('localidades')) {
        map.current.removeSource('localidades')
      }

      const localidadesGeoJSON = {
        type: 'FeatureCollection',
        features: localidades.map((feature, index) => ({
          ...feature,
          properties: {
            ...feature.properties,
            color: coloresLocalidades[index % coloresLocalidades.length],
            nombre: feature.properties.nombre || `Localidad ${feature.properties.id || index + 1}`,
            categoria: feature.properties.categoria || 'Sin categoría',
            subcategoria: feature.properties.subcateg || 'Sin subcategoría'
          }
        }))
      }

      map.current.addSource('localidades', {
        type: 'geojson',
        data: localidadesGeoJSON
      })

      map.current.addLayer({
        id: 'localidades-layer',
        type: 'circle',
        source: 'localidades',
        layout: { 'visibility': showLocalidades ? 'visible' : 'none' },
        paint: {
          'circle-radius': 10,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      })

      map.current.addLayer({
        id: 'localidades-labels',
        type: 'symbol',
        source: 'localidades',
        layout: {
          'visibility': showLocalidades ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 14,
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
          'text-optional': true
        },
        paint: {
          'text-color': '#854d0e',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addLocalidadesToMap()
    } else {
      map.current.once("idle", addLocalidadesToMap)
    }
  }, [localidades, mapLoaded, showLocalidades])

  useEffect(() => {
    if (!map.current || !tracks.features || tracks.features.length === 0 || !mapLoaded) return

    const addTracksToMap = () => {
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
        layout: { 'visibility': showTracks ? 'visible' : 'none' },
        paint: {
          "line-color": "#ff0000",
          "line-width": 5,
          "line-opacity": 0.9,
        },
      })

      map.current.addLayer({
        id: "tracks-glow",
        type: 'line',
        source: "tracks",
        layout: { 'visibility': showTracks ? 'visible' : 'none' },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 8,
          "line-opacity": 0.3,
          "line-blur": 2,
        },
      })
    }

    if (map.current.isStyleLoaded()) {
      addTracksToMap()
    } else {
      map.current.once("idle", addTracksToMap)
    }
  }, [tracks, mapLoaded, showTracks])

  useEffect(() => {
    if (!map.current || !areasProtegidas.length || !mapLoaded) return

    const addAreasProtegidasToMap = () => {
      if (map.current.getSource('areas')) {
        map.current.removeSource('areas')
      }

      const areasGeoJSON = {
        type: 'FeatureCollection',
        features: areasProtegidas.map(area => ({
          type: 'Feature',
          geometry: JSON.parse(area.area_geojson),
          properties: {
            id: area.id_area_prot,
            descripcion: area.descripcion,
            atractivo_turistico_id: area.atractivo_turistico_id
          }
        }))
      }

      map.current.addSource('areas', {
        type: 'geojson',
        data: areasGeoJSON
      })

      map.current.addLayer({
        id: 'areas-3d',
        type: 'fill-extrusion',
        source: 'areas',
        layout: { 'visibility': showAreas ? 'visible' : 'none' },
        paint: {
          'fill-extrusion-color': '#8b5cf6',
          'fill-extrusion-height': 50,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.4,
        }
      })

      map.current.addLayer({
        id: 'areas-fill',
        type: 'fill',
        source: 'areas',
        layout: { 'visibility': showAreas ? 'visible' : 'none' },
        paint: {
          'fill-color': '#8b5cf6',
          'fill-opacity': 0.1
        }
      })

      map.current.addLayer({
        id: 'areas-border',
        type: 'line',
        source: 'areas',
        layout: { 'visibility': showAreas ? 'visible' : 'none' },
        paint: {
          'line-color': '#7c3aed',
          'line-width': 3,
          'line-opacity': 0.8,
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addAreasProtegidasToMap()
    } else {
      map.current.once('idle', addAreasProtegidasToMap)
    }
  }, [areasProtegidas, mapLoaded, showAreas])

  useEffect(() => {
    if (!map.current || !servicios.length || !mapLoaded) return

    const addServiciosToMap = () => {
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
        type: 'symbol',
        source: 'servicios',
        layout: {
          'visibility': showServicios ? 'visible' : 'none',
          'icon-image': 'custom-marker',
          'icon-size': 0.6,
          'icon-allow-overlap': true
        },
        paint: { 'icon-opacity': 0.9 }
      })

      map.current.addLayer({
        id: 'servicios-labels',
        type: 'symbol',
        source: 'servicios',
        layout: {
          'visibility': showServicios ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 14,
          'text-offset': [0, 1.5],
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
  }, [servicios, mapLoaded, showServicios])

  useEffect(() => {
    if (!map.current || !atractivos.length || !mapLoaded) return

    const addAtractivosToMap = () => {
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
        layout: { 'visibility': showAtractivos ? 'visible' : 'none' },
        paint: {
          'circle-radius': 12,
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
          'visibility': showAtractivos ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 14,
          'text-offset': [0, 2.2],
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
  }, [atractivos, mapLoaded, showAtractivos])

  const controlStyles = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    padding: '15px',
    zIndex: 1000,
    minWidth: '220px'
  }

  const toggleButtonStyles = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    marginBottom: '8px',
    border: 'none',
    borderRadius: '6px',
    background: isActive ? '#3b82f6' : '#f8fafc',
    color: isActive ? 'white' : '#334155',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  })

  return (
    <div style={{ position: 'relative', width: "100%", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      
      <div style={controlStyles}>
        <h4 style={{ 
          margin: '0 0 15px 0', 
          color: '#333', 
          textAlign: 'center',
          fontSize: '18px'
        }}>
          🎯 Control de Capas
        </h4>
        
        <button onClick={() => setShowServicios(!showServicios)} style={toggleButtonStyles(showServicios)}>
          <span>🏠</span> Servicios {showServicios ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowAtractivos(!showAtractivos)} style={toggleButtonStyles(showAtractivos)}>
          <span>🏞️</span> Atractivos {showAtractivos ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowTracks(!showTracks)} style={toggleButtonStyles(showTracks)}>
          <span>🛣️</span> Tracks {showTracks ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowAreas(!showAreas)} style={toggleButtonStyles(showAreas)}>
          <span>🛡️</span> Áreas 3D {showAreas ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowDepartamentos(!showDepartamentos)} style={toggleButtonStyles(showDepartamentos)}>
          <span>🗺️</span> Departamentos {showDepartamentos ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowLocalidades(!showLocalidades)} style={toggleButtonStyles(showLocalidades)}>
          <span>🏘️</span> Localidades {showLocalidades ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowPoligTor(!showPoligTor)} style={toggleButtonStyles(showPoligTor)}>
          <span>📍</span> Polígono Toro Toro {showPoligTor ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowRios(!showRios)} style={toggleButtonStyles(showRios)}>
          <span>🌊</span> Ríos Principales {showRios ? '✓' : '✗'}
        </button>
      </div>
    </div>
  )
}