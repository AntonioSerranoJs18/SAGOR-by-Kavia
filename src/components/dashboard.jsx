import React, { useState, useEffect } from "react";
import "./dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
  Area,
} from "recharts";
import {
  FaChartLine,
  FaClock,
  FaDollarSign,
  FaExclamationTriangle,
  FaCalendarDay,
  FaSun,
  FaMoon,
  FaCloudSun,
  FaUserShield,
  FaChartBar,
} from "react-icons/fa";
import { MdAnalytics, MdTimeline } from "react-icons/md";

const Dashboard = () => {
  // 📊 INGRESOS REALES POR DÍA
  const ingresosData = [
    { dia: "Lun", ingreso: 12000, transacciones: 145 },
    { dia: "Mar", ingreso: 15000, transacciones: 162 },
    { dia: "Mié", ingreso: 14000, transacciones: 158 },
    { dia: "Jue", ingreso: 16000, transacciones: 175 },
    { dia: "Vie", ingreso: 18000, transacciones: 198 },
    { dia: "Sáb", ingreso: 20000, transacciones: 245 },
    { dia: "Dom", ingreso: 17000, transacciones: 189 },
  ];

  // 🧠 OBTENER TURNO ACTUAL SEGÚN HORA
  const getTurnoActual = () => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 14) return "Matutino";
    if (hora >= 14 && hora < 22) return "Vespertino";
    return "Nocturno";
  };

  const [turnoActual, setTurnoActual] = useState(getTurnoActual());

  // Actualizar turno cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setTurnoActual(getTurnoActual());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ ESTADO REAL SECUENCIAL MEJORADO
  const turnosEstado = [
    {
      nombre: "Matutino",
      horario: "06:00 - 14:00",
      estado:
        turnoActual === "Matutino"
          ? "Activo"
          : ["Vespertino", "Nocturno"].includes(turnoActual)
          ? "Finalizado"
          : "Pendiente",
      icono: <FaSun />,
      valor: 1,
    },
    {
      nombre: "Vespertino",
      horario: "14:00 - 22:00",
      estado:
        turnoActual === "Vespertino"
          ? "Activo"
          : turnoActual === "Nocturno"
          ? "Finalizado"
          : "Pendiente",
      icono: <FaCloudSun />,
      valor: 1,
    },
    {
      nombre: "Nocturno",
      horario: "22:00 - 06:00",
      estado: turnoActual === "Nocturno" ? "Activo" : "Pendiente",
      icono: <FaMoon />,
      valor: 1,
    },
  ];

  // Calcular métricas adicionales
  const totalSemana = ingresosData.reduce((sum, d) => sum + d.ingreso, 0);
  const promedioDiario = totalSemana / 7;
  const diaMayorIngreso = ingresosData.reduce((max, d) => 
    d.ingreso > max.ingreso ? d : max, ingresosData[0]);
  const tendencia = ((ingresosData[6].ingreso - ingresosData[0].ingreso) / ingresosData[0].ingreso * 100).toFixed(1);

  // Formateador de números
  const formatter = (value) => `$${value.toLocaleString("es-MX")}`;

  // Tooltip personalizado para la gráfica de barras (CORREGIDO)
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const index = payload[0].payload.index;
      const turno = turnosEstado[index];
      return (
        <div style={{
          background: "white",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "8px 16px"
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{turno?.nombre || "Turno"}</p>
          <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>
            Estado: <strong style={{ color: 
              turno?.estado === "Activo" ? "#22c55e" : 
              turno?.estado === "Finalizado" ? "#3b82f6" : "#f59e0b"
            }}>{turno?.estado || "Desconocido"}</strong>
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
            {turno?.horario}
          </p>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para la gráfica de líneas
  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "white",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "8px 16px"
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].payload.dia}</p>
          <p style={{ margin: "4px 0 0 0", color: "#3b82f6", fontWeight: 600 }}>
            {formatter(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <h1>
          <MdAnalytics /> Dashboard de Turnos
        </h1>
        <span>
          <FaUserShield /> Bienvenido, Administrador
        </span>
      </div>

      {/* CARDS MEJORADAS */}
      <div className="cards">
        <div className="card">
          <h3>
            <FaClock /> Turnos Hoy
          </h3>
          <p>3</p>
          <small style={{ color: "#64748b", marginTop: "8px", display: "block" }}>
            Completos al 100%
          </small>
        </div>

        <div className="card">
          <h3>
            {turnoActual === "Matutino" ? <FaSun /> : turnoActual === "Vespertino" ? <FaCloudSun /> : <FaMoon />} Turno Actual
          </h3>
          <p>
            {turnoActual}
            <span className={`turno-badge turno-activo`}>
              EN CURSO
            </span>
          </p>
        </div>

        <div className="card">
          <h3>
            <FaDollarSign /> Ingresos Hoy
          </h3>
          <p>${ingresosData[new Date().getDay() - 1]?.ingreso?.toLocaleString() || "18,500"}</p>
          <small style={{ color: "#10b981", marginTop: "8px", display: "block" }}>
            ↑ {tendencia}% vs inicio de semana
          </small>
        </div>

        <div className="card">
          <h3>
            <FaExclamationTriangle /> Incidencias
          </h3>
          <p>1</p>
          <small style={{ color: "#f59e0b", marginTop: "8px", display: "block" }}>
            Sin resolver: 0
          </small>
        </div>
      </div>

      {/* GRÁFICAS */}
      <div className="charts">
        {/* INGRESOS SEMANALES - LINE CHART MEJORADO */}
        <div className="chart-card">
          <h3>
            <FaChartLine /> Ingresos por semana
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ingresosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="dia" 
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                tickFormatter={formatter}
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="ingreso"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Area
                type="monotone"
                dataKey="ingreso"
                fill="url(#colorGradient)"
                stroke="none"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid #eef2f6"
          }}>
            <div>
              <small style={{ color: "#64748b" }}>Promedio diario</small>
              <p style={{ margin: 0, fontWeight: 600 }}>{formatter(promedioDiario)}</p>
            </div>
            <div>
              <small style={{ color: "#64748b" }}>Mejor día</small>
              <p style={{ margin: 0, fontWeight: 600, color: "#10b981" }}>
                {diaMayorIngreso.dia}: {formatter(diaMayorIngreso.ingreso)}
              </p>
            </div>
          </div>
        </div>

        {/* TURNOS SECUENCIALES - BAR CHART MEJORADO */}
        <div className="chart-card">
          <h3>
            <FaChartBar /> Estado de turnos (Tiempo real)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={turnosEstado.map((item, idx) => ({ ...item, index: idx }))} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="nombre" 
                type="category" 
                width={100}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={4} textAnchor="start" fill="#1e293b" fontSize={13}>
                      {turnosEstado[payload.index]?.icono} {payload.value}
                    </text>
                  </g>
                )}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="valor" barSize={40} radius={[0, 8, 8, 0]}>
                {turnosEstado.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.estado === "Activo"
                        ? "#22c55e"
                        : entry.estado === "Finalizado"
                        ? "#3b82f6"
                        : "#f59e0b"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* LEYENDA MEJORADA */}
          <div className="legend">
            <span>
              <span className="dot green"></span> Activo
              <small style={{ marginLeft: "4px", color: "#64748b" }}>(En curso)</small>
            </span>
            <span>
              <span className="dot blue"></span> Finalizado
              <small style={{ marginLeft: "4px", color: "#64748b" }}>(Completado)</small>
            </span>
            <span>
              <span className="dot yellow"></span> Pendiente
              <small style={{ marginLeft: "4px", color: "#64748b" }}>(Próximo)</small>
            </span>
          </div>

          {/* INFO ADICIONAL DE HORARIOS */}
          <div style={{ 
            marginTop: "16px", 
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            {turnosEstado.map((turno, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <small style={{ color: "#64748b" }}>{turno.nombre}</small>
                <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 500 }}>
                  {turno.horario}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN DE MÉTRICAS ADICIONALES */}
      <div className="cards" style={{ marginTop: "0" }}>
        <div className="card">
          <h3>
            <FaCalendarDay /> Semana actual
          </h3>
          <p>{formatter(totalSemana)}</p>
          <small style={{ color: "#64748b" }}>Total acumulado</small>
        </div>
        <div className="card">
          <h3>
            <FaDollarSign /> Transacciones
          </h3>
          <p>{ingresosData.reduce((sum, d) => sum + d.transacciones, 0)}</p>
          <small style={{ color: "#64748b" }}>En la semana</small>
        </div>
        <div className="card">
          <h3>
            <MdTimeline /> Ticket promedio
          </h3>
          <p>{formatter(promedioDiario / (ingresosData.reduce((sum, d) => sum + d.transacciones, 0) / 7))}</p>
          <small style={{ color: "#64748b" }}>Por transacción</small>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;