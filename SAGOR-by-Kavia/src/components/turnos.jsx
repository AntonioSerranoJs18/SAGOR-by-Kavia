import React, { useState, useEffect, useCallback } from "react";
import "./turnos.css";
import {
  FaSearch, FaTrash, FaEdit, FaClock, FaUsers, FaCheckCircle,
  FaSpinner, FaCalendarAlt, FaUser, FaSun, FaMoon, FaCloudSun,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdTimeline, MdPendingActions } from "react-icons/md";
import { getToken, api } from "../services/api";

const turnoHorario = {
  Matutino:   "06:00 - 14:00",
  Vespertino: "14:00 - 22:00",
  Nocturno:   "22:00 - 06:00",
};

const getTurnoIcon = (turno) => {
  if (turno === "Matutino")   return <FaSun />;
  if (turno === "Vespertino") return <FaCloudSun />;
  if (turno === "Nocturno")   return <FaMoon />;
  return <FaClock />;
};

const formatFecha = (fecha) => {
  if (!fecha) return "—";
  const base = new Date(fecha + "T12:00:00");
  const hoy  = new Date(); hoy.setHours(0, 0, 0, 0);
  const d    = new Date(fecha + "T12:00:00"); d.setHours(0, 0, 0, 0);
  const diff = (d - hoy) / 86400000;
  if (diff === 0)  return "Hoy";
  if (diff === -1) return "Ayer";
  if (diff === 1)  return "Mañana";
  return base.toLocaleDateString("es-MX");
};

