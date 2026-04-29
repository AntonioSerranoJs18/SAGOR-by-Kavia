import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardRecepcionista.css";
import {
  FaHistory, FaPlusCircle, FaSun, FaCloudSun, FaMoon,
  FaSpinner, FaMoneyBillWave, FaCreditCard, FaUniversity, FaReceipt, FaHotel,
} from "react-icons/fa";
import { Eye, PencilLine, Trash2, X } from "lucide-react";
import { getUsuario, getToken, api } from "../../services/api";

const turnoColor = { Matutino: "#f59e0b", Vespertino: "#fb923c", Nocturno: "#818cf8" };
const turnoIcono = { Matutino: <FaSun />, Vespertino: <FaCloudSun />, Nocturno: <FaMoon /> };

const fmt = (n) => `$${parseFloat(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
const fmtFecha = (f) =>
  new Date(f + "T12:00:00").toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  });

export default function MisCortes() {
  const navigate = useNavigate();
  const usuario  = getUsuario();
  const token    = getToken();

  const [cortes,         setCortes]         = useState([]);
  const [cargando,       setCargando]       = useState(true);
  const [modalDetalle,   setModalDetalle]   = useState(null);
  const [cargandoModal,  setCargandoModal]  = useState(false);
  const [confirmId,      setConfirmId]      = useState(null);
  const [eliminando,     setEliminando]     = useState(false);

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

  const verDetalle = (corte) => {
    setModalDetalle({ ...corte });
    setCargandoModal(true);
    api.get(`/api/cortes/index.php?id=${corte.id}`, token)
      .then(setModalDetalle)
      .catch(() => {})
      .finally(() => setCargandoModal(false));
  };

  const confirmarEliminar = (id) => setConfirmId(id);

  const eliminarCorte = async () => {
    setEliminando(true);
    try {
      await api.delete(`/api/cortes/index.php?id=${confirmId}`, token);
      setCortes((prev) => prev.filter((c) => c.id !== confirmId));
      setConfirmId(null);
    } catch {
      alert("Error al eliminar el corte.");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="dash-rec">
      {/* HEADER */}
      <div className="dash-rec-header">
        <div>
          <h1><FaHistory /> Mis Cortes</h1>
          <p className="dash-rec-fecha">Historial completo de tus cortes registrados</p>
        </div>
        <button className="card-btn" onClick={() => navigate("/nuevo-corte")}>
          <FaPlusCircle /> Nuevo Corte
        </button>
      </div>

      {/* TABLA */}
      <div className="dash-rec-historial">
        <div className="historial-header">
          <h2>{cortes.length} corte{cortes.length !== 1 ? "s" : ""} registrado{cortes.length !== 1 ? "s" : ""}</h2>
        </div>

        {cargando ? (
          <p className="cargando-txt"><FaSpinner /> Cargando...</p>
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cortes.map((c, idx) => (
                  <tr key={c.id}>
                    <td style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{idx + 1}</td>
                    <td>{fmtFecha(c.fecha)}</td>
                    <td>
                      <span className="turno-chip" style={{ background: turnoColor[c.turno] + "22", color: turnoColor[c.turno] }}>
                        {turnoIcono[c.turno]} {c.turno}
                      </span>
                    </td>
                    <td>{fmt(c.efectivo_total)}</td>
                    <td>{fmt(c.tarjetas_total)}</td>
                    <td>{fmt(c.bancos_total)}</td>
                    <td style={{ color: "#ef4444" }}>-{fmt(c.gastos_total)}</td>
                    <td className="total-cell">{fmt(c.total_general)}</td>
                    <td>
                      <div className="acciones-cell">
                        <button className="btn-accion ver"      title="Ver detalle"  onClick={() => verDetalle(c)}><Eye size={15} strokeWidth={2} /></button>
                        <button className="btn-accion editar"   title="Editar"       onClick={() => navigate(`/editar-corte/${c.id}`)}><PencilLine size={15} strokeWidth={2} /></button>
                        <button className="btn-accion eliminar" title="Eliminar"     onClick={() => confirmarEliminar(c.id)}><Trash2 size={15} strokeWidth={2} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL VER DETALLE */}
      {modalDetalle && (
        <div className="modal-overlay" onClick={() => setModalDetalle(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalle del Corte — {fmtFecha(modalDetalle.fecha)}</h3>
              <button className="modal-close" onClick={() => setModalDetalle(null)}><X size={16} strokeWidth={2} /></button>
            </div>

            {cargandoModal ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                <FaSpinner /> Cargando...
              </div>
            ) : (
              <div className="modal-body">
                {/* Info */}
                <div className="modal-info-row">
                  <span><strong>Cajero:</strong> {modalDetalle.nombre_cajero}</span>
                  <span className="turno-chip" style={{ background: turnoColor[modalDetalle.turno] + "22", color: turnoColor[modalDetalle.turno] }}>
                    {turnoIcono[modalDetalle.turno]} {modalDetalle.turno}
                  </span>
                </div>

                {/* Efectivo */}
                {modalDetalle.detalle_efectivo?.length > 0 && (
                  <div className="modal-seccion">
                    <h4><FaMoneyBillWave /> Efectivo</h4>
                    <table className="modal-tabla">
                      <tbody>
                        {modalDetalle.detalle_efectivo.map((r, i) => (
                          <tr key={i}>
                            <td>${parseFloat(r.denominacion).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                            <td>× {r.cantidad}</td>
                            <td className="modal-subtotal">{fmt(r.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tarjetas */}
                {modalDetalle.detalle_tarjetas?.length > 0 && (
                  <div className="modal-seccion">
                    <h4><FaCreditCard /> Tarjetas</h4>
                    {modalDetalle.detalle_tarjetas.map((t, i) => (
                      <div key={i} className="modal-item">
                        <span>{t.tipo}{t.ultimos_cuatro ? ` ****${t.ultimos_cuatro}` : ""}</span>
                        <strong>{fmt(t.monto)}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bancos */}
                {modalDetalle.detalle_bancos?.length > 0 && (
                  <div className="modal-seccion">
                    <h4><FaUniversity /> Bancos / Depósitos</h4>
                    {modalDetalle.detalle_bancos.map((b, i) => (
                      <div key={i} className="modal-item">
                        <span>{b.deposito}</span>
                        <strong>{fmt(b.monto)}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Gastos */}
                {modalDetalle.detalle_gastos?.length > 0 && (
                  <div className="modal-seccion">
                    <h4><FaReceipt /> Gastos</h4>
                    {modalDetalle.detalle_gastos.map((g, i) => (
                      <div key={i} className="modal-item">
                        <span>{g.concepto}</span>
                        <strong style={{ color: "#ef4444" }}>-{fmt(g.monto)}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Habitaciones */}
                {modalDetalle.detalle_habitaciones?.length > 0 && (
                  <div className="modal-seccion">
                    <h4><FaHotel /> Habitaciones</h4>
                    <table className="modal-tabla">
                      <thead><tr><th>Hab.</th><th>Cant.</th><th>Folio</th><th>Pago</th></tr></thead>
                      <tbody>
                        {modalDetalle.detalle_habitaciones.map((h, i) => (
                          <tr key={i}>
                            <td>{h.habitacion}</td>
                            <td>{h.cantidad}</td>
                            <td>{h.folio || "—"}</td>
                            <td>{h.forma_pago || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Totales */}
                <div className="modal-totales">
                  <div className="modal-total-row"><span>Efectivo</span><span>{fmt(modalDetalle.efectivo_total)}</span></div>
                  <div className="modal-total-row"><span>Tarjetas</span><span>{fmt(modalDetalle.tarjetas_total)}</span></div>
                  <div className="modal-total-row"><span>Bancos</span><span>{fmt(modalDetalle.bancos_total)}</span></div>
                  <div className="modal-total-row" style={{ color: "#ef4444" }}><span>Gastos</span><span>-{fmt(modalDetalle.gastos_total)}</span></div>
                  <div className="modal-total-row modal-total-grande"><span>TOTAL NETO</span><span>{fmt(modalDetalle.total_general)}</span></div>
                </div>

                {modalDetalle.observaciones && (
                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 12, fontStyle: "italic" }}>
                    {modalDetalle.observaciones}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMAR ELIMINAR */}
      {confirmId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header" style={{ background: "#fef2f2" }}>
              <h3 style={{ color: "#dc2626" }}>¿Eliminar este corte?</h3>
              <button className="modal-close" onClick={() => setConfirmId(null)}><X size={16} strokeWidth={2} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#64748b", marginBottom: 24 }}>
                Esta acción no se puede deshacer. Se eliminarán todos los detalles del corte.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn-accion-cancelar" onClick={() => setConfirmId(null)}>
                  Cancelar
                </button>
                <button className="btn-accion-confirmar" onClick={eliminarCorte} disabled={eliminando}>
                  {eliminando ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
