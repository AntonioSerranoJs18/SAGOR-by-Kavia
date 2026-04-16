import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./cortes.css";

const dataInicial = [
  {
    fecha: "2026-04-10",
    usuario: "Juan Pérez",
    turno: "Matutino",
    ingresos: 8000,
    egresos: 1000,
    estado: "Revisado",
  },
  {
    fecha: "2026-04-10",
    usuario: "Ana López",
    turno: "Vespertino",
    ingresos: 10000,
    egresos: 2000,
    estado: "Revisado",
  },
  {
    fecha: "2026-04-10",
    usuario: "Luis Torres",
    turno: "Nocturno",
    ingresos: 7000,
    egresos: 2000,
    estado: "Pendiente",
  },
];

const Cortes = () => {
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
    turno: "",
    estado: "",
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const dataFiltrada = dataInicial.filter((item) => {
    return (
      (!filtros.desde || item.fecha >= filtros.desde) &&
      (!filtros.hasta || item.fecha <= filtros.hasta) &&
      (!filtros.turno || item.turno === filtros.turno) &&
      (!filtros.estado || item.estado === filtros.estado)
    );
  });

  // 📊 DATA PARA GRÁFICA (3 turnos reales)
  const graficaData = ["Matutino", "Vespertino", "Nocturno"].map((turno) => {
    const corte = dataFiltrada.find((i) => i.turno === turno);
    return {
      turno,
      ingresos: corte ? corte.ingresos : 0,
      egresos: corte ? corte.egresos : 0,
    };
  });

  return (
    <div className="cortes">

      {/* HEADER */}
      <div className="cortes-header">
        <h1>Cortes de recepción</h1>

        <div className="actions">
          <input type="date" name="desde" onChange={handleChange} />
          <input type="date" name="hasta" onChange={handleChange} />

          <select name="turno" onChange={handleChange}>
            <option value="">Turno</option>
            <option>Matutino</option>
            <option>Vespertino</option>
            <option>Nocturno</option>
          </select>

          <select name="estado" onChange={handleChange}>
            <option value="">Estado</option>
            <option>Revisado</option>
            <option>Pendiente</option>
          </select>
        </div>
      </div>

      {/* 📊 GRAFICA */}
      <div className="chart-container">
        <h3>Ingresos vs Egresos por turno</h3>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={graficaData}>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            
            <XAxis dataKey="turno" stroke="#64748b" />
            <YAxis stroke="#64748b" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            />

            <Bar
              dataKey="ingresos"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="egresos"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLA */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Turno</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {dataFiltrada.map((item, index) => (
              <tr key={index}>
                <td>{item.fecha}</td>
                <td>{item.usuario}</td>
                <td>{item.turno}</td>
                <td>${item.ingresos}</td>
                <td>${item.egresos}</td>
                <td>${item.ingresos - item.egresos}</td>
                <td>
                  <span
                    className={`badge ${
                      item.estado === "Revisado" ? "ok" : "pending"
                    }`}
                  >
                    {item.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cortes;