import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardRecepcionista.css";
import {
  FaSun, FaCloudSun, FaMoon, FaPlusCircle, FaCheckCircle,
  FaClock, FaCalendarAlt, FaClipboardList, FaUserTie,
} from "react-icons/fa";
import { getUsuario, getToken, api } from "../../services/api";

const getTurnoActual = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return "Matutino";
  if (h >= 14 && h < 22) return "Vespertino";
  return "Nocturno";
};

const turnoIcono = { Matutino: <FaSun />, Vespertino: <FaCloudSun />, Nocturno: <FaMoon /> };
const turnoColor = { Matutino: "#f59e0b", Vespertino: "#fb923c", Nocturno: "#818cf8" };
const turnoHorario = { Matutino: "06:00 – 14:00", Vespertino: "14:00 – 22:00", Nocturno: "22:00 – 06:00" };

const saludo = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "Buenos días";
  if (h >= 12 && h < 19) return "Buenas tardes";
  return "Buenas noches";
};

export default function DashboardRecepcionista() {
  const navigate = useNavigate();
  const usuario = getUsuario();
  const token = getToken();
  const turno = getTurnoActual();
  const [misCortes, setMisCortes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const hoy = new Date().toISOString().split("T")[0];
  const fechaLegible = new Date().toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    api.get("/api/cortes/index.php", token)
      .then((data) => {
        const propios = Array.isArray(data)
          ? data.filter((c) => c.usuario_id === usuario?.id).slice(0, 5)
          : [];
        setMisCortes(propios);
      })
      .catch(() => setMisCortes([]))
      .finally(() => setCargando(false));
  }, [token, usuario?.id]);

  const corteHoy = misCortes.find((c) => c.fecha === hoy && c.turno === turno);

  return (
    <div className="dash-rec">
      {/* HEADER */}
      <div className="dash-rec-header">
        <div>
          <h1><FaUserTie /> {saludo()}, {usuario?.nombre}</h1>
          <p className="dash-rec-fecha"><FaCalendarAlt /> {fechaLegible}</p>
        </div>
        <div className="dash-rec-turno-badge" style={{ borderColor: turnoColor[turno], color: turnoColor[turno] }}>
          <span className="turno-icon">{turnoIcono[turno]}</span>
          <div>
            <span className="turno-nombre">{turno}</span>
            <span className="turno-horario">{turnoHorario[turno]}</span>
          </div>
        </div>
      </div>

      {/* CARDS DE ACCIONES */}
      <div className="dash-rec-cards">
        <div className={`dash-rec-card card-corte ${corteHoy ? "card-done" : "card-pending"}`}>
          <div className="card-icon">
            {corteHoy ? <FaCheckCircle /> : <FaClock />}
          </div>
          <div className="card-body">
            <h3>Corte de hoy</h3>
            {corteHoy ? (
              <>
                <p className="card-status ok">Registrado</p>
                <p className="card-amount">${parseFloat(corteHoy.total_general).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
              </>
            ) : (
              <>
                <p className="card-status pending">Pendiente</p>
                <p className="card-hint">Turno {turno} · {turnoHorario[turno]}</p>
              </>
            )}
          </div>
          {!corteHoy && (
            <button className="card-btn" onClick={() => navigate("/nuevo-corte")}>
              <FaPlusCircle /> Registrar corte
            </button>
          )}
        </div>

        <div className="dash-rec-card card-stat">
          <div className="card-icon stat-icon"><FaClipboardList /></div>
          <div className="card-body">
            <h3>Cortes registrados</h3>
            <p className="card-amount">{misCortes.length}</p>
            <p className="card-hint">Últimos registros</p>
          </div>
        </div>
      </div>

      {/* HISTORIAL RECIENTE */}
      <div className="dash-rec-historial">
        <div className="historial-header">
          <h2><FaClipboardList /> Mis últimos cortes</h2>
          <button className="btn-ver-todos" onClick={() => navigate("/mis-cortes")}>
            Ver todos
          </button>
        </div>

        {cargando ? (
          <p className="cargando-txt">Cargando...</p>
        ) : misCortes.length === 0 ? (
          <div className="historial-vacio">
            <FaClipboardList />
            <p>Aún no tienes cortes registrados.</p>
            <button onClick={() => navigate("/nuevo-corte")}>Registrar mi primer corte</button>
          </div>
        ) : (
          <div className="historial-tabla-wrap">
            <table className="historial-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Efectivo</th>
                  <th>Tarjetas</th>
                  <th>Gastos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {misCortes.map((c) => (
                  <tr key={c.id}>
                    <td>{new Date(c.fecha + "T12:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td>
                      <span className="turno-chip" style={{ background: turnoColor[c.turno] + "22", color: turnoColor[c.turno] }}>
                        {turnoIcono[c.turno]} {c.turno}
                      </span>
                    </td>
                    <td>${parseFloat(c.efectivo_total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                    <td>${parseFloat(c.tarjetas_total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                    <td>${parseFloat(c.gastos_total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                    <td className="total-cell">${parseFloat(c.total_general).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
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
