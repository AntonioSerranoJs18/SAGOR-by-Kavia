import React from "react";
import { Link } from "react-router-dom";
import "./layout.css";

const Layout = ({ children }) => {
  return (
    <div className="app">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">SAGOR</h2>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/turnos">Turnos</Link>
          <Link to="/cortes">Cortes</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/reportes">Reportes</Link>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="content">
        {children}
      </main>

    </div>
  );
};

export default Layout;