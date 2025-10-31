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
  const [riosSecundarios, setRiosSecundarios] = useState([])
  const [viasSecundarias, setViasSecundarias] = useState([])
  const [viasPrincipales, setViasPrincipales] = useState([])
  const [comunidades, setComunidades] = useState([])
  const [maya, setMaya] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [provincias, setProvincias] = useState([])
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [atractivoSeleccionado, setAtractivoSeleccionado] = useState(null)
  const [areaSeleccionada, setAreaSeleccionada] = useState(null)
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null)
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState(null)
  const [mayaSeleccionada, setMayaSeleccionada] = useState(null)
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null)
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupType, setPopupType] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const [showServicios, setShowServicios] = useState(true)
  const [showAtractivos, setShowAtractivos] = useState(true)
  const [showTracks, setShowTracks] = useState(true)
  const [showAreas, setShowAreas] = useState(true)
  const [showDepartamentos, setShowDepartamentos] = useState(true)
  const [showLocalidades, setShowLocalidades] = useState(true)
  const [showPoligTor, setShowPoligTor] = useState(true)
  const [showRiosPrincipales, setShowRiosPrincipales] = useState(true)
  const [showRiosSecundarios, setShowRiosSecundarios] = useState(true)
  const [showViasSecundarias, setShowViasSecundarias] = useState(true)
  const [showViasPrincipales, setShowViasPrincipales] = useState(true)
  const [showComunidades, setShowComunidades] = useState(true)
  const [showMaya, setShowMaya] = useState(true)
  const [showMunicipios, setShowMunicipios] = useState(true)
  const [showProvincias, setShowProvincias] = useState(true)

  const coloresDepartamentos = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  const coloresLocalidades = ['#FF9FF3', '#F368E0', '#FF9F43', '#FFCA3A', '#8AC926']
  const coloresComunidades = ['#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#60A5FA', '#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6']
  const coloresMunicipios = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98', '#FFD700', '#FFA07A', '#87CEEB']
  const coloresProvincias = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98', '#FFD700', '#FFA07A', '#87CEEB', '#FF69B4', '#00CED1', '#FF4500', '#32CD32', '#8A2BE2']

  // Función para limpiar capas específicas
  const cleanupLayer = (sourceId, layerIds) => {
    if (!map.current) return
    
    layerIds.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId)
      }
    })
    
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId)
    }
  }

  const ocultarInfo = () => {
    setShowPopup(false)
    setServicioSeleccionado(null)
    setAtractivoSeleccionado(null)
    setAreaSeleccionada(null)
    setLocalidadSeleccionada(null)
    setComunidadSeleccionada(null)
    setMayaSeleccionada(null)
    setMunicipioSeleccionado(null)
    setProvinciaSeleccionada(null)
    setPopupType('')
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'BUENO': return '#10b981'
      case 'REGULAR': return '#f59e0b'
      case 'MALO': return '#ef4444'
      default: return '#6b7280'
    }
  }

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

    const fetchProvincias = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/provincias")
        const data = await res.json()
        if (data.type === "FeatureCollection" && data.features) {
          setProvincias(data.features)
        } else {
          console.error("Formato de provincias no válido:", data)
        }
      } catch (error) {
        console.error("Error obteniendo provincias:", error)
      }
    }

    const fetchMunicipios = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/municipios")
        const data = await res.json()
        if (data.type === "FeatureCollection" && data.features) {
          setMunicipios(data.features)
        } else {
          console.error("Formato de municipios no válido:", data)
        }
      } catch (error) {
        console.error("Error obteniendo municipios:", error)
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

    const fetchRiosSecundarios = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/rios_secundarios")
        const data = await res.json()
        setRiosSecundarios(data.features || [])
      } catch (error) {
        console.error("Error obteniendo ríos secundarios:", error)
      }
    }

    const fetchViasSecundarias = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/vias_secundarias")
        const data = await res.json()
        setViasSecundarias(data.features || [])
      } catch (error) {
        console.error("Error obteniendo vías secundarias:", error)
      }
    }

    const fetchViasPrincipales = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/vias_principales")
        const data = await res.json()
        setViasPrincipales(data.features || [])
      } catch (error) {
        console.error("Error obteniendo vías principales:", error)
      }
    }

    const fetchComunidades = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/comunidades")
        const data = await res.json()
        if (data.type === "FeatureCollection" && data.features) {
          setComunidades(data.features)
        } else {
          console.error("Formato de comunidades no válido:", data)
        }
      } catch (error) {
        console.error("Error obteniendo comunidades:", error)
      }
    }

    const fetchMaya = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/maya")
        const data = await res.json()
        if (data.type === "FeatureCollection" && data.features) {
          setMaya(data.features)
        } else {
          console.error("Formato de maya no válido:", data)
        }
      } catch (error) {
        console.error("Error obteniendo maya:", error)
      }
    }

    fetchDepartamentos()
    fetchProvincias()
    fetchMunicipios()
    fetchLocalidades()
    fetchAreasProtegidas()
    fetchAtractivos()
    fetchServicios()
    fetchTracks()
    fetchPoligTor()
    fetchRiosPrincipales()
    fetchRiosSecundarios()
    fetchViasSecundarias()
    fetchViasPrincipales()
    fetchComunidades()
    fetchMaya()
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
      riosPrincipales: ['rios-principales-layer', 'rios-principales-labels'],
      riosSecundarios: ['rios-secundarios-layer', 'rios-secundarios-labels'],
      viasSecundarias: ['vias-secundarias-layer', 'vias-secundarias-labels'],
      viasPrincipales: ['vias-principales-layer', 'vias-principales-labels'],
      comunidades: ['comunidades-fill', 'comunidades-border', 'comunidades-labels'],
      maya: ['maya-fill', 'maya-border', 'maya-labels'],
      municipios: ['municipios-fill', 'municipios-border', 'municipios-labels'],
      provincias: ['provincias-fill', 'provincias-border', 'provincias-labels']
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
  useEffect(() => { toggleLayer('riosPrincipales', showRiosPrincipales) }, [showRiosPrincipales, mapLoaded])
  useEffect(() => { toggleLayer('riosSecundarios', showRiosSecundarios) }, [showRiosSecundarios, mapLoaded])
  useEffect(() => { toggleLayer('viasSecundarias', showViasSecundarias) }, [showViasSecundarias, mapLoaded])
  useEffect(() => { toggleLayer('viasPrincipales', showViasPrincipales) }, [showViasPrincipales, mapLoaded])
  useEffect(() => { toggleLayer('comunidades', showComunidades) }, [showComunidades, mapLoaded])
  useEffect(() => { toggleLayer('maya', showMaya) }, [showMaya, mapLoaded])
  useEffect(() => { toggleLayer('municipios', showMunicipios) }, [showMunicipios, mapLoaded])
  useEffect(() => { toggleLayer('provincias', showProvincias) }, [showProvincias, mapLoaded])

  // Eventos del mapa para mostrar información
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
            setLocalidadSeleccionada(null)
            setComunidadSeleccionada(null)
            setMayaSeleccionada(null)
            setMunicipioSeleccionado(null)
            setProvinciaSeleccionada(null)
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
            setLocalidadSeleccionada(null)
            setComunidadSeleccionada(null)
            setMayaSeleccionada(null)
            setMunicipioSeleccionado(null)
            setProvinciaSeleccionada(null)
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
            setLocalidadSeleccionada(null)
            setComunidadSeleccionada(null)
            setMayaSeleccionada(null)
            setMunicipioSeleccionado(null)
            setProvinciaSeleccionada(null)
            setPopupType('area')
            setShowPopup(true)
          }
        }
      })

      // Eventos para localidades
      map.current.on('mouseenter', 'localidades-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('localidades-layer', 'circle-opacity', 1)
      })

      map.current.on('mouseleave', 'localidades-layer', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('localidades-layer', 'circle-opacity', 0.8)
      })

      map.current.on('click', 'localidades-layer', (e) => {
        const feature = e.features[0]
        if (feature) {
          setLocalidadSeleccionada(feature.properties)
          setServicioSeleccionado(null)
          setAtractivoSeleccionado(null)
          setAreaSeleccionada(null)
          setComunidadSeleccionada(null)
          setMayaSeleccionada(null)
          setMunicipioSeleccionado(null)
          setProvinciaSeleccionada(null)
          setPopupType('localidad')
          setShowPopup(true)
        }
      })

      // Eventos para comunidades
      map.current.on('mouseenter', 'comunidades-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('comunidades-fill', 'fill-opacity', 0.8)
        map.current.setPaintProperty('comunidades-border', 'line-width', 3)
      })

      map.current.on('mouseleave', 'comunidades-fill', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('comunidades-fill', 'fill-opacity', 0.6)
        map.current.setPaintProperty('comunidades-border', 'line-width', 2)
      })

      map.current.on('click', 'comunidades-fill', (e) => {
        const feature = e.features[0]
        if (feature) {
          setComunidadSeleccionada(feature.properties)
          setServicioSeleccionado(null)
          setAtractivoSeleccionado(null)
          setAreaSeleccionada(null)
          setLocalidadSeleccionada(null)
          setMayaSeleccionada(null)
          setMunicipioSeleccionado(null)
          setProvinciaSeleccionada(null)
          setPopupType('comunidad')
          setShowPopup(true)
        }
      })

      // Eventos para Maya (Parque Nacional)
      map.current.on('mouseenter', 'maya-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('maya-fill', 'fill-opacity', 0.8)
        map.current.setPaintProperty('maya-border', 'line-width', 4)
      })

      map.current.on('mouseleave', 'maya-fill', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('maya-fill', 'fill-opacity', 0.6)
        map.current.setPaintProperty('maya-border', 'line-width', 3)
      })

      map.current.on('click', 'maya-fill', (e) => {
        const feature = e.features[0]
        if (feature) {
          setMayaSeleccionada(feature.properties)
          setServicioSeleccionado(null)
          setAtractivoSeleccionado(null)
          setAreaSeleccionada(null)
          setLocalidadSeleccionada(null)
          setComunidadSeleccionada(null)
          setMunicipioSeleccionado(null)
          setProvinciaSeleccionada(null)
          setPopupType('maya')
          setShowPopup(true)
        }
      })

      // Eventos para Municipios
      map.current.on('mouseenter', 'municipios-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('municipios-fill', 'fill-opacity', 0.8)
        map.current.setPaintProperty('municipios-border', 'line-width', 3)
      })

      map.current.on('mouseleave', 'municipios-fill', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('municipios-fill', 'fill-opacity', 0.6)
        map.current.setPaintProperty('municipios-border', 'line-width', 2)
      })

      map.current.on('click', 'municipios-fill', (e) => {
        const feature = e.features[0]
        if (feature) {
          setMunicipioSeleccionado(feature.properties)
          setServicioSeleccionado(null)
          setAtractivoSeleccionado(null)
          setAreaSeleccionada(null)
          setLocalidadSeleccionada(null)
          setComunidadSeleccionada(null)
          setMayaSeleccionada(null)
          setProvinciaSeleccionada(null)
          setPopupType('municipio')
          setShowPopup(true)
        }
      })

      // Eventos para Provincias
      map.current.on('mouseenter', 'provincias-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('provincias-fill', 'fill-opacity', 0.8)
        map.current.setPaintProperty('provincias-border', 'line-width', 3)
      })

      map.current.on('mouseleave', 'provincias-fill', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('provincias-fill', 'fill-opacity', 0.6)
        map.current.setPaintProperty('provincias-border', 'line-width', 2)
      })

      map.current.on('click', 'provincias-fill', (e) => {
        const feature = e.features[0]
        if (feature) {
          setProvinciaSeleccionada(feature.properties)
          setServicioSeleccionado(null)
          setAtractivoSeleccionado(null)
          setAreaSeleccionada(null)
          setLocalidadSeleccionada(null)
          setComunidadSeleccionada(null)
          setMayaSeleccionada(null)
          setMunicipioSeleccionado(null)
          setPopupType('provincia')
          setShowPopup(true)
        }
      })

      // Eventos para departamentos (solo hover, sin popup)
      map.current.on('mouseenter', 'departamentos-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer'
        map.current.setPaintProperty('departamentos-fill', 'fill-opacity', 0.8)
      })

      map.current.on('mouseleave', 'departamentos-fill', () => {
        map.current.getCanvas().style.cursor = ''
        map.current.setPaintProperty('departamentos-fill', 'fill-opacity', 0.6)
      })
    }

    if (map.current.isStyleLoaded()) {
      setupMapEvents()
    } else {
      map.current.once('idle', setupMapEvents)
    }
  }, [mapLoaded, servicios, atractivos, areasProtegidas, localidades, comunidades, maya, municipios, provincias])

  // Capa de Provincias
  useEffect(() => {
    if (!map.current || !provincias.length || !mapLoaded) return

    const addProvinciasToMap = () => {
      cleanupLayer('provincias', ['provincias-fill', 'provincias-border', 'provincias-labels'])

      const provinciasGeoJSON = {
        type: 'FeatureCollection',
        features: provincias.map((feature, index) => ({
          ...feature,
          properties: {
            ...feature.properties,
            color: coloresProvincias[index % coloresProvincias.length],
            nombre: feature.properties.provincia || `Provincia ${index + 1}`,
            departamento: feature.properties.departamen,
            c_ut: feature.properties.c_ut,
            c_ut_d: feature.properties.c_ut_d,
            shape_leng: feature.properties.shape_leng,
            shape_area: feature.properties.shape_area
          }
        }))
      }

      map.current.addSource('provincias', {
        type: 'geojson',
        data: provinciasGeoJSON
      })

      // Capa de relleno para provincias
      map.current.addLayer({
        id: 'provincias-fill',
        type: 'fill',
        source: 'provincias',
        layout: { 'visibility': showProvincias ? 'visible' : 'none' },
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.4,
          'fill-outline-color': '#ffffff'
        }
      })

      // Borde de las provincias
      map.current.addLayer({
        id: 'provincias-border',
        type: 'line',
        source: 'provincias',
        layout: { 'visibility': showProvincias ? 'visible' : 'none' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })

      // Etiquetas para provincias
      map.current.addLayer({
        id: 'provincias-labels',
        type: 'symbol',
        source: 'provincias',
        layout: {
          'visibility': showProvincias ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 12,
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-optional': true
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addProvinciasToMap()
    } else {
      map.current.once('idle', addProvinciasToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('provincias', ['provincias-fill', 'provincias-border', 'provincias-labels'])
      }
    }
  }, [provincias, mapLoaded, showProvincias])

  // Capa de Municipios
  useEffect(() => {
    if (!map.current || !municipios.length || !mapLoaded) return

    const addMunicipiosToMap = () => {
      cleanupLayer('municipios', ['municipios-fill', 'municipios-border', 'municipios-labels'])

      const municipiosGeoJSON = {
        type: 'FeatureCollection',
        features: municipios.map((feature, index) => ({
          ...feature,
          properties: {
            ...feature.properties,
            color: coloresMunicipios[index % coloresMunicipios.length],
            nombre: feature.properties.capital || feature.properties.municipio || `Municipio ${index + 1}`,
            departamento: feature.properties.departamen,
            provincia: feature.properties.provincia,
            municipio: feature.properties.municipio,
            capital: feature.properties.capital,
            area_mun_h: feature.properties.area_mun_h
          }
        }))
      }

      map.current.addSource('municipios', {
        type: 'geojson',
        data: municipiosGeoJSON
      })

      // Capa de relleno para municipios
      map.current.addLayer({
        id: 'municipios-fill',
        type: 'fill',
        source: 'municipios',
        layout: { 'visibility': showMunicipios ? 'visible' : 'none' },
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.5,
          'fill-outline-color': '#ffffff'
        }
      })

      // Borde de los municipios
      map.current.addLayer({
        id: 'municipios-border',
        type: 'line',
        source: 'municipios',
        layout: { 'visibility': showMunicipios ? 'visible' : 'none' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })

      // Etiquetas para municipios
      map.current.addLayer({
        id: 'municipios-labels',
        type: 'symbol',
        source: 'municipios',
        layout: {
          'visibility': showMunicipios ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 14,
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-optional': true
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addMunicipiosToMap()
    } else {
      map.current.once('idle', addMunicipiosToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('municipios', ['municipios-fill', 'municipios-border', 'municipios-labels'])
      }
    }
  }, [municipios, mapLoaded, showMunicipios])

  // Capa de Maya (Parque Nacional Toro Toro)
  useEffect(() => {
    if (!map.current || !maya.length || !mapLoaded) return

    const addMayaToMap = () => {
      cleanupLayer('maya', ['maya-fill', 'maya-border', 'maya-labels'])

      const mayaGeoJSON = {
        type: 'FeatureCollection',
        features: maya
      }

      map.current.addSource('maya', {
        type: 'geojson',
        data: mayaGeoJSON
      })

      // Capa de relleno para Maya
      map.current.addLayer({
        id: 'maya-fill',
        type: 'fill',
        source: 'maya',
        layout: { 'visibility': showMaya ? 'visible' : 'none' },
        paint: {
          'fill-color': '#059669',
          'fill-opacity': 0.4,
          'fill-outline-color': '#047857'
        }
      })

      // Borde de Maya
      map.current.addLayer({
        id: 'maya-border',
        type: 'line',
        source: 'maya',
        layout: { 'visibility': showMaya ? 'visible' : 'none' },
        paint: {
          'line-color': '#047857',
          'line-width': 3,
          'line-opacity': 0.8
        }
      })

      // Etiquetas para Maya
      map.current.addLayer({
        id: 'maya-labels',
        type: 'symbol',
        source: 'maya',
        layout: {
          'visibility': showMaya ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 16,
          'text-offset': [0, 0],
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#065f46',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addMayaToMap()
    } else {
      map.current.once('idle', addMayaToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('maya', ['maya-fill', 'maya-border', 'maya-labels'])
      }
    }
  }, [maya, mapLoaded, showMaya])

  // Capa de Vías Principales
  useEffect(() => {
    if (!map.current || !viasPrincipales.length || !mapLoaded) return

    const addViasPrincipalesToMap = () => {
      cleanupLayer('vias-principales', ['vias-principales-layer', 'vias-principales-labels'])

      const viasPrincipalesGeoJSON = {
        type: 'FeatureCollection',
        features: viasPrincipales
      }

      map.current.addSource('vias-principales', {
        type: 'geojson',
        data: viasPrincipalesGeoJSON
      })

      map.current.addLayer({
        id: 'vias-principales-layer',
        type: 'line',
        source: 'vias-principales',
        layout: { 'visibility': showViasPrincipales ? 'visible' : 'none' },
        paint: {
          'line-color': '#dc2626',
          'line-width': 4,
          'line-opacity': 0.9
        }
      })

      map.current.addLayer({
        id: 'vias-principales-labels',
        type: 'symbol',
        source: 'vias-principales',
        layout: {
          'visibility': showViasPrincipales ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 12,
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-optional': true
        },
        paint: {
          'text-color': '#dc2626',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addViasPrincipalesToMap()
    } else {
      map.current.once("idle", addViasPrincipalesToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('vias-principales', ['vias-principales-layer', 'vias-principales-labels'])
      }
    }
  }, [viasPrincipales, mapLoaded, showViasPrincipales])

  // Capa de Vías Secundarias
  useEffect(() => {
    if (!map.current || !viasSecundarias.length || !mapLoaded) return

    const addViasSecundariasToMap = () => {
      cleanupLayer('vias-secundarias', ['vias-secundarias-layer', 'vias-secundarias-labels'])

      const viasSecundariasGeoJSON = {
        type: 'FeatureCollection',
        features: viasSecundarias
      }

      map.current.addSource('vias-secundarias', {
        type: 'geojson',
        data: viasSecundariasGeoJSON
      })

      map.current.addLayer({
        id: 'vias-secundarias-layer',
        type: 'line',
        source: 'vias-secundarias',
        layout: { 'visibility': showViasSecundarias ? 'visible' : 'none' },
        paint: {
          'line-color': '#f59e0b',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })

      map.current.addLayer({
        id: 'vias-secundarias-labels',
        type: 'symbol',
        source: 'vias-secundarias',
        layout: {
          'visibility': showViasSecundarias ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 11,
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-optional': true
        },
        paint: {
          'text-color': '#f59e0b',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addViasSecundariasToMap()
    } else {
      map.current.once("idle", addViasSecundariasToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('vias-secundarias', ['vias-secundarias-layer', 'vias-secundarias-labels'])
      }
    }
  }, [viasSecundarias, mapLoaded, showViasSecundarias])

  // Capa de Ríos Principales
  useEffect(() => {
    if (!map.current || !riosPrincipales.length || !mapLoaded) return

    const addRiosPrincipalesToMap = () => {
      cleanupLayer('rios-principales', ['rios-principales-layer', 'rios-principales-labels'])

      const riosPrincipalesGeoJSON = {
        type: 'FeatureCollection',
        features: riosPrincipales
      }

      map.current.addSource('rios-principales', {
        type: 'geojson',
        data: riosPrincipalesGeoJSON
      })

      map.current.addLayer({
        id: 'rios-principales-layer',
        type: 'line',
        source: 'rios-principales',
        layout: { 'visibility': showRiosPrincipales ? 'visible' : 'none' },
        paint: {
          'line-color': '#1e40af',
          'line-width': 3,
          'line-opacity': 0.8
        }
      })

      map.current.addLayer({
        id: 'rios-principales-labels',
        type: 'symbol',
        source: 'rios-principales',
        layout: {
          'visibility': showRiosPrincipales ? 'visible' : 'none',
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
      addRiosPrincipalesToMap()
    } else {
      map.current.once("idle", addRiosPrincipalesToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('rios-principales', ['rios-principales-layer', 'rios-principales-labels'])
      }
    }
  }, [riosPrincipales, mapLoaded, showRiosPrincipales])

  // Capa de Ríos Secundarios
  useEffect(() => {
    if (!map.current || !riosSecundarios.length || !mapLoaded) return

    const addRiosSecundariosToMap = () => {
      cleanupLayer('rios-secundarios', ['rios-secundarios-layer', 'rios-secundarios-labels'])

      const riosSecundariosGeoJSON = {
        type: 'FeatureCollection',
        features: riosSecundarios
      }

      map.current.addSource('rios-secundarios', {
        type: 'geojson',
        data: riosSecundariosGeoJSON
      })

      map.current.addLayer({
        id: 'rios-secundarios-layer',
        type: 'line',
        source: 'rios-secundarios',
        layout: { 'visibility': showRiosSecundarios ? 'visible' : 'none' },
        paint: {
          'line-color': '#1e40af',
          'line-width': 2,
          'line-opacity': 0.7
        }
      })

      map.current.addLayer({
        id: 'rios-secundarios-labels',
        type: 'symbol',
        source: 'rios-secundarios',
        layout: {
          'visibility': showRiosSecundarios ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 10,
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-optional': true
        },
        paint: {
          'text-color': '#60a5fa',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addRiosSecundariosToMap()
    } else {
      map.current.once("idle", addRiosSecundariosToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('rios-secundarios', ['rios-secundarios-layer', 'rios-secundarios-labels'])
      }
    }
  }, [riosSecundarios, mapLoaded, showRiosSecundarios])

  useEffect(() => {
    if (!map.current || !poligTor.length || !mapLoaded) return

    const addPoligTorToMap = () => {
      cleanupLayer('polig-tor', ['polig-tor-fill', 'polig-tor-border'])

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

    return () => {
      if (map.current) {
        cleanupLayer('polig-tor', ['polig-tor-fill', 'polig-tor-border'])
      }
    }
  }, [poligTor, mapLoaded, showPoligTor])

  useEffect(() => {
    if (!map.current || !departamentos.length || !mapLoaded) return

    const addDepartamentosToMap = () => {
      cleanupLayer('departamentos', ['departamentos-fill', 'departamentos-border'])

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

    return () => {
      if (map.current) {
        cleanupLayer('departamentos', ['departamentos-fill', 'departamentos-border'])
      }
    }
  }, [departamentos, mapLoaded, showDepartamentos])

  useEffect(() => {
    if (!map.current || !localidades.length || !mapLoaded) return

    const addLocalidadesToMap = () => {
      cleanupLayer('localidades', ['localidades-layer', 'localidades-labels'])

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
          'text-color': '#ff9000',
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

    return () => {
      if (map.current) {
        cleanupLayer('localidades', ['localidades-layer', 'localidades-labels'])
      }
    }
  }, [localidades, mapLoaded, showLocalidades])

  // Capa de Comunidades (POLÍGONOS)
  useEffect(() => {
    if (!map.current || !comunidades.length || !mapLoaded) return

    const addComunidadesToMap = () => {
      cleanupLayer('comunidades', ['comunidades-fill', 'comunidades-border', 'comunidades-labels'])

      const comunidadesGeoJSON = {
        type: 'FeatureCollection',
        features: comunidades.map((feature, index) => ({
          ...feature,
          properties: {
            ...feature.properties,
            id: feature.properties.id,
            nombre: feature.properties.comunidad || feature.properties.desciuloc || feature.properties.etiqueta || `Comunidad ${index + 1}`,
            color: coloresComunidades[index % coloresComunidades.length],
            total_poblacion: feature.properties.total,
            hombres: feature.properties.hombre,
            mujeres: feature.properties.mujer,
            porcentaje_quechua: feature.properties.perc_q,
            porcentaje_castellano: feature.properties.perc_c,
            porcentaje_indigena: feature.properties.perc_indg,
            porcentaje_jovenes: feature.properties.perc_15_35,
            departamento: feature.properties.n_depto,
            provincia: feature.properties.n_provin,
            canton: feature.properties.n_canton,
            quechua: feature.properties.quechua,
            castellano: feature.properties.castellano
          }
        }))
      }

      map.current.addSource('comunidades', {
        type: 'geojson',
        data: comunidadesGeoJSON
      })

      // Capa de relleno para comunidades
      map.current.addLayer({
        id: 'comunidades-fill',
        type: 'fill',
        source: 'comunidades',
        layout: { 'visibility': showComunidades ? 'visible' : 'none' },
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.6,
          'fill-outline-color': '#ffffff'
        }
      })

      // Borde de las comunidades
      map.current.addLayer({
        id: 'comunidades-border',
        type: 'line',
        source: 'comunidades',
        layout: { 'visibility': showComunidades ? 'visible' : 'none' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })

      // Etiquetas para comunidades
      map.current.addLayer({
        id: 'comunidades-labels',
        type: 'symbol',
        source: 'comunidades',
        layout: {
          'visibility': showComunidades ? 'visible' : 'none',
          'text-field': ['get', 'nombre'],
          'text-size': 14,
          'text-offset': [0, 0],
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      })
    }

    if (map.current.isStyleLoaded()) {
      addComunidadesToMap()
    } else {
      map.current.once('idle', addComunidadesToMap)
    }

    return () => {
      if (map.current) {
        cleanupLayer('comunidades', ['comunidades-fill', 'comunidades-border', 'comunidades-labels'])
      }
    }
  }, [comunidades, mapLoaded, showComunidades])

  useEffect(() => {
    if (!map.current || !tracks.features || tracks.features.length === 0 || !mapLoaded) return

    const addTracksToMap = () => {
      cleanupLayer('tracks', ['tracks-layer', 'tracks-glow'])

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

    return () => {
      if (map.current) {
        cleanupLayer('tracks', ['tracks-layer', 'tracks-glow'])
      }
    }
  }, [tracks, mapLoaded, showTracks])

  useEffect(() => {
    if (!map.current || !areasProtegidas.length || !mapLoaded) return

    const addAreasProtegidasToMap = () => {
      cleanupLayer('areas', ['areas-3d', 'areas-fill', 'areas-border'])

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

    return () => {
      if (map.current) {
        cleanupLayer('areas', ['areas-3d', 'areas-fill', 'areas-border'])
      }
    }
  }, [areasProtegidas, mapLoaded, showAreas])

  useEffect(() => {
    if (!map.current || !servicios.length || !mapLoaded) return

    const addServiciosToMap = () => {
      cleanupLayer('servicios', ['servicios-layer', 'servicios-labels'])

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

    return () => {
      if (map.current) {
        cleanupLayer('servicios', ['servicios-layer', 'servicios-labels'])
      }
    }
  }, [servicios, mapLoaded, showServicios])

  useEffect(() => {
    if (!map.current || !atractivos.length || !mapLoaded) return

    const addAtractivosToMap = () => {
      cleanupLayer('atractivos', ['atractivos-layer', 'atractivos-labels'])

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

    return () => {
      if (map.current) {
        cleanupLayer('atractivos', ['atractivos-layer', 'atractivos-labels'])
      }
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

  const popupStyles = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '420px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    padding: '25px',
    zIndex: 1000,
    maxHeight: '80vh',
    overflowY: 'auto'
  }

  const closeButtonStyles = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '16px'
  }

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
        <button onClick={() => setShowProvincias(!showProvincias)} style={toggleButtonStyles(showProvincias)}>
          <span>🏛️</span> Provincias {showProvincias ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowMunicipios(!showMunicipios)} style={toggleButtonStyles(showMunicipios)}>
          <span>🏛️</span> Municipios {showMunicipios ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowLocalidades(!showLocalidades)} style={toggleButtonStyles(showLocalidades)}>
          <span>🏘️</span> Localidades {showLocalidades ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowComunidades(!showComunidades)} style={toggleButtonStyles(showComunidades)}>
          <span>👥</span> Comunidades {showComunidades ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowMaya(!showMaya)} style={toggleButtonStyles(showMaya)}>
          <span>🌳</span> Parque Nacional {showMaya ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowPoligTor(!showPoligTor)} style={toggleButtonStyles(showPoligTor)}>
          <span>📍</span> Polígono Toro Toro {showPoligTor ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowRiosPrincipales(!showRiosPrincipales)} style={toggleButtonStyles(showRiosPrincipales)}>
          <span>🌊</span> Ríos Principales {showRiosPrincipales ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowRiosSecundarios(!showRiosSecundarios)} style={toggleButtonStyles(showRiosSecundarios)}>
          <span>💧</span> Ríos Secundarios {showRiosSecundarios ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowViasPrincipales(!showViasPrincipales)} style={toggleButtonStyles(showViasPrincipales)}>
          <span>🛣️</span> Vías Principales {showViasPrincipales ? '✓' : '✗'}
        </button>
        <button onClick={() => setShowViasSecundarias(!showViasSecundarias)} style={toggleButtonStyles(showViasSecundarias)}>
          <span>🛣️</span> Vías Secundarias {showViasSecundarias ? '✓' : '✗'}
        </button>
      </div>
      
      {/* Panel de información */}
      {showPopup && (
        <div style={popupStyles}>
          <button onClick={ocultarInfo} style={closeButtonStyles}>×</button>
          
          {popupType === 'servicio' && servicioSeleccionado && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #3b82f6', paddingBottom: '10px', fontSize: '20px' }}>
                🏠 {servicioSeleccionado.nombre_servicio}
              </h3>
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Tipo de servicio:</strong>
                <span style={{ display: 'inline-block', background: '#3b82f6', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {servicioSeleccionado.tipo_servicio}
                </span>
              </div>
              {servicioSeleccionado.costo && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Costo:</strong>
                  <span style={{ marginLeft: '10px', color: '#2ecc71', fontWeight: 'bold', fontSize: '16px' }}>Bs {servicioSeleccionado.costo}</span>
                </div>
              )}
              {servicioSeleccionado.direccion && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Dirección:</strong>
                  <p style={{ margin: '8px 0 0 0', color: '#555', fontSize: '15px', lineHeight: '1.4' }}>{servicioSeleccionado.direccion}</p>
                </div>
              )}
              {servicioSeleccionado.telefono && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Teléfono:</strong>
                  <span style={{ marginLeft: '10px', color: '#555', fontSize: '16px' }}>{servicioSeleccionado.telefono}</span>
                </div>
              )}
              {servicioSeleccionado.calificacion && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Calificación:</strong>
                  <span style={{ marginLeft: '10px', color: '#f39c12', fontWeight: 'bold', fontSize: '16px' }}>⭐ {servicioSeleccionado.calificacion}/5</span>
                </div>
              )}
              {servicioSeleccionado.nombre_atractivo && (
                <div style={{ marginTop: '18px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Atractivo turístico asociado:</strong>
                  <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '16px' }}>{servicioSeleccionado.nombre_atractivo}</span>
                </div>
              )}
            </>
          )}

          {popupType === 'atractivo' && atractivoSeleccionado && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #10b981', paddingBottom: '10px', fontSize: '20px' }}>
                🏞️ {atractivoSeleccionado.nombre}
              </h3>
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Tipo de atractivo:</strong>
                <span style={{ display: 'inline-block', background: '#10b981', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {atractivoSeleccionado.tipo_atractivo}
                </span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Estado:</strong>
                <span style={{ display: 'inline-block', background: getEstadoColor(atractivoSeleccionado.estado), color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {atractivoSeleccionado.estado}
                </span>
              </div>
              {atractivoSeleccionado.tiempo_visita && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Tiempo de visita:</strong>
                  <span style={{ marginLeft: '10px', color: '#555', fontSize: '16px' }}>{atractivoSeleccionado.tiempo_visita} minutos</span>
                </div>
              )}
              {atractivoSeleccionado.elevacion && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Elevación:</strong>
                  <span style={{ marginLeft: '10px', color: '#555', fontSize: '16px' }}>{atractivoSeleccionado.elevacion} m.s.n.m</span>
                </div>
              )}
            </>
          )}

          {popupType === 'area' && areaSeleccionada && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #8b5cf6', paddingBottom: '10px', fontSize: '20px' }}>
                🛡️ Área Protegida 3D
              </h3>
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Visualización:</strong>
                <span style={{ display: 'inline-block', background: '#8b5cf6', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  Extrusión 3D
                </span>
              </div>
              {areaSeleccionada.descripcion && (
                <div style={{ marginBottom: '18px' }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Descripción:</strong>
                  <p style={{ margin: 0, color: '#555', lineHeight: '1.5', fontSize: '15px' }}>{areaSeleccionada.descripcion}</p>
                </div>
              )}
              {areaSeleccionada.nombre_atractivo && (
                <div style={{ marginTop: '18px', padding: '12px', background: '#faf5ff', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Atractivo Turístico Asociado:</strong>
                  <span style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: '16px' }}>{areaSeleccionada.nombre_atractivo}</span>
                </div>
              )}
            </>
          )}

          {popupType === 'localidad' && localidadSeleccionada && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #eab308', paddingBottom: '10px', fontSize: '20px' }}>
                🏘️ {localidadSeleccionada.nombre}
              </h3>
              <div style={{ marginBottom: '18px'}}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Nombre:</strong>
                <span style={{ display: 'inline-block', background: '#fbbf24', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {localidadSeleccionada.nombre}
                </span>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Categoría:</strong>
                <span style={{ display: 'inline-block', background: '#eab308', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {localidadSeleccionada.categoria}
                </span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Subcategoría:</strong>
                <span style={{ display: 'inline-block', background: '#f59e0b', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {localidadSeleccionada.subcategoria}
                </span>
              </div>
            </>
          )}

          {popupType === 'comunidad' && comunidadSeleccionada && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #a78bfa', paddingBottom: '10px', fontSize: '20px' }}>
                👥 {comunidadSeleccionada.comunidad || comunidadSeleccionada.desciuloc || comunidadSeleccionada.etiqueta}
              </h3>
              
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Ubicación:</strong>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ display: 'inline-block', background: '#a78bfa', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginRight: '8px', marginBottom: '5px' }}>
                    {comunidadSeleccionada.n_depto}
                  </span>
                  <span style={{ display: 'inline-block', background: '#c4b5fd', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginRight: '8px', marginBottom: '5px' }}>
                    {comunidadSeleccionada.n_provin}
                  </span>
                  <span style={{ display: 'inline-block', background: '#ddd6fe', color: '#6d28d9', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginBottom: '5px' }}>
                    {comunidadSeleccionada.n_canton}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Población:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '8px' }}>
                  <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>{comunidadSeleccionada.total}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px', background: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{comunidadSeleccionada.hombre}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Hombres</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px', background: '#fdf2f8', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ec4899' }}>{comunidadSeleccionada.mujer}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Mujeres</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Idiomas:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                  <div style={{ textAlign: 'center', padding: '10px', background: '#fef3c7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#d97706' }}>{comunidadSeleccionada.perc_q}%</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Quechua</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px', background: '#dbeafe', borderRadius: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1d4ed8' }}>{comunidadSeleccionada.perc_c}%</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Castellano</div>
                  </div>
                </div>
              </div>

              {comunidadSeleccionada.perc_indg && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Población Indígena:</strong>
                  <span style={{ marginLeft: '10px', color: '#7c3aed', fontWeight: 'bold', fontSize: '16px' }}>{comunidadSeleccionada.perc_indg}%</span>
                </div>
              )}

              {comunidadSeleccionada.perc_15_35 && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Población Joven (15-35 años):</strong>
                  <span style={{ marginLeft: '10px', color: '#059669', fontWeight: 'bold', fontSize: '16px' }}>{comunidadSeleccionada.perc_15_35}%</span>
                </div>
              )}

              {comunidadSeleccionada.quechua && (
                <div style={{ marginTop: '18px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #a78bfa' }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Hablantes de Quechua:</strong>
                  <span style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: '16px' }}>{comunidadSeleccionada.quechua} personas</span>
                </div>
              )}

              {comunidadSeleccionada.castellano && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Hablantes de Castellano:</strong>
                  <span style={{ color: '#1d4ed8', fontWeight: 'bold', fontSize: '16px' }}>{comunidadSeleccionada.castellano} personas</span>
                </div>
              )}
            </>
          )}

          {popupType === 'maya' && mayaSeleccionada && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #059669', paddingBottom: '10px', fontSize: '20px' }}>
                🌳 {mayaSeleccionada.nombre}
              </h3>
              
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Tipo de Área:</strong>
                <span style={{ display: 'inline-block', background: '#059669', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {mayaSeleccionada.designa}
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Jurisdicción:</strong>
                <span style={{ display: 'inline-block', background: '#047857', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {mayaSeleccionada.jurisdicci}
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Departamento:</strong>
                <span style={{ display: 'inline-block', background: '#065f46', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {mayaSeleccionada.depto}
                </span>
              </div>

              <div style={{ marginTop: '18px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
                <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Información del Parque Nacional:</strong>
                <p style={{ margin: 0, color: '#065f46', lineHeight: '1.5', fontSize: '15px' }}>
                  El Parque Nacional Toro Toro es un área protegida de Bolivia que conserva importantes 
                  recursos naturales, culturales y paleontológicos en la región.
                </p>
              </div>
            </>
          )}

          {popupType === 'municipio' && municipioSeleccionado && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #4ECDC4', paddingBottom: '10px', fontSize: '20px' }}>
                🏛️ {municipioSeleccionado.capital || municipioSeleccionado.municipio}
              </h3>
              
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Municipio:</strong>
                <span style={{ display: 'inline-block', background: '#4ECDC4', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {municipioSeleccionado.municipio}
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Capital:</strong>
                <span style={{ display: 'inline-block', background: '#45B7D1', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {municipioSeleccionado.capital}
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Departamento:</strong>
                <span style={{ display: 'inline-block', background: '#FF6B6B', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {municipioSeleccionado.departamen}
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Provincia:</strong>
                <span style={{ display: 'inline-block', background: '#96CEB4', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {municipioSeleccionado.provincia}
                </span>
              </div>

              {municipioSeleccionado.area_mun_h && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Área Municipal:</strong>
                  <span style={{ marginLeft: '10px', color: '#059669', fontWeight: 'bold', fontSize: '16px' }}>{municipioSeleccionado.area_mun_h} ha</span>
                </div>
              )}

              <div style={{ marginTop: '18px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #4ECDC4' }}>
                <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Información del Municipio:</strong>
                <p style={{ margin: 0, color: '#1e40af', lineHeight: '1.5', fontSize: '15px' }}>
                  Este municipio forma parte de la organización territorial de Bolivia y representa 
                  una unidad administrativa local con su propia identidad y características.
                </p>
              </div>
            </>
          )}

          {popupType === 'provincia' && provinciaSeleccionada && (
            <>
              <h3 style={{ margin: '0 0 18px 0', color: '#333', borderBottom: '2px solid #FF6B6B', paddingBottom: '10px', fontSize: '20px' }}>
                🏛️ {provinciaSeleccionada.provincia}
              </h3>
              
              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Provincia:</strong>
                <span style={{ display: 'inline-block', background: '#FF6B6B', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {provinciaSeleccionada.provincia}
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <strong style={{ color: '#666', fontSize: '16px' }}>Departamento:</strong>
                <span style={{ display: 'inline-block', background: '#4ECDC4', color: 'white', padding: '5px 10px', borderRadius: '12px', fontSize: '14px', marginLeft: '10px', marginTop: '5px' }}>
                  {provinciaSeleccionada.departamen}
                </span>
              </div>

              {provinciaSeleccionada.c_ut && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Código UT:</strong>
                  <span style={{ marginLeft: '10px', color: '#059669', fontWeight: 'bold', fontSize: '16px' }}>{provinciaSeleccionada.c_ut}</span>
                </div>
              )}

              {provinciaSeleccionada.shape_area && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '16px' }}>Área:</strong>
                  <span style={{ marginLeft: '10px', color: '#3b82f6', fontWeight: 'bold', fontSize: '16px' }}>{parseFloat(provinciaSeleccionada.shape_area).toFixed(2)} km²</span>
                </div>
              )}

              <div style={{ marginTop: '18px', padding: '12px', background: '#fff5f5', borderRadius: '8px', borderLeft: '4px solid #FF6B6B' }}>
                <strong style={{ color: '#666', display: 'block', marginBottom: '6px', fontSize: '16px' }}>Información de la Provincia:</strong>
                <p style={{ margin: 0, color: '#dc2626', lineHeight: '1.5', fontSize: '15px' }}>
                  Esta provincia forma parte de la división territorial intermedia de Bolivia, 
                  entre departamentos y municipios, con características geográficas y culturales propias.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}