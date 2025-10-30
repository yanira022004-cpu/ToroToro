import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ServiciosDashboard = () => {
  // 🔹 Estado para el modo oscuro
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Temas mejorados
  const lightTheme = {
    bg: "#f8fafc",
    card: "#ffffff",
    text: "#1e293b",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    border: "#e2e8f0",
    subtle: "#64748b",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
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
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#f87171",
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
      lineHeight: "1.6",
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
      maxWidth: "1400px",
      margin: "0 auto",
      width: "100%",
    },
    header: {
      marginBottom: "32px",
      textAlign: "center",
    },
    headerTitle: {
      fontSize: "28px",
      fontWeight: "700",
      color: theme.text,
      margin: "0 0 8px 0",
      background: `linear(135deg, ${theme.accent}, ${theme.accentHover})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    headerSubtitle: {
      fontSize: "16px",
      color: theme.subtle,
      margin: 0,
      fontWeight: "400",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "32px",
    },
    statCard: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "20px",
      transition: "all 0.3s ease",
      boxShadow: theme.shadow,
    },
    statNumber: {
      fontSize: "24px",
      fontWeight: "800",
      color: theme.accent,
      margin: "4px 0",
    },
    statLabel: {
      fontSize: "14px",
      color: theme.subtle,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: 0,
    },
    tableContainer: {
      backgroundColor: theme.card,
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
      overflow: "hidden",
      boxShadow: theme.shadow,
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
      minWidth: "1000px",
    },
    th: {
      backgroundColor: theme.accent,
      color: "white",
      padding: "16px 12px",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "14px 12px",
      borderBottom: `1px solid ${theme.border}`,
      color: theme.text,
      whiteSpace: "nowrap",
    },
    tdNumero: {
      padding: "14px 12px",
      borderBottom: `1px solid ${theme.border}`,
      fontSize: "15px",
      fontWeight: "700",
      textAlign: "center",
      color: theme.accent,
      fontFeatureSettings: "'tnum'",
    },
    tr: {
      transition: "background 0.2s ease",
      ":hover": {
        backgroundColor: darkMode ? "rgba(96, 165, 250, 0.1)" : "rgba(59, 130, 246, 0.05)",
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
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px",
      fontSize: "16px",
      color: theme.subtle,
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    rating: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      fontWeight: "600",
    },
    costBadge: {
      backgroundColor: theme.success + "20",
      color: theme.success,
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "700",
    },
  };

  // ================================
  // 🔹 Estado y carga de datos
  // ================================
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/servicios");
        const data = await res.json();
        setServicios(data);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  // 🔹 Estadísticas calculadas
  const totalServicios = servicios.length;
  const tiposServicio = [...new Set(servicios.map(s => s.tipo_servicio))].length;
  const costoPromedio = servicios.length > 0 
    ? (servicios.reduce((sum, s) => sum + (parseFloat(s.costo) || 0), 0) / servicios.length).toFixed(2)
    : 0;
  const mejorCalificado = servicios.length > 0 
    ? servicios.reduce((best, current) => 
        (parseFloat(current.calificacion) || 0) > (parseFloat(best.calificacion) || 0) ? current : best
      )
    : null;

  const getTipoServicioColor = (tipo) => {
    const tipos = {
      'HOSPEDAJE': theme.accent,
      'ALIMENTACIÓN': theme.success,
      'TRANSPORTE': theme.warning,
      'GUÍA': theme.danger,
    };
    return tipos[tipo] || theme.subtle;
  };

  const getRatingStars = (calificacion) => {
    const rating = parseFloat(calificacion) || 0;
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return stars;
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
            <div style={{...styles.sidebarItem, ...styles.activeSidebarItem}}>
              <span>🍽️</span>
              Servicios
            </div>
            <Link to="/mapa3d" style={styles.link}>
              <div style={styles.sidebarItem}>
                <span>🌍</span>
                Mapa 3D
              </div>
            </Link>
            <Link to="/foto" style={styles.link}>
              <div style={styles.sidebarItem}>
                <span>🖼️</span>
                Galería
              </div>
            </Link>
          </nav>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={styles.darkButton}
          >
            {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
          </button>
        </div>
        
        <div style={styles.sidebarFooter}>
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
            <span>🍽️</span>
            Panel de Servicios Turísticos
          </h3>
          <div style={{ 
            fontSize: "14px", 
            color: theme.subtle,
            fontWeight: "500"
          }}>
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </nav>

        <main style={styles.main}>
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>Gestión de Servicios Turísticos</h1>
            <p style={styles.headerSubtitle}>Directorio completo de servicios disponibles en Torotoro</p>
          </header>

          {/* 🔹 Estadísticas Rápidas */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{totalServicios}</div>
              <h3 style={styles.statLabel}>Total Servicios</h3>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{tiposServicio}</div>
              <h3 style={styles.statLabel}>Tipos de Servicio</h3>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{costoPromedio} Bs</div>
              <h3 style={styles.statLabel}>Costo Promedio</h3>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>
                {mejorCalificado ? parseFloat(mejorCalificado.calificacion).toFixed(1) : '0.0'}
              </div>
              <h3 style={styles.statLabel}>Mejor Calificación</h3>
            </div>
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div>Cargando servicios...</div>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Atractivo Turístico</th>
                    <th style={styles.th}>Nombre del Servicio</th>
                    <th style={styles.th}>Tipo de Servicio</th>
                    <th style={styles.th}>Costo</th>
                    <th style={styles.th}>Dirección</th>
                    <th style={styles.th}>Teléfono</th>
                    <th style={styles.th}>Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((servicio, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.tdNumero}>{index + 1}</td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "600" }}>{servicio.nombre_atractivo}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: "500" }}>{servicio.nombre_servicio}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: getTipoServicioColor(servicio.tipo_servicio) + "20",
                          color: getTipoServicioColor(servicio.tipo_servicio)
                        }}>
                          {servicio.tipo_servicio}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.costBadge}>
                          {parseFloat(servicio.costo).toFixed(2)} Bs
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ 
                          maxWidth: "200px", 
                          whiteSpace: "normal",
                          fontSize: "13px",
                          color: theme.subtle
                        }}>
                          {servicio.direccion}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <code style={{ 
                          backgroundColor: theme.border,
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "13px",
                          fontFamily: "monospace"
                        }}>
                          {servicio.telefono}
                        </code>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.rating}>
                          <span style={{ color: theme.warning }}>
                            {getRatingStars(servicio.calificacion)}
                          </span>
                          <span style={{ 
                            fontSize: "12px", 
                            color: theme.subtle,
                            marginLeft: "4px"
                          }}>
                            ({parseFloat(servicio.calificacion || 0).toFixed(1)})
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer style={styles.footer}>
            © 2025 Sistema de Gestión Turística - Parque Nacional Torotoro
          </footer>
        </main>
      </div>
    </div>
  );
};