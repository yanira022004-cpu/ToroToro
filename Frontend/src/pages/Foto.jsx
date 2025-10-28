import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Foto = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [atractivos, setAtractivos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Temas mejorados
  const lightTheme = {
    bg: "#f8fafc",
    card: "#ffffff",
    text: "#1e293b",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    border: "#e2e8f0",
    subtle: "#64748b",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    shadowHover: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  };

  const darkTheme = {
    bg: "#0f172a",
    card: "#1e293b",
    text: "#f1f5f9",
    accent: "#60a5fa",
    accentHover: "#3b82f6",
    border: "#334155",
    subtle: "#94a3b8",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    shadowHover: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
  };

  const theme = darkMode ? darkTheme : lightTheme;

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    sidebar: {
      width: "260px",
      backgroundColor: theme.card,
      padding: "28px 20px",
      borderRight: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: theme.shadow,
      transition: "all 0.3s ease",
    },
    sidebarHeader: {
      marginBottom: "32px",
      paddingBottom: "20px",
      borderBottom: `1px solid ${theme.border}`,
    },
    sidebarTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: theme.accent,
      textAlign: "center",
      margin: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    sidebarNav: {
      flex: 1,
    },
    sidebarItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      margin: "8px 0",
      cursor: "pointer",
      padding: "12px 16px",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      fontSize: "15px",
      fontWeight: "500",
      color: theme.text,
      textDecoration: "none",
      ":hover": {
        backgroundColor: theme.accent + "20",
        transform: "translateX(4px)",
      },
    },
    activeSidebarItem: {
      backgroundColor: theme.accent,
      color: "white",
      boxShadow: theme.shadow,
    },
    sidebarFooter: {
      paddingTop: "20px",
      borderTop: `1px solid ${theme.border}`,
    },
    navbar: {
      backgroundColor: theme.card,
      padding: "18px 32px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      transition: "background 0.3s ease",
    },
    main: {
      flex: 1,
      padding: "32px",
      width: "100%",
    },
    header: {
      marginBottom: "32px",
      textAlign: "center",
    },
    headerTitle: {
      fontSize: "32px",
      fontWeight: "800",
      color: theme.text,
      margin: "0 0 8px 0",
      background: `linear(135deg, ${theme.accent}, ${theme.accentHover})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    photosGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "24px",
      padding: "20px 0",
    },
    photoCard: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "16px",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: theme.shadow,
      cursor: "pointer",
      ":hover": {
        transform: "translateY(-8px)",
        boxShadow: theme.shadowHover,
        borderColor: theme.accent,
      },
    },
    photoImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
    photoContent: {
      padding: "20px",
    },
    photoTitle: {
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "12px",
      color: theme.text,
    },
    photoInfo: {
      fontSize: "14px",
      color: theme.subtle,
      marginBottom: "6px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    mapLink: {
      display: "inline-block",
      marginTop: "12px",
      padding: "8px 16px",
      backgroundColor: theme.accent,
      color: "white",
      textDecoration: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      ":hover": {
        backgroundColor: theme.accentHover,
        transform: "translateY(-1px)",
      },
    },
    footer: {
      textAlign: "center",
      fontSize: "14px",
      color: theme.subtle,
      marginTop: "32px",
      paddingTop: "20px",
      borderTop: `1px solid ${theme.border}`,
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    darkButton: {
      backgroundColor: theme.accent,
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "14px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "100%",
      justifyContent: "center",
      ":hover": {
        backgroundColor: theme.accentHover,
        transform: "translateY(-1px)",
        boxShadow: theme.shadow,
      },
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "300px",
      fontSize: "18px",
      color: theme.subtle,
      flexDirection: "column",
      gap: "16px",
    },
    loadingSpinner: {
      width: "40px",
      height: "40px",
      border: `3px solid ${theme.border}`,
      borderTop: `3px solid ${theme.accent}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    placeholderImage: {
      width: "100%",
      height: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `linear-gradient(135deg, ${theme.accent}20, ${theme.accentHover}20)`,
      color: theme.accent,
      fontSize: "48px",
    },
  };

  useEffect(() => {
    const fetchAtractivos = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/all");
        const data = await res.json();
        setAtractivos(data);
      } catch (err) {
        console.error("Error al cargar atractivos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAtractivos();
  }, []);

  // Componente para cada tarjeta de imagen
  const PhotoCard = ({ item }) => {
    const [imageError, setImageError] = useState(false);

    // Función para obtener imagen local
    const getLocalImage = (idAtractivo) => {
      return `/images/${idAtractivo}.jpg`;
    };

    // Función para generar enlace a Google Maps
    const getGoogleMapsLink = (latitud, longitud, nombre) => {
      if (!latitud || !longitud) {
        return `https://www.google.com/maps/search/${encodeURIComponent(nombre + " Torotoro")}`;
      }
      
      return `https://www.google.com/maps?q=${latitud},${longitud}`;
    };

    // Función para obtener emoji según el tipo
    const getTypeEmoji = (tipo) => {
      switch (tipo?.toUpperCase()) {
        case "FOSIL":
          return "🦴";
        case "GEOLOGICO":
          return "🏔️";
        case "ARQUEOLOGICO":
          return "🏺";
        case "PALEONTOLOGICO":
          return "🧬";
        case "NATURAL":
          return "🌿";
        case "CULTURAL":
          return "🎭";
        default:
          return "📍";
      }
    };

    return (
      <div style={styles.photoCard}>
        {!imageError ? (
          <img 
            src={getLocalImage(item.id_atractivo)}
            alt={item.nombre_atractivo}
            style={styles.photoImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={styles.placeholderImage}>
            {getTypeEmoji(item.tipo_atractivo)}
          </div>
        )}
        
        <div style={styles.photoContent}>
          <h3 style={styles.photoTitle}>
            {getTypeEmoji(item.tipo_atractivo)} {item.nombre_atractivo}
          </h3>
          
          <div style={styles.photoInfo}>
            <span>📌</span>
            <strong>Tipo:</strong> {item.tipo_atractivo}
          </div>
          
          <div style={styles.photoInfo}>
            <span>🏷️</span>
            <strong>Categoría:</strong> {item.nombre_categoria}
          </div>
          
          <div style={styles.photoInfo}>
            <span>📊</span>
            <strong>Estado:</strong> {item.estado}
          </div>
          
          <div style={styles.photoInfo}>
            <span>⚠️</span>
            <strong>Riesgo:</strong> {item.nivel_riesgo}
          </div>

          {item.latitud && item.longitud && (
            <div style={styles.photoInfo}>
              <span>📍</span>
              <strong>Coords:</strong> {parseFloat(item.latitud).toFixed(4)}, {parseFloat(item.longitud).toFixed(4)}
            </div>
          )}

          <a 
            href={getGoogleMapsLink(item.latitud, item.longitud, item.nombre_atractivo)}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mapLink}
          >
            📍 Ver en Google Maps
          </a>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>
              <span>🏞️</span>
              Torotoro App
            </h2>
          </div>
          <nav style={styles.sidebarNav}>
            <Link to="/" style={styles.link}>
              <div style={styles.sidebarItem}>
                <span>📊</span>
                Dashboard
              </div>
            </Link>
            <Link to="/servicios" style={styles.link}>
              <div style={styles.sidebarItem}>
                <span>🍽️</span>
                Servicios
              </div>
            </Link>
            <Link to="/mapa3d" style={styles.link}>
              <div style={styles.sidebarItem}>
                <span>🌍</span>
                Mapa 3D
              </div>
            </Link>
            <div style={{...styles.sidebarItem, ...styles.activeSidebarItem}}>
              <span>🖼️</span>
              Galería
            </div>
          </nav>
        </div>
        
        <div style={styles.sidebarFooter}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={styles.darkButton}
          >
            {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <nav style={styles.navbar}>
          <h3 style={{ 
            color: theme.accent, 
            fontWeight: "700",
            fontSize: "18px",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>🖼️</span>
            Galería de Atractivos Turísticos
          </h3>
          <div style={{ 
            fontSize: "14px", 
            color: theme.subtle,
            fontWeight: "500"
          }}>
            {atractivos.length} atractivos
          </div>
        </nav>

        <main style={styles.main}>
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>Galería Visual de Torotoro</h1>
          </header>

          {/* 🔹 Grid de Fotos */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <div>Cargando galería...</div>
            </div>
          ) : (
            <div style={styles.photosGrid}>
              {atractivos.map((item, index) => (
                <PhotoCard key={index} item={item} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};