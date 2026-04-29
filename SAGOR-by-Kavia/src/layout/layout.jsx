import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./layout.css";
import {
  FaChartLine, FaClipboardList, FaCut, FaUsers, FaFileAlt,
  FaSignOutAlt, FaHotel, FaUserCircle, FaPlusCircle, FaHistory,
  FaCalendarCheck,
} from "react-icons/fa";
import { cerrarSesion, getUsuario } from "../services/api";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const usuario = getUsuario();
  const esAdmin = usuario?.rol === 'admin';

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaHotel className="logo-icon" />
          <h2 className="logo">SAGOR</h2>
        </div>

        {usuario && (
          <div className="sidebar-user">
            <FaUserCircle className="user-avatar-icon" />
            <div className="user-info">
              <span className="user-name">{usuario.nombre}</span>
              <span className="user-role">{usuario.rol === 'admin' ? 'Administrador' : 'Recepcionista'}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {esAdmin ? (
            <>
              <Link to="/dashboard" className="nav-link"><FaChartLine /> Dashboard</Link>
              <Link to="/turnos"    className="nav-link"><FaClipboardList /> Turnos</Link>
              <Link to="/cortes"    className="nav-link"><FaCut /> Cortes</Link>
              <Link to="/usuarios"  className="nav-link"><FaUsers /> Usuarios</Link>
              <Link to="/reportes"  className="nav-link"><FaFileAlt /> Reportes</Link>
            </>
          ) : (
            <>
              <Link to="/mi-turno"    className="nav-link"><FaCalendarCheck /> Mi Turno</Link>
              <Link to="/nuevo-corte" className="nav-link"><FaPlusCircle /> Nuevo Corte</Link>
              <Link to="/mis-cortes"  className="nav-link"><FaHistory /> Mis Cortes</Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