const Turnos = () => {
  const token = getToken();

  const [turnos,       setTurnos]       = useState([]);
  const [cargando,     setCargando]     = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [turnoFilter,  setTurnoFilter]  = useState("Todos");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [editingTurno, setEditingTurno] = useState(null);
  const [guardando,    setGuardando]    = useState(false);
  const [confirmId,    setConfirmId]    = useState(null);
  const [eliminando,   setEliminando]   = useState(false);

  const cargar = useCallback(() => {
    setCargando(true);
    setError("");
    api.get("/api/turnos/index.php", token)
      .then((data) => setTurnos(Array.isArray(data) ? data : []))
      .catch(() => setError("No se pudo conectar con el servidor."))
      .finally(() => setCargando(false));
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const stats = {
    total:       turnos.length,
    activos:     turnos.filter((t) => t.estado === "Activo").length,
    finalizados: turnos.filter((t) => t.estado === "Finalizado").length,
    pendientes:  turnos.filter((t) => t.estado === "Pendiente").length,
  };

  const filtered = turnos.filter((t) => {
    const nombre = (t.nombre_empleado || "").toLowerCase();
    return (
      nombre.includes(search.toLowerCase()) &&
      (turnoFilter  === "Todos" || t.tipo_turno === turnoFilter) &&
      (estadoFilter === "Todos" || t.estado     === estadoFilter)
    );
  });

  const handleSaveEdit = async () => {
    setGuardando(true);
    try {
      await api.put(`/api/turnos/index.php?id=${editingTurno.id}`, {
        nombre_empleado: editingTurno.nombre_empleado,
        tipo_turno:      editingTurno.tipo_turno,
        fecha:           editingTurno.fecha,
        estado:          editingTurno.estado,
      }, token);
      setEditingTurno(null);
      cargar();
    } catch (err) {
      alert(err.message || "Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async () => {
    setEliminando(true);
    try {
      await api.delete(`/api/turnos/index.php?id=${confirmId}`, token);
      setConfirmId(null);
      cargar();
    } catch (err) {
      alert(err.message || "Error al eliminar.");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="turnos">
      <div className="turnos-header">
        <h1><FaClock /> Gestión de Turnos</h1>

        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 Buscar empleado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={turnoFilter} onChange={(e) => setTurnoFilter(e.target.value)}>
              <option value="Todos">Todos los turnos</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Nocturno">Nocturno</option>
            </select>
          </div>
          <div className="filter-group">
            <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>
          <button
            className="btn-clear"
            onClick={() => { setSearch(""); setTurnoFilter("Todos"); setEstadoFilter("Todos"); }}
          >
            <FaTrash /> Limpiar
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: "#fef2f2", color: "#dc2626",
          padding: "12px 16px", borderRadius: 8, marginBottom: 16,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* ── ESTADÍSTICAS ── */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Turnos</h4>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-icon"><FaUsers /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Activos Ahora</h4>
            <p className="stat-number" style={{ color: "#22c55e" }}>{stats.activos}</p>
          </div>
          <div className="stat-icon" style={{ color: "#22c55e" }}><FaCheckCircle /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Finalizados</h4>
            <p className="stat-number" style={{ color: "#3b82f6" }}>{stats.finalizados}</p>
          </div>
          <div className="stat-icon" style={{ color: "#3b82f6" }}><MdTimeline /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Pendientes</h4>
            <p className="stat-number" style={{ color: "#f59e0b" }}>{stats.pendientes}</p>
          </div>
          <div className="stat-icon" style={{ color: "#f59e0b" }}><MdPendingActions /></div>
        </div>
      </div>

      {/* ── TABLA ── */}
      <div className="table-container">
        {cargando ? (
          <div style={{ textAlign: "center", padding: 48, color: "#64748b" }}>
            <FaSpinner style={{ fontSize: 28 }} />
            <p>Cargando turnos...</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Turno</th>
                <th>Horario</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FaUser style={{ color: "#64748b" }} />
                        <div>
                          <strong>{item.nombre_empleado}</strong>
                          {item.nombre_usuario && (
                            <>
                              <br />
                              <small style={{ color: "#64748b", fontSize: "0.75rem" }}>
                                {item.nombre_usuario}
                              </small>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {getTurnoIcon(item.tipo_turno)} {item.tipo_turno}
                      </div>
                    </td>
                    <td>{turnoHorario[item.tipo_turno] || "—"}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <FaCalendarAlt style={{ color: "#64748b" }} />
                        {formatFecha(item.fecha)}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${(item.estado || "pendiente").toLowerCase()}`}>
                        {item.estado === "Activo"     && <FaCheckCircle size={12} />}
                        {item.estado === "Finalizado" && <MdTimeline size={12} />}
                        {item.estado === "Pendiente"  && <FaSpinner size={12} />}
                        {" "}{item.estado || "Pendiente"}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-edit" onClick={() => setEditingTurno({ ...item })}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn-delete" onClick={() => setConfirmId(item.id)}>
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    <FaSearch size={48} />
                    <p>No hay turnos con los filtros seleccionados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── MODAL EDITAR ── */}
      {editingTurno && (
        <div className="modal-overlay" onClick={() => setEditingTurno(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2><FaEdit /> Editar Turno</h2>
            <input
              type="text"
              placeholder="Nombre del empleado"
              value={editingTurno.nombre_empleado || ""}
              onChange={(e) => setEditingTurno({ ...editingTurno, nombre_empleado: e.target.value })}
            />
            <select
              value={editingTurno.tipo_turno || "Matutino"}
              onChange={(e) => setEditingTurno({ ...editingTurno, tipo_turno: e.target.value })}
            >
              <option value="Matutino">Matutino (06:00 - 14:00)</option>
              <option value="Vespertino">Vespertino (14:00 - 22:00)</option>
              <option value="Nocturno">Nocturno (22:00 - 06:00)</option>
            </select>
            <input
              type="date"
              value={editingTurno.fecha || ""}
              onChange={(e) => setEditingTurno({ ...editingTurno, fecha: e.target.value })}
            />
            <select
              value={editingTurno.estado || "Pendiente"}
              onChange={(e) => setEditingTurno({ ...editingTurno, estado: e.target.value })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Activo">Activo</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditingTurno(null)}>Cancelar</button>
              <button className="btn-save" onClick={handleSaveEdit} disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRMAR ELIMINAR ── */}
      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#dc2626" }}>¿Eliminar turno?</h2>
            <p style={{ color: "#64748b", marginBottom: 24 }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmId(null)}>Cancelar</button>
              <button className="btn-delete" onClick={handleDelete} disabled={eliminando}>
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;
