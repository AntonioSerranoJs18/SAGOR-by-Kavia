import { useState, useEffect } from "react";
import "./cortes.css";
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  FaMoneyBillWave, FaCreditCard, FaChartBar, FaChartPie, FaFilter,
  FaTrash, FaSearch, FaUser, FaClock, FaCalendarAlt, FaWater,
  FaWallet, FaUniversity, FaReceipt, FaHotel, FaChartLine,
  FaMoon, FaSun, FaCloudSun, FaSpinner,
} from "react-icons/fa";
import { getToken, api } from "../services/api";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const getTurnoIcon = (turno) => {
  if (turno === "Matutino")   return <FaSun />;
  if (turno === "Vespertino") return <FaCloudSun />;
  if (turno === "Nocturno")   return <FaMoon />;
  return <FaClock />;
};

const fmt = (v) =>
  `$${Number(v).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatFechaLegible = (fechaStr) =>
  new Date(fechaStr + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

export default function CorteDetalle() {
  const token = getToken();

  const [allData,           setAllData]           = useState([]);
  const [dataFiltrada,      setDataFiltrada]       = useState([]);
  const [corteSeleccionado, setCorteSeleccionado]  = useState(null);
  const [detalle,           setDetalle]            = useState(null);
  const [cargandoLista,     setCargandoLista]      = useState(true);
  const [cargandoDetalle,   setCargandoDetalle]    = useState(false);
  const [error,             setError]              = useState("");

  const [filtros, setFiltros] = useState({ nombre: "", turno: "", fecha: "" });

  // ── CARGA INICIAL ─────────────────────────────────────────
  useEffect(() => {
    api.get("/api/cortes/index.php", token)
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        setAllData(lista);
        setDataFiltrada(lista);
        if (lista.length > 0) cargarDetalle(lista[0]);
      })
      .catch(() => setError("No se pudo conectar con el servidor."))
      .finally(() => setCargandoLista(false));
  }, [token]);

  // ── CARGA DE DETALLE DE UN CORTE ─────────────────────────
  const cargarDetalle = (corte) => {
    setCorteSeleccionado(corte);
    setDetalle(null);
    setCargandoDetalle(true);
    api.get(`/api/cortes/index.php?id=${corte.id}`, token)
      .then(setDetalle)
      .catch(() => setDetalle(corte))
      .finally(() => setCargandoDetalle(false));
  };

  // ── FILTROS ───────────────────────────────────────────────
  const aplicarFiltros = () => {
    let f = [...allData];
    if (filtros.nombre) f = f.filter(c => c.nombre_cajero?.toLowerCase().includes(filtros.nombre.toLowerCase()));
    if (filtros.turno)  f = f.filter(c => c.turno === filtros.turno);
    if (filtros.fecha)  f = f.filter(c => c.fecha === filtros.fecha);
    setDataFiltrada(f);
    if (f.length > 0) cargarDetalle(f[0]);
    else { setCorteSeleccionado(null); setDetalle(null); }
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: "", turno: "", fecha: "" });
    setDataFiltrada(allData);
    if (allData.length > 0) cargarDetalle(allData[0]);
  };

  // ── DATOS PARA GRÁFICAS ───────────────────────────────────
  const datosGrafica = detalle ? [
    { name: "Efectivo",       value: parseFloat(detalle.efectivo_total  || 0) },
    { name: "Tarjetas",       value: parseFloat(detalle.tarjetas_total  || 0) },
    { name: "Bancos",         value: parseFloat(detalle.bancos_total    || 0) },
  ] : [];

  // ── OPCIONES ÚNICAS PARA FILTROS ─────────────────────────
  const nombresUnicos = [...new Set(allData.map(d => d.nombre_cajero).filter(Boolean))];
  const turnosUnicos  = [...new Set(allData.map(d => d.turno))];

  if (cargandoLista) {
    return (
      <div className="corte-wrapper" style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:300 }}>
        <div style={{ textAlign:"center", color:"#64748b" }}>
          <FaSpinner style={{ fontSize:32, animation:"spin 1s linear infinite" }} />
          <p style={{ marginTop:12 }}>Cargando cortes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="corte-wrapper">
      {/* HEADER */}
      <div className="header">
        <h2><FaHotel /> HOTEL CHARIOT - REPORTE DE INGRESOS POR TURNO</h2>
        <div className="header-subtitle">Sistema de Gestión de Cortes de Caja</div>
      </div>

      {error && (
        <div style={{ background:"#fee2e2", border:"1px solid #fca5a5", color:"#dc2626", padding:"12px 16px", borderRadius:10, marginBottom:16 }}>
          {error}
        </div>
      )}

      {/* FILTROS */}
      <div className="filtros-container">
        <div className="filtros-grid">
          <div className="filtro-group">
            <label><FaUser /> Cajero</label>
            <select value={filtros.nombre} onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}>
              <option value="">Todos</option>
              {nombresUnicos.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="filtro-group">
            <label><FaClock /> Turno</label>
            <select value={filtros.turno} onChange={(e) => setFiltros({ ...filtros, turno: e.target.value })}>
              <option value="">Todos</option>
              {turnosUnicos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="filtro-group">
            <label><FaCalendarAlt /> Fecha</label>
            <input type="date" value={filtros.fecha} onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })} />
          </div>
        </div>
        <div className="filtros-actions">
          <button className="btn-limpiar" onClick={limpiarFiltros}><FaTrash /> Limpiar</button>
          <button className="btn-filtrar" onClick={aplicarFiltros}><FaSearch /> Filtrar</button>
        </div>
      </div>

      {/* RESULTADOS */}
      {dataFiltrada.length > 0 ? (
        <>
          {dataFiltrada.length > 1 && (
            <div className="selector-cortes">
              <label>📋 Seleccionar corte:</label>
              <select
                value={corteSeleccionado?.id || ""}
                onChange={(e) => {
                  const c = dataFiltrada.find(x => x.id === parseInt(e.target.value));
                  if (c) cargarDetalle(c);
                }}
              >
                {dataFiltrada.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre_cajero} — {c.turno} — {formatFechaLegible(c.fecha)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {corteSeleccionado && (
            <div className="info-corte-actual">
              <div className="info-card">
                <FaUser />
                <div><small>Cajero</small><strong>{corteSeleccionado.nombre_cajero}</strong></div>
              </div>
              <div className="info-card">
                {getTurnoIcon(corteSeleccionado.turno)}
                <div><small>Turno</small><strong>{corteSeleccionado.turno}</strong></div>
              </div>
              <div className="info-card">
                <FaCalendarAlt />
                <div><small>Fecha</small><strong>{formatFechaLegible(corteSeleccionado.fecha)}</strong></div>
              </div>
            </div>
          )}

          {cargandoDetalle ? (
            <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>
              <FaSpinner style={{ fontSize:24 }} /> Cargando detalle...
            </div>
          ) : detalle && (
            <>
              {/* GRÁFICAS */}
              <div className="charts">
                <div className="chart-box">
                  <h3><FaChartLine /> Ingresos por tipo</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={datosGrafica}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[8,8,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-box">
                  <h3><FaChartPie /> Distribución</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={datosGrafica.filter(d => d.value > 0)} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" outerRadius={90}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosGrafica.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TABLAS DE DETALLE */}
              <div className="top-grid">
                <div className="section">
                  <h3><FaMoneyBillWave /> Efectivo</h3>
                  {detalle.detalle_efectivo?.length > 0 ? (
                    <table>
                      <tbody>
                        {detalle.detalle_efectivo.map((r, i) => (
                          <tr key={i}>
                            <td>${parseFloat(r.denominacion).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                            <td>× {r.cantidad}</td>
                            <td>{fmt(r.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p className="sin-gastos">Sin desglose registrado</p>}
                  <div className="total-efectivo">
                    <strong>Total Efectivo:</strong> {fmt(detalle.efectivo_total || 0)}
                  </div>
                </div>

                <div className="section">
                  <h3><FaCreditCard /> Tarjetas</h3>
                  {detalle.detalle_tarjetas?.length > 0 ? (
                    <ul>
                      {detalle.detalle_tarjetas.map((t, i) => (
                        <li key={i}>
                          <span>{t.tipo}{t.ultimos_cuatro ? ` /****${t.ultimos_cuatro}` : ""}</span>
                          <strong>{fmt(t.monto)}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="sin-gastos">Sin tarjetas registradas</p>}
                  <div className="total-tarjetas">
                    <strong>Total Tarjetas:</strong> {fmt(detalle.tarjetas_total || 0)}
                  </div>
                </div>

                <div className="section">
                  <h3><FaReceipt /> Gastos</h3>
                  {detalle.detalle_gastos?.length > 0 ? (
                    detalle.detalle_gastos.map((g, i) => (
                      <p key={i}>
                        <span><FaWater /> {g.concepto}</span>
                        <strong>{fmt(g.monto)}</strong>
                      </p>
                    ))
                  ) : <p className="sin-gastos">Sin gastos registrados</p>}
                  <div className="total-gastos">
                    <strong>Total Gastos:</strong> {fmt(detalle.gastos_total || 0)}
                  </div>
                </div>
              </div>

              {/* TOTALES */}
              <div className="totales">
                <div className="total-item"><FaMoneyBillWave /><span>Efectivo:</span><span>{fmt(detalle.efectivo_total || 0)}</span></div>
                <div className="total-item"><FaCreditCard /><span>Tarjetas:</span><span>{fmt(detalle.tarjetas_total || 0)}</span></div>
                <div className="total-item"><FaUniversity /><span>Bancos:</span><span>{fmt(detalle.bancos_total || 0)}</span></div>
                <div className="total-item"><FaReceipt /><span>Gastos:</span><span className="gasto">{fmt(detalle.gastos_total || 0)}</span></div>
                <div className="total-grande"><FaWallet /><span>Total Neto:</span><span>{fmt(detalle.total_general || 0)}</span></div>
              </div>

              {detalle.observaciones && (
                <div className="section" style={{ marginTop:16 }}>
                  <h3>Observaciones</h3>
                  <p style={{ color:"#475569", fontSize:"0.9rem" }}>{detalle.observaciones}</p>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="section" style={{ textAlign:"center", padding:"60px" }}>
          <FaSearch size={48} color="#94a3b8" />
          <h3>{allData.length === 0 ? "Sin cortes registrados" : "No se encontraron resultados"}</h3>
          <p>{allData.length === 0 ? "Los recepcionistas aún no han subido cortes." : "Intenta con otros filtros"}</p>
        </div>
      )}
    </div>
  );
}
