import { useEffect, useRef } from "react"
import { useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = "pk.eyJ1IjoidXNvcGRldiIsImEiOiJjbWd2ZW1ubGkwcW5xMm5uYXhtb2ptZHF4In0.OE8nb_G4PE0_PduKWdjunw"

export const Mapa3d = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [servicios, setServicios] = useState([])
  const [atractivos, setAtractivos] = useState([])

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
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-65.76089878880695, -18.133500687445764],
      zoom: 15,
      pitch: 60,
      bearing: -17.6,
      antialias: true,
    })

    map.current.on("load", () => {
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
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      )
    })
  }, [])

  useEffect(() => {
    if (!map.current) return
    servicios.forEach((s) => {
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([s.longitud, s.latitud])
        .addTo(map.current)
    })
  }, [servicios])

  useEffect(() => {
    if (!map.current) return
    atractivos.forEach((a) => {
      new mapboxgl.Marker({ color: "green" })
        .setLngLat([a.longitud, a.latitud])
        .addTo(map.current)
    })
  }, [atractivos])

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
    </div>
  )
}
