import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

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
      ":hover": {
        backgroundColor: theme.accent,
        color: "white",
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
      maxWidth: "1200px",
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
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
      marginBottom: "32px",
    },
    card: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "24px",
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: theme.shadow,
      cursor: "pointer",
      ":hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadowHover,
        borderColor: theme.accent,
      },
    },
    cardIcon: {
      fontSize: "32px",
      marginBottom: "12px",
      opacity: 0.9,
    },
    cardNumber: {
      fontSize: "32px",
      fontWeight: "800",
      color: theme.accent,
      margin: "8px 0",
      fontFeatureSettings: "'tnum'",
    },
    cardLabel: {
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
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    th: {
      backgroundColor: theme.accent,
      color: "white",
      padding: "16px",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "14px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    td: {
      padding: "16px",
      borderBottom: `1px solid ${theme.border}`,
      color: theme.text,
    },
    tdNumero: {
      padding: "16px",
      borderBottom: `1px solid ${theme.border}`,
      fontSize: "16px",
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
      display: "block",
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
  };

  const [atractivos, setAtractivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtractivos = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/atractivo_turistico");
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

  const totalAtractivos = atractivos.length;
  const totalFosiles = atractivos.filter(a => a.tipo_atractivo === "FOSIL").length;
  const totalPaleontologicos = atractivos.filter(a => a.nombre_categoria === "PALEONTOLOGICO").length;
  const totalLugares = totalAtractivos;

  const getRiskBadgeStyle = (nivelRiesgo) => {
    const baseStyle = styles.badge;
    switch(nivelRiesgo?.toUpperCase()) {
      case "ALTO":
        return { ...baseStyle, backgroundColor: "#ef4444", color: "white" };
      case "MEDIO":
        return { ...baseStyle, backgroundColor: "#f59e0b", color: "white" };
      case "BAJO":
        return { ...baseStyle, backgroundColor: "#10b981", color: "white" };
      default:
        return { ...baseStyle, backgroundColor: theme.subtle, color: "white" };
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>
              <span>🏞️</span>
              Torotoro App
            </h2>
          </div>
          <nav style={styles.sidebarNav}>
            <div style={{...styles.sidebarItem, ...styles.activeSidebarItem}}>
              <span>📊</span>
              Dashboard
            </div>
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
      </aside>

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
            <span>📈</span>
            Panel de Control
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
            <h1 style={styles.headerTitle}>Dashboard Turístico</h1>
            <p style={styles.headerSubtitle}>Parque Nacional Torotoro - Monitoreo en tiempo real</p>
          </header>

          {loading ? (
            <div style={styles.loading}>
              <div>Cargando datos...</div>
            </div>
          ) : (
            <>
              <div style={styles.cardsGrid}>
                <div style={styles.card}>
                  <div style={styles.cardIcon}>🏔️</div>
                  <div style={styles.cardNumber}>{totalAtractivos}</div>
                  <h3 style={styles.cardLabel}>Total Atractivos</h3>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardIcon}>🦴</div>
                  <div style={styles.cardNumber}>{totalFosiles}</div>
                  <h3 style={styles.cardLabel}>Fósiles</h3>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardIcon}>🧬</div>
                  <div style={styles.cardNumber}>{totalPaleontologicos}</div>
                  <h3 style={styles.cardLabel}>Paleontológicos</h3>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardIcon}>📊</div>
                  <div style={styles.cardNumber}>{totalLugares}</div>
                  <h3 style={styles.cardLabel}>Lugares Registrados</h3>
                </div>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>Nombre del Atractivo</th>
                      <th style={styles.th}>Tipo</th>
                      <th style={styles.th}>Estado</th>
                      <th style={styles.th}>Categoría</th>
                      <th style={styles.th}>Nivel de Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atractivos.map((item, index) => (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.tdNumero}>{index + 1}</td>
                        <td style={styles.td}>
                          <div style={{ fontWeight: "600" }}>{item.nombre_atractivo}</div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.badge}>{item.tipo_atractivo}</span>
                        </td>
                        <td style={styles.td}>{item.estado}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: theme.border,
                            color: theme.text
                          }}>
                            {item.nombre_categoria}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={getRiskBadgeStyle(item.nivel_riesgo)}>
                            {item.nivel_riesgo || "No especificado"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <footer style={styles.footer}>
            © 2025 Dashboard Turístico - Proyecto Torotoro | Sistema de Gestión Patrimonial
          </footer>
        </main>
      </div>
    </div>
  );
};