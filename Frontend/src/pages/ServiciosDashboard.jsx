import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ServiciosDashboard = () => {
  // 🔹 Estado para el modo oscuro
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Temas claro y oscuro
  const lightTheme = {
    bg: "#f5f0e6",
    card: "#fff8ef",
    text: "#4a3b2d",
    accent: "#b97a57",
    border: "#e0d2c0",
  };

  const darkTheme = {
    bg: "#1b1b1b",
    card: "#2a2a2a",
    text: "#f5f0e6",
    accent: "#d69d72",
    border: "#444",
  };

  const theme = darkMode ? darkTheme : lightTheme;

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: "'Poppins', sans-serif",
      transition: "all 0.3s ease",
    },
    sidebar: {
      width: "220px",
      backgroundColor: theme.card,
      padding: "25px",
      borderRight: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "background 0.3s ease",
    },
    sidebarTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: theme.accent,
      textAlign: "center",
    },
    sidebarItem: {
      margin: "12px 0",
      cursor: "pointer",
      padding: "8px 10px",
      borderRadius: "6px",
      transition: "background 0.2s, color 0.2s",
    },
    navbar: {
      backgroundColor: theme.card,
      padding: "15px 30px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "background 0.3s ease",
    },
    main: {
      flex: 1,
      padding: "30px",
      maxWidth: "1100px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "25px",
      borderBottom: `2px solid ${theme.border}`,
      paddingBottom: "10px",
      fontWeight: "500",
      color: theme.accent,
      textAlign: "center",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "8px",
      overflow: "hidden",
    },
    th: {
      backgroundColor: theme.accent,
      color: "white",
      padding: "12px",
      textAlign: "left",
    },
    td: {
      padding: "10px 12px",
      borderBottom: `1px solid ${theme.border}`,
    },
    tdNumero: {
      padding: "10px 12px",
      borderBottom: `1px solid ${theme.border}`,
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
    },
    footer: {
      textAlign: "center",
      fontSize: "12px",
      color: theme.text,
      marginTop: "20px",
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    darkButton: {
      backgroundColor: theme.accent,
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    activeSidebarItem: {
      backgroundColor: theme.accent,
      color: "white",
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

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>🌄 Torotoro App</h2>

          <Link to="/" style={styles.link}>
            <div style={styles.sidebarItem}>🏠 Inicio</div>
          </Link>

          <div style={{ ...styles.sidebarItem, ...styles.activeSidebarItem }}>
            🍽️ Servicios
          </div>

          <div style={styles.sidebarItem}>🌍 Mapa 3D</div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={styles.darkButton}
              >
            {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
          </button>
        </div>


      </aside>

      {/* ===== MAIN ===== */}
      <div style={{ flex: 1 }}>
        <nav style={styles.navbar}>
          <h3 style={{ color: theme.accent, fontWeight: "600" }}>
            🍽️ Panel de Servicios
          </h3>
        </nav>

        <main style={styles.main}>
          <h1 style={styles.header}>Dashboard Turístico - Servicios</h1>

          {loading ? (
            <p>Cargando datos...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Atractivo</th>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Tipo Servicio</th>
                  <th style={styles.th}>Costo</th>
                  <th style={styles.th}>Dirección</th>
                  <th style={styles.th}>Teléfono</th>
                  <th style={styles.th}>Calificación</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s, i) => (
                  <tr key={i}>
                    <td style={styles.tdNumero}>{i + 1}</td>
                    <td style={styles.td}>{s.nombre_atractivo}</td>
                    <td style={styles.td}>{s.nombre_servicio}</td>
                    <td style={styles.td}>{s.tipo_servicio}</td>
                    <td style={styles.td}>{s.costo} Bs</td>
                    <td style={styles.td}>{s.direccion}</td>
                    <td style={styles.td}>{s.telefono}</td>
                    <td style={styles.td}>{s.calificacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p style={styles.footer}>
            © 2025 Dashboard Turístico - Proyecto Torotoro
          </p>
        </main>
      </div>
    </div>
  );
};
