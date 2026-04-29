import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardRecepcionista.css";
import { FaHistory, FaPlusCircle, FaSun, FaCloudSun, FaMoon } from "react-icons/fa";
import { getUsuario, getToken, api } from "../../services/api";

const turnoColor = { Matutino: "#f59e0b", Vespertino: "#fb923c", Nocturno: "#818cf8" };
const turnoIcono = { Matutino: <FaSun />, Vespertino: <FaCloudSun />, Nocturno: <FaMoon /> };

export default function MisCortes() {
  const navigate = useNavigate();
  const usuario = getUsuario();
  const token = getToken();
  const [cortes, setCortes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get("/api/cortes/index.php", token)
      .then((data) => {
        const propios = Array.isArray(data)
          ? data.filter((c) => c.usuario_id === usuario?.id)
          : [];
        setCortes(propios);
      })
      .catch(() => setCortes([]))
      .finally(() => setCargando(false));
  }, [token, usuario?.id]);

  const fmt = (n) => parseFloat(n).toLocaleString("es-MX", { minimumFractionDigits: 2 });

  return (
    <div className="dash-rec">
      <div className="dash-rec-header">
        <div>
          <h1><FaHistory /> Mis Cortes</h1>
          <p className="dash-rec-fecha">Historial completo de tus cortes registrados</p>
        </div>
        <button
          style={{ display:"flex", alignItems:"center", gap:8, background:"linear-gradient(90deg,#22c55e,#16a34a)", color:"white", border:"none", padding:"12px 20px", borderRadius:12, fontWeight:700, cursor:"pointer" }}
          onClick={() => navigate("/nuevo-corte")}
        >
          <FaPlusCircle /> Nuevo Corte
        </button>
      </div>

      <div className="dash-rec-historial">
        <div className="historial-header">
          <h2>{cortes.length} corte{cortes.length !== 1 ? "s" : ""} registrado{cortes.length !== 1 ? "s" : ""}</h2>
        </div>

        {cargando ? (
          <p className="cargando-txt">Cargando...</p>
        ) : cortes.length === 0 ? (
          <div className="historial-vacio">
            <FaHistory />
            <p>Aún no tienes cortes registrados.</p>
            <button onClick={() => navigate("/nuevo-corte")}>Registrar mi primer corte</button>
          </div>
        ) : (
          <div className="historial-tabla-wrap">
            <table className="historial-tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Efectivo</th>
                  <th>Tarjetas</th>
                  <th>Bancos</th>
                  <th>Gastos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cortes.map((c, idx) => (
                  <tr key={c.id}>
                    <td style={{ color:"#94a3b8", fontSize:"0.78rem" }}>{idx + 1}</td>
                    <td>{new Date(c.fecha + "T12:00:00").toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" })}</td>
                    <td>
                      <span className="turno-chip" style={{ background: turnoColor[c.turno] + "22", color: turnoColor[c.turno] }}>
                        {turnoIcono[c.turno]} {c.turno}
                      </span>
                    </td>
                    <td>${fmt(c.efectivo_total)}</td>
                    <td>${fmt(c.tarjetas_total)}</td>
                    <td>${fmt(c.bancos_total)}</td>
                    <td style={{ color:"#ef4444" }}>-${fmt(c.gastos_total)}</td>
                    <td className="total-cell">${fmt(c.total_general)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
