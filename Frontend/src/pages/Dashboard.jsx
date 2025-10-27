import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

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
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
      marginBottom: "25px",
    },
    card: {
      backgroundColor: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "10px",
      padding: "15px",
      textAlign: "center",
      transition: "background 0.3s ease, color 0.3s ease",
    },
    cardNumber: {
      fontSize: "26px",
      fontWeight: "bold",
      color: theme.accent,
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

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>🌄 Torotoro App</h2>
          <div style={styles.sidebarItem}>🏠 Inicio</div>
          <Link to="/servicios" style={{ ...styles.sidebarItem, ...styles.link }}>
            🍽️ Servicios
          </Link>
          <br />
          <br />
          <Link to="/mapa3d" style={{ ...styles.sidebarItem, ...styles.link }}>
          🌍 Mapa 3D
          </Link>
          <br />
          <br />

          <Link to={'/huellas3d'} style={{ ...styles.sidebarItem, ...styles.link }}>Huellas 3D</Link>
          <br />
          <br />
                  <button
          onClick={() => setDarkMode(!darkMode)}
          style={styles.darkButton}
        >
          {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>
        </div>


      </aside>

      <div style={{ flex: 1 }}>
        <nav style={styles.navbar}>
          <h3 style={{ color: theme.accent, fontWeight: "600" }}>
            🏞️ Panel de Control
          </h3>
        </nav>

        <main style={styles.main}>
          <h1 style={styles.header}>Dashboard Turístico - Torotoro</h1>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div style={styles.cardsGrid}>
                <div style={styles.card}>
                  <p style={styles.cardNumber}>{totalAtractivos}</p>
                  <h3>🏔️ Atractivos</h3>
                </div>
                <div style={styles.card}>
                  <p style={styles.cardNumber}>{totalFosiles}</p>
                  <h3>🦴 Fósiles</h3>
                </div>
                <div style={styles.card}>
                  <p style={styles.cardNumber}>{totalPaleontologicos}</p>
                  <h3>🧬 Paleontológicos</h3>
                </div>
                <div style={styles.card}>
                  <p style={styles.cardNumber}>{totalLugares}</p>
                  <h3>📊 Total Lugares</h3>
                </div>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Tipo</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Categoría</th>
                    <th style={styles.th}>Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {atractivos.map((item, index) => (
                    <tr key={index}>
                      <td style={styles.tdNumero}>{index + 1}</td>
                      <td style={styles.td}>{item.nombre_atractivo}</td>
                      <td style={styles.td}>{item.tipo_atractivo}</td>
                      <td style={styles.td}>{item.estado}</td>
                      <td style={styles.td}>{item.nombre_categoria}</td>
                      <td style={styles.td}>{item.nivel_riesgo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <p style={styles.footer}>
            © 2025 Dashboard Turístico - Proyecto Torotoro
          </p>
        </main>
      </div>
    </div>
  );
};
