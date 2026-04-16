import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./layout.css";
import { 
  FaChartLine, 
  FaClipboardList, 
  FaCut, 
  FaUsers, 
  FaFileAlt,
  FaSignOutAlt,
  FaHotel
} from "react-icons/fa";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("usuarios");
    // Redirigir al login
    navigate("/login");
  };

  return (
    <div className="app">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaHotel className="logo-icon" />
          <h2 className="logo">SAGOR</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="nav-link">
            <FaChartLine /> Dashboard
          </Link>
          <Link to="/turnos" className="nav-link">
            <FaClipboardList /> Turnos
          </Link>
          <Link to="/cortes" className="nav-link">
            <FaCut /> Cortes
          </Link>
          <Link to="/usuarios" className="nav-link">
            <FaUsers /> Usuarios
          </Link>
          <Link to="/reportes" className="nav-link">
            <FaFileAlt /> Reportes
          </Link>
        </nav>

        {/* BOTÓN DE CERRAR SESIÓN EN LA PARTE DE ABAJO */}
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="content">
        {children}
      </main>

    </div>
  );
};

export default Layout;