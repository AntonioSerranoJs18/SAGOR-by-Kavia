import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NuevoCorte.css";
import {
  FaMoneyBillWave, FaCreditCard, FaUniversity, FaReceipt,
  FaHotel, FaPaperPlane, FaPlus, FaTrash, FaCheckCircle, FaSpinner,
} from "react-icons/fa";
import { getToken, api } from "../../services/api";

const DENOMINACIONES = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1];
const initEfectivo = () => DENOMINACIONES.reduce((acc, d) => ({ ...acc, [d]: "" }), {});

export default function EditarCorte() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const token    = getToken();

  const [cargando,      setCargando]      = useState(true);
  const [turno,         setTurno]         = useState("Matutino");
  const [fecha,         setFecha]         = useState("");
  const [efectivo,      setEfectivo]      = useState(initEfectivo());
  const [tarjetas,      setTarjetas]      = useState([{ tipo: "", monto: "" }]);
  const [bancos,        setBancos]        = useState([{ deposito: "", monto: "" }]);
  const [gastos,        setGastos]        = useState([{ concepto: "", monto: "" }]);
  const [habitaciones,  setHabitaciones]  = useState([
    { habitacion: "", cantidad: "", folio: "", forma_pago: "", descripcion: "" },
  ]);
  const [observaciones, setObservaciones] = useState("");
  const [nombreCajero,  setNombreCajero]  = useState("");
  const [enviando,      setEnviando]      = useState(false);
  const [exito,         setExito]         = useState(false);
  const [error,         setError]         = useState("");

  /* ── Cargar datos existentes ── */
  useEffect(() => {
    api.get(`/api/cortes/index.php?id=${id}`, token)
      .then((data) => {
        setTurno(data.turno || "Matutino");
        setFecha(data.fecha || "");
        setNombreCajero(data.nombre_cajero || "");
        setObservaciones(data.observaciones || "");

        const ef = initEfectivo();
        (data.detalle_efectivo || []).forEach((r) => { ef[r.denominacion] = String(r.cantidad); });
        setEfectivo(ef);

        setTarjetas(
          data.detalle_tarjetas?.length
            ? data.detalle_tarjetas.map((r) => ({ tipo: r.tipo, monto: String(r.monto) }))
            : [{ tipo: "", monto: "" }]
        );
        setBancos(
          data.detalle_bancos?.length
            ? data.detalle_bancos.map((r) => ({ deposito: r.deposito, monto: String(r.monto) }))
            : [{ deposito: "", monto: "" }]
        );
        setGastos(
          data.detalle_gastos?.length
            ? data.detalle_gastos.map((r) => ({ concepto: r.concepto, monto: String(r.monto) }))
            : [{ concepto: "", monto: "" }]
        );
        setHabitaciones(
          data.detalle_habitaciones?.length
            ? data.detalle_habitaciones.map((r) => ({
                habitacion: r.habitacion,
                cantidad:   String(r.cantidad),
                folio:      r.folio       || "",
                forma_pago: r.forma_pago  || "",
                descripcion:r.descripcion || "",
              }))
            : [{ habitacion: "", cantidad: "", folio: "", forma_pago: "", descripcion: "" }]
        );
      })
      .catch(() => setError("No se pudo cargar el corte."))
      .finally(() => setCargando(false));
  }, [id, token]);

  /* ── Cálculos ── */
  const totalEfectivo = DENOMINACIONES.reduce((s, d) => s + (parseFloat(efectivo[d]) || 0) * d, 0);
  const totalTarjetas = tarjetas.reduce((s, r) => s + (parseFloat(r.monto) || 0), 0);
  const totalBancos   = bancos.reduce((s, r)   => s + (parseFloat(r.monto) || 0), 0);
  const totalGastos   = gastos.reduce((s, r)   => s + (parseFloat(r.monto) || 0), 0);
  const totalGeneral  = totalEfectivo + totalTarjetas + totalBancos - totalGastos;
  const fmt = (n) => n.toLocaleString("es-MX", { minimumFractionDigits: 2 });

  /* ── Helpers de filas ── */
  const addRow    = (setter) => setter((p) => [...p, Object.fromEntries(Object.keys(p[0]).map((k) => [k, ""]))]);
  const removeRow = (setter, i) => setter((p) => p.filter((_, idx) => idx !== i));
  const updateRow = (setter, i, field, val) =>
    setter((p) => p.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));

  /* ── Envío ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const payload = {
      turno, fecha,
      nombre_cajero:  nombreCajero,
      efectivo_total: totalEfectivo,
      tarjetas_total: totalTarjetas,
      bancos_total:   totalBancos,
      gastos_total:   totalGastos,
      total_general:  totalGeneral,
      observaciones:  observaciones || null,
      detalle_efectivo: DENOMINACIONES
        .filter((d) => parseFloat(efectivo[d]) > 0)
        .map((d) => ({ denominacion: d, cantidad: parseFloat(efectivo[d]), subtotal: d * parseFloat(efectivo[d]) })),
      detalle_tarjetas:    tarjetas.filter((r) => r.tipo && parseFloat(r.monto) > 0),
      detalle_bancos:      bancos.filter((r) => r.deposito && parseFloat(r.monto) > 0),
      detalle_gastos:      gastos.filter((r) => r.concepto && parseFloat(r.monto) > 0),
      detalle_habitaciones:habitaciones.filter((r) => r.habitacion),
    };

    try {
      await api.put(`/api/cortes/index.php?id=${id}`, payload, token);
      setExito(true);
      setTimeout(() => navigate("/mis-cortes"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300, color: "#64748b" }}>
        <FaSpinner style={{ marginRight: 10 }} /> Cargando corte...
      </div>
    );
  }

  if (exito) {
    return (
      <div className="corte-exito">
        <FaCheckCircle />
        <h2>¡Corte actualizado!</h2>
        <p>Total: <strong>${fmt(totalGeneral)}</strong></p>
        <p className="exito-sub">Redirigiendo a tus cortes...</p>
      </div>
    );
  }

  return (
    <form className="nc-wrapper" onSubmit={handleSubmit}>

      {/* ENCABEZADO */}
      <div className="nc-header">
        <div>
          <h1>Editar Corte</h1>
          <p>Hotel Chariot Mérida by Kavia</p>
        </div>
        <button type="submit" className="nc-btn-submit" disabled={enviando}>
          <FaPaperPlane /> {enviando ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {error && <p className="nc-error">{error}</p>}

      {/* DATOS GENERALES */}
      <div className="nc-datos-gen">
        <div className="nc-field">
          <label>Nombre</label>
          <input type="text" value={nombreCajero} readOnly />
        </div>
        <div className="nc-field">
          <label>Turno</label>
          <select value={turno} onChange={(e) => setTurno(e.target.value)}>
            <option>Matutino</option>
            <option>Vespertino</option>
            <option>Nocturno</option>
          </select>
        </div>
        <div className="nc-field">
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="nc-grid">

        {/* EFECTIVO */}
        <div className="nc-seccion">
          <div className="nc-sec-header">
            <FaMoneyBillWave /> EFECTIVO
            <span className="nc-sec-total">${fmt(totalEfectivo)}</span>
          </div>
          <table className="nc-tabla">
            <thead><tr><th>Moneda</th><th>Cantidad</th><th>Total</th></tr></thead>
            <tbody>
              {DENOMINACIONES.map((d) => {
                const qty = parseFloat(efectivo[d]) || 0;
                return (
                  <tr key={d}>
                    <td className="denom">${d.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                    <td>
                      <input type="number" min="0" placeholder="0" value={efectivo[d]}
                        onChange={(e) => setEfectivo((p) => ({ ...p, [d]: e.target.value }))} />
                    </td>
                    <td className="subtotal">${fmt(qty * d)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TARJETAS */}
        <div className="nc-seccion">
          <div className="nc-sec-header">
            <FaCreditCard /> VISA / MC / TARJETAS
            <span className="nc-sec-total">${fmt(totalTarjetas)}</span>
          </div>
          <table className="nc-tabla">
            <thead><tr><th>Tarjeta</th><th>Monto</th><th></th></tr></thead>
            <tbody>
              {tarjetas.map((r, i) => (
                <tr key={i}>
                  <td>
                    <select value={r.tipo} onChange={(e) => updateRow(setTarjetas, i, "tipo", e.target.value)}>
                      <option value="">Seleccionar</option>
                      <option>VISA</option><option>MASTERCARD</option><option>AMEX</option><option>OTRO</option>
                    </select>
                  </td>
                  <td>
                    <input type="number" min="0" step="0.01" placeholder="0.00"
                      value={r.monto} onChange={(e) => updateRow(setTarjetas, i, "monto", e.target.value)} />
                  </td>
                  <td>{tarjetas.length > 1 && <button type="button" className="btn-remove" onClick={() => removeRow(setTarjetas, i)}><FaTrash /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-add-row" onClick={() => addRow(setTarjetas)}><FaPlus /> Agregar tarjeta</button>
        </div>

        {/* BANCOS */}
        <div className="nc-seccion">
          <div className="nc-sec-header">
            <FaUniversity /> BANCOS / DEPÓSITOS
            <span className="nc-sec-total">${fmt(totalBancos)}</span>
          </div>
          <table className="nc-tabla">
            <thead><tr><th>Depósito / Referencia</th><th>Monto</th><th></th></tr></thead>
            <tbody>
              {bancos.map((r, i) => (
                <tr key={i}>
                  <td><input type="text" placeholder="Banco o referencia"
                    value={r.deposito} onChange={(e) => updateRow(setBancos, i, "deposito", e.target.value)} /></td>
                  <td><input type="number" min="0" step="0.01" placeholder="0.00"
                    value={r.monto} onChange={(e) => updateRow(setBancos, i, "monto", e.target.value)} /></td>
                  <td>{bancos.length > 1 && <button type="button" className="btn-remove" onClick={() => removeRow(setBancos, i)}><FaTrash /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-add-row" onClick={() => addRow(setBancos)}><FaPlus /> Agregar depósito</button>
        </div>

        {/* GASTOS */}
        <div className="nc-seccion">
          <div className="nc-sec-header">
            <FaReceipt /> GASTOS
            <span className="nc-sec-total red">${fmt(totalGastos)}</span>
          </div>
          <table className="nc-tabla">
            <thead><tr><th>Concepto</th><th>Monto</th><th></th></tr></thead>
            <tbody>
              {gastos.map((r, i) => (
                <tr key={i}>
                  <td><input type="text" placeholder="Concepto del gasto"
                    value={r.concepto} onChange={(e) => updateRow(setGastos, i, "concepto", e.target.value)} /></td>
                  <td><input type="number" min="0" step="0.01" placeholder="0.00"
                    value={r.monto} onChange={(e) => updateRow(setGastos, i, "monto", e.target.value)} /></td>
                  <td>{gastos.length > 1 && <button type="button" className="btn-remove" onClick={() => removeRow(setGastos, i)}><FaTrash /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-add-row" onClick={() => addRow(setGastos)}><FaPlus /> Agregar gasto</button>
        </div>
      </div>

      {/* HABITACIONES */}
      <div className="nc-seccion nc-habitaciones">
        <div className="nc-sec-header"><FaHotel /> HABITACIONES ATENDIDAS</div>
        <div className="nc-tabla-wrap">
          <table className="nc-tabla">
            <thead>
              <tr><th>Habitación</th><th>Cantidad</th><th>Folio</th><th>Forma de Pago</th><th>Descripción</th><th></th></tr>
            </thead>
            <tbody>
              {habitaciones.map((r, i) => (
                <tr key={i}>
                  <td><input type="text" placeholder="101" value={r.habitacion}
                    onChange={(e) => updateRow(setHabitaciones, i, "habitacion", e.target.value)} /></td>
                  <td><input type="number" min="1" placeholder="1" value={r.cantidad}
                    onChange={(e) => updateRow(setHabitaciones, i, "cantidad", e.target.value)} /></td>
                  <td><input type="text" placeholder="Folio" value={r.folio}
                    onChange={(e) => updateRow(setHabitaciones, i, "folio", e.target.value)} /></td>
                  <td>
                    <select value={r.forma_pago} onChange={(e) => updateRow(setHabitaciones, i, "forma_pago", e.target.value)}>
                      <option value="">Seleccionar</option>
                      <option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option><option>Banco</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="Observación" value={r.descripcion}
                    onChange={(e) => updateRow(setHabitaciones, i, "descripcion", e.target.value)} /></td>
                  <td>{habitaciones.length > 1 && <button type="button" className="btn-remove" onClick={() => removeRow(setHabitaciones, i)}><FaTrash /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn-add-row" onClick={() => addRow(setHabitaciones)}><FaPlus /> Agregar habitación</button>
      </div>

      {/* RESUMEN + OBSERVACIONES */}
      <div className="nc-bottom">
        <div className="nc-observaciones">
          <label>Observaciones</label>
          <textarea rows={4} placeholder="Anota cualquier incidencia o comentario del turno..."
            value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
        </div>
        <div className="nc-resumen">
          <h3>Resumen del Turno</h3>
          <div className="resumen-row"><span>Efectivo</span><span>${fmt(totalEfectivo)}</span></div>
          <div className="resumen-row"><span>Tarjetas</span><span>${fmt(totalTarjetas)}</span></div>
          <div className="resumen-row"><span>Bancos / Depósitos</span><span>${fmt(totalBancos)}</span></div>
          <div className="resumen-row gasto-row"><span>Gastos</span><span>- ${fmt(totalGastos)}</span></div>
          <div className="resumen-divider" />
          <div className="resumen-row total-row"><span>GRAN TOTAL</span><span>${fmt(totalGeneral)}</span></div>
        </div>
      </div>

      {/* SUBMIT FINAL */}
      <div className="nc-footer">
        {error && <p className="nc-error">{error}</p>}
        <button type="submit" className="nc-btn-submit-lg" disabled={enviando}>
          <FaPaperPlane /> {enviando ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
