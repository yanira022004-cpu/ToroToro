import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = "pk.eyJ1IjoidXNvcGRldiIsImEiOiJjbWd2ZW1ubGkwcW5xMm5uYXhtb2ptZHF4In0.OE8nb_G4PE0_PduKWdjunw"

export const HuellaDinosaurio3D = () => {
    const mapContainerRef = useRef(null)
    const map = useRef(null)
    const [mapLoaded, setMapLoaded] = useState(false)

    // Coordenadas del área general de Toro Toro
    const TORO_TORO_COORDINATES = {
        center: [-65.760448683932, -18.131938921524316],
        zoom: 14, // Zoom para ver todas las huellas
        pitch: 45,
        bearing: 0
    }

    // Datos de ejemplo de huellas de dinosaurio en Toro Toro
    const huellasDinosaurios = [
        {
            id: 1,
            nombre: "Huellas del Cañón",
            coordenadas: [-65.760448683932, -18.131938921524316],
            tipo: "Terópodo",
            descripcion: "Conjunto de huellas de dinosaurios carnívoros"
        },
        {
            id: 2,
            nombre: "Sendero de Huellas",
            coordenadas: [-65.758000, -18.130000],
            tipo: "Saurópodo",
            descripcion: "Secuencia de huellas de herbívoros grandes"
        },
        {
            id: 3,
            nombre: "Mirador de Huellas",
            coordenadas: [-65.762000, -18.133000],
            tipo: "Terópodo",
            descripcion: "Huellas bien conservadas en roca plana"
        },
        {
            id: 4,
            nombre: "Cerro de las Huellas",
            coordenadas: [-65.755000, -18.135000],
            tipo: "Ornitópodo",
            descripcion: "Huellas de dinosaurios bípedos herbívoros"
        },
        {
            id: 5,
            nombre: "Valle de los Dinosaurios",
            coordenadas: [-65.765000, -18.128000],
            tipo: "Varios tipos",
            descripcion: "Área con múltiples tipos de huellas"
        }
    ]

    useEffect(() => {
        if (map.current) return

        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/satellite-v9",
            center: TORO_TORO_COORDINATES.center,
            zoom: TORO_TORO_COORDINATES.zoom,
            pitch: TORO_TORO_COORDINATES.pitch,
            bearing: TORO_TORO_COORDINATES.bearing,
            antialias: true,
            maxZoom: 18,
            minZoom: 12
        })

        map.current.on("load", () => {
            setMapLoaded(true)

            // Crear GeoJSON con todas las huellas
            const huellasGeoJSON = {
                type: "FeatureCollection",
                features: huellasDinosaurios.map(huella => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: huella.coordenadas
                    },
                    properties: {
                        id: huella.id,
                        nombre: huella.nombre,
                        tipo: huella.tipo,
                        descripcion: huella.descripcion
                    }
                }))
            }

            // Añadir fuente GeoJSON con todas las huellas
            map.current.addSource("todas-las-huellas", {
                type: "geojson",
                data: huellasGeoJSON
            })

            // Capa de círculos para las huellas
            map.current.addLayer({
                id: "huellas-puntos",
                type: "circle",
                source: "todas-las-huellas",
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        12, 6,
                        16, 10,
                        18, 12
                    ],
                    "circle-color": [
                        "match",
                        ["get", "tipo"],
                        "Terópodo", "#ff4444",
                        "Saurópodo", "#44ff44",
                        "Ornitópodo", "#4444ff",
                        "Varios tipos", "#ffaa00",
                        "#888888"
                    ],
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                    "circle-opacity": 0.8
                }
            })

            // Añadir marcadores para cada huella
            huellasDinosaurios.forEach(huella => {
                // Crear elemento HTML personalizado para el marcador
                const markerElement = document.createElement('div')
                markerElement.className = 'custom-marker'
                markerElement.innerHTML = `
                    <div style="
                        background-color: ${getColorByTipo(huella.tipo)};
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        cursor: pointer;
                    "></div>
                `

                new mapboxgl.Marker({
                    element: markerElement,
                    anchor: 'center'
                })
                    .setLngLat(huella.coordenadas)
                    .setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`
                            <div style="padding: 10px;">
                                <h3 style="margin: 0 0 8px 0; color: #333;">${huella.nombre}</h3>
                                <p style="margin: 4px 0;"><strong>Tipo:</strong> ${huella.tipo}</p>
                                <p style="margin: 4px 0;">${huella.descripcion}</p>
                                <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">
                                    Coordenadas: ${huella.coordenadas[0].toFixed(6)}, ${huella.coordenadas[1].toFixed(6)}
                                </p>
                            </div>
                        `))
                    .addTo(map.current)
            })

            // Añadir leyenda
            const legend = document.createElement('div')
            legend.className = 'map-legend'
            legend.innerHTML = `
                <div style="
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    z-index: 1;
                ">
                    <h4 style="margin: 0 0 10px 0;">Leyenda de Huellas</h4>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 12px; height: 12px; background: #ff4444; border-radius: 50%; margin-right: 8px; border: 2px solid white;"></div>
                        <span>Terópodos (Carnívoros)</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 12px; height: 12px; background: #44ff44; border-radius: 50%; margin-right: 8px; border: 2px solid white;"></div>
                        <span>Saurópodos (Herbívoros grandes)</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <div style="width: 12px; height: 12px; background: #4444ff; border-radius: 50%; margin-right: 8px; border: 2px solid white;"></div>
                        <span>Ornitópodos (Bípedos herbívoros)</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div style="width: 12px; height: 12px; background: #ffaa00; border-radius: 50%; margin-right: 8px; border: 2px solid white;"></div>
                        <span>Varios tipos</span>
                    </div>
                </div>
            `
            mapContainerRef.current.appendChild(legend)

            // Añadir controles de navegación
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

            // Añadir control de escala
            map.current.addControl(new mapboxgl.ScaleControl({
                maxWidth: 100,
                unit: 'metric'
            }), 'bottom-left')
        })

        // Función para obtener color por tipo de dinosaurio
        function getColorByTipo(tipo) {
            switch(tipo) {
                case 'Terópodo': return '#ff4444'
                case 'Saurópodo': return '#44ff44'
                case 'Ornitópodo': return '#4444ff'
                case 'Varios tipos': return '#ffaa00'
                default: return '#888888'
            }
        }

        return () => {
            if (map.current) {
                map.current.remove()
            }
        }
    }, [])

    return (
        <div
            ref={mapContainerRef}
            style={{ 
                width: "100%", 
                height: "100vh",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative"
            }}
        />
    )
}