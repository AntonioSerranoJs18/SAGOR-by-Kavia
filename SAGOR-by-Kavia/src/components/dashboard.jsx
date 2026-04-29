import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { getUsuario, getToken, api } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell, Area,
} from "recharts";
import {
  FaChartLine, FaClock, FaDollarSign, FaExclamationTriangle,
  FaCalendarDay, FaSun, FaMoon, FaCloudSun, FaUserShield, FaChartBar,
} from "react-icons/fa";
import { MdAnalytics, MdTimeline } from "react-icons/md";

const getTurnoActual = () => {
  const h = new Date().getHours();
  if (h >= 6  && h < 14) return "Matutino";
  if (h >= 14 && h < 22) return "Vespertino";
  return "Nocturno";
};

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const Dashboard = () => {
  const usuario  = getUsuario();
  const token    = getToken();
  const [turnoActual, setTurnoActual] = useState(getTurnoActual());
  const [cortes,      setCortes]      = useState([]);
  const [cargando,    setCargando]    = useState(true);

  useEffect(() => {
    const iv = setInterval(() => setTurnoActual(getTurnoActual()), 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    api.get("/api/cortes/index.php", token)
      .then(data => setCortes(Array.isArray(data) ? data : []))
      .catch(() => setCortes([]))
      .finally(() => setCargando(false));
  }, [token]);

  // ── MÉTRICAS ─────────────────────────────────────────────
  const hoy = new Date().toISOString().split("T")[0];

  const cortesHoy = cortes.filter(c => c.fecha === hoy);
  const ingresosHoy = cortesHoy.reduce((s, c) => s + parseFloat(c.total_general || 0), 0);

  // Semana actual (lunes a hoy)
  const getLunes = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff)).toISOString().split("T")[0];
  };
  const lunes = getLunes();

  const ingresosData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes + "T12:00:00");
    d.setDate(d.getDate() + i);
    const fechaStr = d.toISOString().split("T")[0];
    const total = cortes
      .filter(c => c.fecha === fechaStr)
      .reduce((s, c) => s + parseFloat(c.total_general || 0), 0);
    return { dia: DIAS[d.getDay()], ingreso: total, fecha: fechaStr };
  });

  const totalSemana   = ingresosData.reduce((s, d) => s + d.ingreso, 0);
  const promedioDiario = totalSemana / 7;
  const diaMayorIngreso = ingresosData.reduce((max, d) => d.ingreso > max.ingreso ? d : max, ingresosData[0]);
  const primerDia = ingresosData[0].ingreso;
  const ultimoDia = ingresosData[6].ingreso;
  const tendencia = primerDia > 0 ? (((ultimoDia - primerDia) / primerDia) * 100).toFixed(1) : "0.0";

  // Estado de turnos — si hay corte del día con ese turno = Finalizado
  const turnosEstado = [
    { nombre: "Matutino",   horario: "06:00 - 14:00", icono: <FaSun />,      valor: 1 },
    { nombre: "Vespertino", horario: "14:00 - 22:00", icono: <FaCloudSun />, valor: 1 },
    { nombre: "Nocturno",   horario: "22:00 - 06:00", icono: <FaMoon />,     valor: 1 },
  ].map(t => ({
    ...t,
    estado: t.nombre === turnoActual
      ? "Activo"
      : cortesHoy.some(c => c.turno === t.nombre)
        ? "Finalizado"
        : ["Vespertino", "Nocturno"].includes(turnoActual) && t.nombre === "Matutino"
          ? "Finalizado"
          : turnoActual === "Nocturno" && t.nombre === "Vespertino"
            ? "Finalizado"
            : "Pendiente",
  }));

  const formatter = (v) => `$${Number(v).toLocaleString("es-MX")}`;

  const CustomBarTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const idx   = payload[0].payload.index;
    const turno = turnosEstado[idx];
    return (
      <div style={{ background:"white", borderRadius:12, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", padding:"8px 16px" }}>
        <p style={{ margin:0, fontWeight:600 }}>{turno?.nombre}</p>
        <p style={{ margin:"4px 0 0", color:"#64748b" }}>
          Estado: <strong style={{ color: turno?.estado==="Activo"?"#22c55e":turno?.estado==="Finalizado"?"#3b82f6":"#f59e0b" }}>{turno?.estado}</strong>
        </p>
        <p style={{ margin:"4px 0 0", fontSize:12, color:"#64748b" }}>{turno?.horario}</p>
      </div>
    );
  };

  const CustomLineTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"white", borderRadius:12, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", padding:"8px 16px" }}>
        <p style={{ margin:0, fontWeight:600 }}>{payload[0].payload.dia}</p>
        <p style={{ margin:"4px 0 0", color:"#3b82f6", fontWeight:600 }}>{formatter(payload[0].value)}</p>
      </div>
    );
  };

  const saludo = (() => {
    const h = new Date().getHours();
    if (h >= 6  && h < 12) return "Buenos días";
    if (h >= 12 && h < 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  return (
    <div className="dashboard">
      <div className="header">
        <h1><MdAnalytics /> Dashboard de Turnos</h1>
        <span><FaUserShield /> {saludo}, {usuario?.nombre || "Usuario"}</span>
      </div>

      <div className="cards">
        <div className="card">
          <h3><FaClock /> Cortes Hoy</h3>
          <p>{cargando ? "..." : cortesHoy.length}</p>
          <small style={{ color:"#64748b", marginTop:8, display:"block" }}>
            {cortesHoy.length === 0 ? "Sin cortes registrados" : `De ${cortesHoy.length} turno(s)`}
          </small>
        </div>

        <div className="card">
          <h3>
            {turnoActual === "Matutino" ? <FaSun /> : turnoActual === "Vespertino" ? <FaCloudSun /> : <FaMoon />} Turno Actual
          </h3>
          <p>
            {turnoActual}
            <span className="turno-badge turno-activo">EN CURSO</span>
          </p>
        </div>

        <div className="card">
          <h3><FaDollarSign /> Ingresos Hoy</h3>
          <p>{cargando ? "..." : `$${ingresosHoy.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}</p>
          <small style={{ color: parseFloat(tendencia) >= 0 ? "#10b981" : "#ef4444", marginTop:8, display:"block" }}>
            {parseFloat(tendencia) >= 0 ? "↑" : "↓"} {Math.abs(tendencia)}% vs inicio de semana
          </small>
        </div>

        <div className="card">
          <h3><FaExclamationTriangle /> Cortes pendientes</h3>
          <p>{cargando ? "..." : 3 - cortesHoy.length < 0 ? 0 : 3 - cortesHoy.length}</p>
          <small style={{ color:"#f59e0b", marginTop:8, display:"block" }}>
            De 3 turnos del día
          </small>
        </div>
      </div>

      <div className="charts">
        <div className="chart-card">
          <h3><FaChartLine /> Ingresos por semana</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ingresosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dia" stroke="#64748b" style={{ fontSize:12 }} />
              <YAxis tickFormatter={formatter} stroke="#64748b" style={{ fontSize:12 }} />
              <Tooltip content={<CustomLineTooltip />} />
              <Line type="monotone" dataKey="ingreso" stroke="#3b82f6" strokeWidth={3}
                dot={{ fill:"#3b82f6", strokeWidth:2, r:6 }} activeDot={{ r:8 }} />
              <Area type="monotone" dataKey="ingreso" fill="url(#colorGradient)" stroke="none" />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, paddingTop:12, borderTop:"1px solid #eef2f6" }}>
            <div>
              <small style={{ color:"#64748b" }}>Promedio diario</small>
              <p style={{ margin:0, fontWeight:600 }}>{formatter(promedioDiario)}</p>
            </div>
            <div>
              <small style={{ color:"#64748b" }}>Mejor día</small>
              <p style={{ margin:0, fontWeight:600, color:"#10b981" }}>
                {diaMayorIngreso.dia}: {formatter(diaMayorIngreso.ingreso)}
              </p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3><FaChartBar /> Estado de turnos (Tiempo real)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={turnosEstado.map((t, i) => ({ ...t, index: i }))} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="nombre" type="category" width={100}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={4} textAnchor="start" fill="#1e293b" fontSize={13}>
                      {payload.value}
                    </text>
                  </g>
                )}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="valor" barSize={40} radius={[0,8,8,0]}>
                {turnosEstado.map((t, i) => (
                  <Cell key={i} fill={t.estado==="Activo"?"#22c55e":t.estado==="Finalizado"?"#3b82f6":"#f59e0b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="legend">
            <span><span className="dot green"></span> Activo <small style={{ marginLeft:4, color:"#64748b" }}>(En curso)</small></span>
            <span><span className="dot blue"></span> Finalizado <small style={{ marginLeft:4, color:"#64748b" }}>(Con corte)</small></span>
            <span><span className="dot yellow"></span> Pendiente <small style={{ marginLeft:4, color:"#64748b" }}>(Sin corte)</small></span>
          </div>

          <div style={{ marginTop:16, padding:12, background:"#f8fafc", borderRadius:12, display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:12 }}>
            {turnosEstado.map((t, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <small style={{ color:"#64748b" }}>{t.nombre}</small>
                <p style={{ margin:0, fontSize:"0.8rem", fontWeight:500 }}>{t.horario}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cards" style={{ marginTop:0 }}>
        <div className="card">
          <h3><FaCalendarDay /> Semana actual</h3>
          <p>{cargando ? "..." : formatter(totalSemana)}</p>
          <small style={{ color:"#64748b" }}>Total acumulado</small>
        </div>
        <div className="card">
          <h3><FaDollarSign /> Total cortes</h3>
          <p>{cargando ? "..." : cortes.length}</p>
          <small style={{ color:"#64748b" }}>Registrados en el sistema</small>
        </div>
        <div className="card">
          <h3><MdTimeline /> Promedio por corte</h3>
          <p>{cargando ? "..." : cortes.length > 0 ? formatter(cortes.reduce((s,c) => s + parseFloat(c.total_general||0), 0) / cortes.length) : "$0"}</p>
          <small style={{ color:"#64748b" }}>Por turno registrado</small>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
