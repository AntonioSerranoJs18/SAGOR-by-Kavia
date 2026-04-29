import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardRecepcionista.css";
import {
  FaSun, FaCloudSun, FaMoon, FaPlusCircle, FaCheckCircle,
  FaClock, FaCalendarAlt, FaClipboardList, FaUserTie,
  FaSpinner, FaLock, FaExclamationTriangle,
} from "react-icons/fa";
import { Play, StopCircle } from "lucide-react";
import { getUsuario, getToken, api } from "../../services/api";

const turnoIcono   = { Matutino: <FaSun />, Vespertino: <FaCloudSun />, Nocturno: <FaMoon /> };
const turnoColor   = { Matutino: "#f59e0b", Vespertino: "#fb923c", Nocturno: "#818cf8" };
const turnoHorario = { Matutino: "06:00 – 14:00", Vespertino: "14:00 – 22:00", Nocturno: "22:00 – 06:00" };

const saludo = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 12)  return "Buenos días";
  if (h >= 12 && h < 19) return "Buenas tardes";
  return "Buenas noches";
};

const fmt = (n) =>
  `$${parseFloat(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export default function DashboardRecepcionista() {
  const navigate = useNavigate();
  const usuario  = getUsuario();
  const token    = getToken();

  const [estado,   setEstado]   = useState(null);
  const [cortes,   setCortes]   = useState([]);
  const [cargando, setCargando] = useState(true);
  const [accion,   setAccion]   = useState("");   // "iniciando" | "finalizando"
  const [error,    setError]    = useState("");

  const fechaLegible = new Date().toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  /* ── Carga / recarga ── */
  const cargar = useCallback(() => {
    setCargando(true);
    setError("");
    Promise.all([
      api.get("/api/turnos/index.php?estado_inicio=1", token),
      api.get("/api/cortes/index.php", token),
    ])
      .then(([est, cortesData]) => {
        setEstado(est);
        const propios = Array.isArray(cortesData)
          ? cortesData.filter((c) => c.usuario_id === usuario?.id).slice(0, 5)
          : [];
        setCortes(propios);
      })
      .catch(() => setError("No se pudo conectar con el servidor."))
      .finally(() => setCargando(false));
  }, [token, usuario?.id]);

  useEffect(() => { cargar(); }, [cargar]);

  /* ── Acciones ── */
  const iniciarTurno = async () => {
    setAccion("iniciando");
    setError("");
    try {
      await api.post("/api/turnos/index.php", {
        tipo_turno: estado.turno_sugerido,
        fecha:      estado.fecha_sugerida,
      }, token);
      cargar();
    } catch (err) {
      setError(err.message);
      setAccion("");
    }
  };

  const finalizarTurno = async () => {
    const turno = estado?.turno_activo_propio;
    if (!turno) return;
    setAccion("finalizando");
    setError("");
    try {
      await api.put(`/api/turnos/index.php?id=${turno.id}`, { estado: "Finalizado" }, token);
      cargar();
    } catch (err) {
      setError(err.message);
      setAccion("");
    }
  };

  if (cargando) {
    return (
      <div className="dash-rec" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <FaSpinner style={{ fontSize: 32, color: "#64748b" }} />
      </div>
    );
  }

  const turnoPropio   = estado?.turno_activo_propio;
  const turnoSistema  = estado?.turno_activo_sistema;
  const puedeIniciar  = estado?.puede_iniciar;
  const turnoSugerido = estado?.turno_sugerido || "Matutino";
  const color         = turnoColor[turnoSugerido];

  return (
    <div className="dash-rec">

      {/* ── HEADER ── */}
      <div className="dash-rec-header">
        <div>
          <h1><FaUserTie /> {saludo()}, {usuario?.nombre}</h1>
          <p className="dash-rec-fecha"><FaCalendarAlt /> {fechaLegible}</p>
        </div>
        <div className="dash-rec-turno-badge" style={{ borderColor: color, color }}>
          <span className="turno-icon">{turnoIcono[turnoSugerido]}</span>
          <div>
            <span className="turno-nombre">{turnoSugerido}</span>
            <span className="turno-horario">{turnoHorario[turnoSugerido]}</span>
          </div>
        </div>
      </div>

      {/* ── ERROR GLOBAL ── */}
      {error && (
        <div className="turno-alerta turno-alerta-error">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* ══════════════════════════════════════
          TARJETA DE ESTADO DE TURNO
      ══════════════════════════════════════ */}
      {turnoPropio ? (

        /* ── TURNO ACTIVO (propio) ── */
        <div className="turno-card turno-card-activo"
          style={{ "--tc": turnoColor[turnoPropio.tipo_turno] }}>
          <div className="tc-top">
            <span className="tc-badge activo">
              <span className="tc-dot" /> Turno activo
            </span>
            <span className="tc-turno-nombre" style={{ color: turnoColor[turnoPropio.tipo_turno] }}>
              {turnoIcono[turnoPropio.tipo_turno]} {turnoPropio.tipo_turno}
            </span>
          </div>

          <div className="tc-horario">{turnoHorario[turnoPropio.tipo_turno]}</div>
          <p className="tc-sub">
            Iniciado el{" "}
            {new Date(turnoPropio.fecha + "T12:00:00").toLocaleDateString("es-MX", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </p>

          {/* Estado del corte */}
          {turnoPropio.tiene_corte ? (
            <div className="tc-corte-estado ok">
              <FaCheckCircle /> Corte registrado — ya puedes finalizar tu turno
            </div>
          ) : (
            <div className="tc-corte-estado pendiente">
              <FaClock /> Corte pendiente — regístralo antes de finalizar
            </div>
          )}

          {/* Botones */}
          <div className="tc-acciones">
            {!turnoPropio.tiene_corte && (
              <button className="tc-btn registrar" onClick={() => navigate("/nuevo-corte")}>
                <FaPlusCircle /> Registrar Corte
              </button>
            )}
            <button
              className="tc-btn finalizar"
              disabled={!turnoPropio.tiene_corte || accion === "finalizando"}
              title={!turnoPropio.tiene_corte ? "Registra tu corte primero" : ""}
              onClick={finalizarTurno}
            >
              {accion === "finalizando"
                ? <><FaSpinner /> Finalizando...</>
                : <><StopCircle size={16} strokeWidth={2} /> Finalizar Turno</>}
            </button>
          </div>
        </div>

      ) : (

        /* ── SIN TURNO ACTIVO ── */
        <div className={`turno-card ${puedeIniciar ? "turno-card-libre" : "turno-card-bloqueado"}`}>
          {puedeIniciar ? (
            <>
              <div className="tc-top">
                <span className="tc-badge libre">
                  <FaCheckCircle /> Listo para iniciar
                </span>
                <span className="tc-turno-nombre" style={{ color }}>
                  {turnoIcono[turnoSugerido]} {turnoSugerido}
                </span>
              </div>
              <div className="tc-horario">{turnoHorario[turnoSugerido]}</div>
              <p className="tc-sub">El turno anterior ya ha finalizado</p>
            </>
          ) : (
            <>
              <div className="tc-top">
                <span className="tc-badge bloqueado">
                  <FaLock /> Turno bloqueado
                </span>
                <span className="tc-turno-nombre" style={{ color: turnoColor[turnoSistema?.tipo_turno] }}>
                  {turnoIcono[turnoSistema?.tipo_turno]} {turnoSistema?.tipo_turno}
                </span>
              </div>
              <div className="tc-horario">{turnoHorario[turnoSistema?.tipo_turno]}</div>
              <p className="tc-sub">
                <strong>{turnoSistema?.nombre_empleado}</strong> tiene el turno activo
              </p>
              <div className="turno-alerta turno-alerta-warn">
                <FaClock /> Espera a que registre su corte y finalice su turno
              </div>
            </>
          )}

          <button
            className="tc-btn iniciar"
            disabled={!puedeIniciar || accion === "iniciando"}
            onClick={iniciarTurno}
          >
            {accion === "iniciando"
              ? <><FaSpinner /> Iniciando...</>
              : <><Play size={16} strokeWidth={2} fill="currentColor" /> Iniciar turno {turnoSugerido}</>}
          </button>
        </div>
      )}

      {/* ── HISTORIAL ── */}
      <div className="dash-rec-historial">
        <div className="historial-header">
          <h2><FaClipboardList /> Mis últimos cortes</h2>
          <button className="btn-ver-todos" onClick={() => navigate("/mis-cortes")}>
            Ver todos
          </button>
        </div>

        {cortes.length === 0 ? (
          <div className="historial-vacio">
            <FaClipboardList />
            <p>Aún no tienes cortes registrados.</p>
          </div>
        ) : (
          <div className="historial-tabla-wrap">
            <table className="historial-tabla">
              <thead>
                <tr>
                  <th>Fecha</th><th>Turno</th><th>Efectivo</th>
                  <th>Tarjetas</th><th>Gastos</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cortes.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {new Date(c.fecha + "T12:00:00").toLocaleDateString("es-MX", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td>
                      <span className="turno-chip"
                        style={{ background: turnoColor[c.turno] + "22", color: turnoColor[c.turno] }}>
                        {turnoIcono[c.turno]} {c.turno}
                      </span>
                    </td>
                    <td>{fmt(c.efectivo_total)}</td>
                    <td>{fmt(c.tarjetas_total)}</td>
                    <td>{fmt(c.gastos_total)}</td>
                    <td className="total-cell">{fmt(c.total_general)}</td>
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
