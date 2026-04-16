import React from "react";
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
  Cell
} from "recharts";

const Dashboard = () => {

  // 📊 INGRESOS REALES POR DÍA
  const ingresosData = [
    { dia: "Lun", ingreso: 12000 },
    { dia: "Mar", ingreso: 15000 },
    { dia: "Mié", ingreso: 14000 },
    { dia: "Jue", ingreso: 16000 },
    { dia: "Vie", ingreso: 18000 },
    { dia: "Sáb", ingreso: 20000 },
    { dia: "Dom", ingreso: 17000 },
  ];

  // 🧠 OBTENER TURNO ACTUAL SEGÚN HORA
  const getTurnoActual = () => {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 14) return "Matutino";
    if (hora >= 14 && hora < 22) return "Vespertino";
    return "Nocturno";
  };

  const turnoActual = getTurnoActual();

  // ✅ ESTADO REAL SECUENCIAL
  const turnosEstado = [
    {
      nombre: "Matutino",
      estado:
        turnoActual === "Matutino"
          ? "Activo"
          : ["Vespertino", "Nocturno"].includes(turnoActual)
          ? "Finalizado"
          : "Pendiente",
      valor: 1,
    },
    {
      nombre: "Vespertino",
      estado:
        turnoActual === "Vespertino"
          ? "Activo"
          : turnoActual === "Nocturno"
          ? "Finalizado"
          : "Pendiente",
      valor: 1,
    },
    {
      nombre: "Nocturno",
      estado: turnoActual === "Nocturno" ? "Activo" : "Pendiente",
      valor: 1,
    },
  ];

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h1>Dashboard</h1>
        <span>Bienvenido, Administrador</span>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Turnos Hoy</h3>
          <p>3</p>
        </div>

        <div className="card">
          <h3>Turno Actual</h3>
          <p>{turnoActual}</p>
        </div>

        <div className="card">
          <h3>Ingresos Hoy</h3>
          <p>$18,500</p>
        </div>

        <div className="card">
          <h3>Incidencias</h3>
          <p>1</p>
        </div>
      </div>

      {/* GRÁFICAS */}
      <div className="charts">

        {/* INGRESOS */}
        <div className="chart-card">
          <h3>Ingresos por semana</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ingresosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ingreso"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TURNOS SECUENCIALES */}
        <div className="chart-card">
          <h3>Estado de turnos (Tiempo real)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={turnosEstado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis hide />
              <Tooltip />

              <Bar dataKey="valor">
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

          {/* LEYENDA */}
          <div className="legend">
            <span className="dot green"></span> Activo
            <span className="dot blue"></span> Finalizado
            <span className="dot yellow"></span> Pendiente
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;