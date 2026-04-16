import React, { useState, useEffect } from "react";
import "./reportes.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaUsers,
  FaHotel,
  FaDownload,
  FaSearch,
  FaTrash,
  FaSun,        // 👈 AGREGAR
  FaMoon,       // 👈 AGREGAR
  FaCloudSun,   // 👈 AGREGAR
} from "react-icons/fa";
import { MdTimeline, MdDateRange } from "react-icons/md";

const Reportes = () => {
  // Estado para filtros
  const [fechaInicio, setFechaInicio] = useState("2026-02-01");
  const [fechaFin, setFechaFin] = useState("2026-02-28");
  const [turnoFilter, setTurnoFilter] = useState("Todos");

  // 📊 DATOS REALES DE CORTES - Basados en las pantallas anteriores
  const [cortesData, setCortesData] = useState([
    // ========== FEBRERO 2026 ==========
    // Semana 1
    { id: 1, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-01", efectivo: 2840, tarjetas: 7280.50, gastos: 830, total: 9290.50, habitaciones: 5 },
    { id: 2, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-01", efectivo: 2010, tarjetas: 6230.00, gastos: 420, total: 7820.00, habitaciones: 4 },
    { id: 3, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-01", efectivo: 1310, tarjetas: 2340.00, gastos: 250, total: 3400.00, habitaciones: 2 },
    // Semana 2
    { id: 4, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-02", efectivo: 2150, tarjetas: 5970.00, gastos: 620, total: 7500.00, habitaciones: 4 },
    { id: 5, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-02", efectivo: 1500, tarjetas: 6010.00, gastos: 380, total: 7130.00, habitaciones: 3 },
    { id: 6, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-02", efectivo: 1800, tarjetas: 4800.00, gastos: 450, total: 6150.00, habitaciones: 3 },
    // Semana 3
    { id: 7, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-03", efectivo: 1720, tarjetas: 4450.00, gastos: 350, total: 5820.00, habitaciones: 3 },
    { id: 8, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-03", efectivo: 530, tarjetas: 7000.75, gastos: 350, total: 7180.75, habitaciones: 2 },
    { id: 9, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-03", efectivo: 840, tarjetas: 1890.00, gastos: 0, total: 2730.00, habitaciones: 1 },
    // Semana 4 - Datos del corte de Evelyn (Vespertino) con tarjetas
    { id: 10, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-04", efectivo: 1188, tarjetas: 2285.64, gastos: 0, total: 3473.64, habitaciones: 2 },
    { id: 11, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-04", efectivo: 52, tarjetas: 19716.95, gastos: 1215, total: 18553.95, habitaciones: 4 },
    { id: 12, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-04", efectivo: 1610, tarjetas: 6230.00, gastos: 320, total: 7520.00, habitaciones: 2 },
    // Más días de febrero
    { id: 13, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-05", efectivo: 2100, tarjetas: 5100.00, gastos: 450, total: 6750.00, habitaciones: 3 },
    { id: 14, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-05", efectivo: 1800, tarjetas: 6800.00, gastos: 300, total: 8300.00, habitaciones: 3 },
    { id: 15, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-05", efectivo: 950, tarjetas: 3100.00, gastos: 180, total: 3870.00, habitaciones: 2 },
    { id: 16, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-06", efectivo: 1950, tarjetas: 4850.00, gastos: 520, total: 6280.00, habitaciones: 3 },
    { id: 17, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-06", efectivo: 2200, tarjetas: 7200.00, gastos: 400, total: 9000.00, habitaciones: 4 },
    { id: 18, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-06", efectivo: 1100, tarjetas: 2800.00, gastos: 220, total: 3680.00, habitaciones: 2 },
    { id: 19, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-07", efectivo: 3100, tarjetas: 8200.00, gastos: 600, total: 10700.00, habitaciones: 5 },
    { id: 20, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-07", efectivo: 2800, tarjetas: 8900.00, gastos: 550, total: 11150.00, habitaciones: 5 },
    { id: 21, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-07", efectivo: 1450, tarjetas: 4100.00, gastos: 300, total: 5250.00, habitaciones: 3 },
    // Semana 5 - más días
    { id: 22, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-08", efectivo: 2300, tarjetas: 5600.00, gastos: 480, total: 7420.00, habitaciones: 4 },
    { id: 23, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-08", efectivo: 1900, tarjetas: 6500.00, gastos: 350, total: 8050.00, habitaciones: 3 },
    { id: 24, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-08", efectivo: 1200, tarjetas: 3200.00, gastos: 200, total: 4200.00, habitaciones: 2 },
    { id: 25, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-09", efectivo: 1750, tarjetas: 4350.00, gastos: 380, total: 5720.00, habitaciones: 3 },
    { id: 26, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-09", efectivo: 1600, tarjetas: 5900.00, gastos: 320, total: 7180.00, habitaciones: 3 },
    { id: 27, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-09", efectivo: 880, tarjetas: 2200.00, gastos: 150, total: 2930.00, habitaciones: 1 },
    { id: 28, nombre: "Cristian", turno: "Matutino", fecha: "2026-02-10", efectivo: 2650, tarjetas: 6800.00, gastos: 550, total: 8900.00, habitaciones: 4 },
    { id: 29, nombre: "Evelyn", turno: "Vespertino", fecha: "2026-02-10", efectivo: 2350, tarjetas: 7500.00, gastos: 480, total: 9370.00, habitaciones: 4 },
    { id: 30, nombre: "Javier", turno: "Nocturno", fecha: "2026-02-10", efectivo: 1550, tarjetas: 4300.00, gastos: 280, total: 5570.00, habitaciones: 3 },
  ]);

  // Filtrar datos por fecha y turno
  const filteredData = cortesData.filter(item => {
    const fechaItem = new Date(item.fecha);
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59);
    
    return (
      fechaItem >= inicio &&
      fechaItem <= fin &&
      (turnoFilter === "Todos" || item.turno === turnoFilter)
    );
  });

  // Calcular totales
  const totales = {
    efectivo: filteredData.reduce((sum, item) => sum + item.efectivo, 0),
    tarjetas: filteredData.reduce((sum, item) => sum + item.tarjetas, 0),
    gastos: filteredData.reduce((sum, item) => sum + item.gastos, 0),
    total: filteredData.reduce((sum, item) => sum + item.total, 0),
    habitaciones: filteredData.reduce((sum, item) => sum + item.habitaciones, 0),
    cortes: filteredData.length,
  };

  // Datos para gráfica de ingresos por día (agrupados)
  const ingresosPorDia = () => {
    const grouped = {};
    filteredData.forEach(item => {
      if (!grouped[item.fecha]) {
        grouped[item.fecha] = { fecha: item.fecha, efectivo: 0, tarjetas: 0, total: 0 };
      }
      grouped[item.fecha].efectivo += item.efectivo;
      grouped[item.fecha].tarjetas += item.tarjetas;
      grouped[item.fecha].total += item.total;
    });
    return Object.values(grouped).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  };

  // Datos para gráfica por turno
  const ingresosPorTurno = () => {
    const grouped = {
      Matutino: { efectivo: 0, tarjetas: 0, total: 0, cortes: 0 },
      Vespertino: { efectivo: 0, tarjetas: 0, total: 0, cortes: 0 },
      Nocturno: { efectivo: 0, tarjetas: 0, total: 0, cortes: 0 },
    };
    filteredData.forEach(item => {
      if (grouped[item.turno]) {
        grouped[item.turno].efectivo += item.efectivo;
        grouped[item.turno].tarjetas += item.tarjetas;
        grouped[item.turno].total += item.total;
        grouped[item.turno].cortes += 1;
      }
    });
    return Object.entries(grouped).map(([turno, data]) => ({
      turno,
      ...data,
    }));
  };

  // Datos para gráfica por cajero
  const ingresosPorCajero = () => {
    const grouped = {};
    filteredData.forEach(item => {
      if (!grouped[item.nombre]) {
        grouped[item.nombre] = { nombre: item.nombre, total: 0, efectivo: 0, tarjetas: 0, cortes: 0 };
      }
      grouped[item.nombre].total += item.total;
      grouped[item.nombre].efectivo += item.efectivo;
      grouped[item.nombre].tarjetas += item.tarjetas;
      grouped[item.nombre].cortes += 1;
    });
    return Object.values(grouped);
  };

  // Datos para gráfica de distribución
  const distribucionData = [
    { name: "Efectivo", value: totales.efectivo, color: "#22c55e" },
    { name: "Tarjetas", value: totales.tarjetas, color: "#3b82f6" },
    { name: "Gastos", value: totales.gastos, color: "#ef4444" },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

  const formatter = (value) => `$${value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Exportar a CSV (Excel)
  const exportToExcel = () => {
    const headers = ["Fecha", "Cajero", "Turno", "Efectivo", "Tarjetas", "Gastos", "Total", "Habitaciones"];
    const rows = filteredData.map(item => [
      formatFecha(item.fecha),
      item.nombre,
      item.turno,
      item.efectivo,
      item.tarjetas,
      item.gastos,
      item.total,
      item.habitaciones,
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `reporte_hotel_chariot_${fechaInicio}_${fechaFin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Imprimir reporte
  const handlePrint = () => {
    window.print();
  };

  const ingresosPorDiaData = ingresosPorDia();
  const ingresosPorTurnoData = ingresosPorTurno();
  const ingresosPorCajeroData = ingresosPorCajero();

  // Totales por turno para mostrar
  const totalMatutino = ingresosPorTurnoData.find(t => t.turno === "Matutino")?.total || 0;
  const totalVespertino = ingresosPorTurnoData.find(t => t.turno === "Vespertino")?.total || 0;
  const totalNocturno = ingresosPorTurnoData.find(t => t.turno === "Nocturno")?.total || 0;

  return (
    <div className="reportes-container">
      {/* HEADER */}
      <div className="reportes-header">
        <h1><FaChartLine /> Reportes y Estadísticas</h1>
        <p>Hotel Chariot - Análisis completo de ingresos por turno y período (Febrero 2026)</p>
      </div>

      {/* FILTROS */}
      <div className="filtros-reportes">
        <div className="filtro-group">
          <label><FaCalendarAlt /> Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="filtro-group">
          <label><FaCalendarAlt /> Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <div className="filtro-group">
          <label><FaUsers /> Turno</label>
          <select value={turnoFilter} onChange={(e) => setTurnoFilter(e.target.value)}>
            <option value="Todos">Todos los turnos</option>
            <option value="Matutino">🌅 Matutino (Cristian)</option>
            <option value="Vespertino">☀️ Vespertino (Evelyn)</option>
            <option value="Nocturno">🌙 Nocturno (Javier)</option>
          </select>
        </div>
        <div className="filtro-buttons">
          <button className="btn-excel" onClick={exportToExcel}>
            <FaFileExcel /> Exportar Excel
          </button>
          <button className="btn-print" onClick={handlePrint}>
            <FaPrint /> Imprimir
          </button>
        </div>
      </div>

      {/* TARJETAS DE RESÚMEN */}
      <div className="resumen-cards">
        <div className="resumen-card total">
          <div className="card-icon"><FaMoneyBillWave /></div>
          <div className="card-info">
            <h4>Ingresos Totales</h4>
            <p>{formatter(totales.total)}</p>
            <small>{filteredData.length} cortes analizados</small>
          </div>
        </div>
        <div className="resumen-card efectivo">
          <div className="card-icon"><FaMoneyBillWave /></div>
          <div className="card-info">
            <h4>Efectivo</h4>
            <p>{formatter(totales.efectivo)}</p>
            <small>{((totales.efectivo / (totales.total + totales.gastos)) * 100 || 0).toFixed(1)}% del total</small>
          </div>
        </div>
        <div className="resumen-card tarjetas">
          <div className="card-icon"><FaChartBar /></div>
          <div className="card-info">
            <h4>Tarjetas</h4>
            <p>{formatter(totales.tarjetas)}</p>
            <small>{((totales.tarjetas / (totales.total + totales.gastos)) * 100 || 0).toFixed(1)}% del total</small>
          </div>
        </div>
        <div className="resumen-card gastos">
          <div className="card-icon"><FaChartPie /></div>
          <div className="card-info">
            <h4>Gastos</h4>
            <p>{formatter(totales.gastos)}</p>
            <small>{((totales.gastos / (totales.total + totales.gastos)) * 100 || 0).toFixed(1)}% del total</small>
          </div>
        </div>
      </div>

      {/* TARJETAS POR TURNO */}
      <div className="turnos-resumen">
        <div className="turno-card matutino">
          <div className="turno-icon"><FaSun /></div>
          <div className="turno-info">
            <h4>Turno Matutino</h4>
            <p>{formatter(totalMatutino)}</p>
            <small>Cajero: Cristian</small>
          </div>
        </div>
        <div className="turno-card vespertino">
          <div className="turno-icon"><FaCloudSun /></div>
          <div className="turno-info">
            <h4>Turno Vespertino</h4>
            <p>{formatter(totalVespertino)}</p>
            <small>Cajero: Evelyn</small>
          </div>
        </div>
        <div className="turno-card nocturno">
          <div className="turno-icon"><FaMoon /></div>
          <div className="turno-info">
            <h4>Turno Nocturno</h4>
            <p>{formatter(totalNocturno)}</p>
            <small>Cajero: Javier</small>
          </div>
        </div>
      </div>

      {/* GRÁFICAS */}
      <div className="graficas-container">
        {/* Gráfica de ingresos por día */}
        <div className="grafica-card full-width">
          <h3><FaChartLine /> Ingresos por Día - Febrero 2026</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={ingresosPorDiaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fecha" tickFormatter={(date) => new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })} />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip formatter={(value) => formatter(value)} labelFormatter={(label) => formatFecha(label)} />
              <Legend />
              <Area type="monotone" dataKey="total" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Total" />
              <Area type="monotone" dataKey="efectivo" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} name="Efectivo" />
              <Area type="monotone" dataKey="tarjetas" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Tarjetas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica por turno */}
        <div className="grafica-card">
          <h3><FaChartBar /> Ingresos por Turno</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ingresosPorTurnoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="turno" />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip formatter={(value) => formatter(value)} />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Total" />
              <Bar dataKey="efectivo" fill="#22c55e" radius={[8, 8, 0, 0]} name="Efectivo" />
              <Bar dataKey="tarjetas" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Tarjetas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica por cajero */}
        <div className="grafica-card">
          <h3><FaUsers /> Ingresos por Cajero</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ingresosPorCajeroData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="nombre" />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip formatter={(value) => formatter(value)} />
              <Legend />
              <Bar dataKey="total" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Total" />
              <Bar dataKey="efectivo" fill="#22c55e" radius={[8, 8, 0, 0]} name="Efectivo" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de distribución */}
        <div className="grafica-card">
          <h3><FaChartPie /> Distribución de Ingresos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {distribucionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatter(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA DE DETALLE */}
      <div className="tabla-reportes">
        <h3><MdTimeline /> Detalle de Cortes - Febrero 2026</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cajero</th>
                <th>Turno</th>
                <th>Efectivo</th>
                <th>Tarjetas</th>
                <th>Gastos</th>
                <th>Total</th>
                <th>Habitaciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{formatFecha(item.fecha)}</td>
                    <td><strong>{item.nombre}</strong></td>
                    <td>
                      <span className={`turno-badge ${item.turno.toLowerCase()}`}>
                        {item.turno === "Matutino" && <FaSun />}
                        {item.turno === "Vespertino" && <FaCloudSun />}
                        {item.turno === "Nocturno" && <FaMoon />}
                        {item.turno}
                      </span>
                    </td>
                    <td className="text-success">{formatter(item.efectivo)}</td>
                    <td className="text-info">{formatter(item.tarjetas)}</td>
                    <td className="text-danger">{formatter(item.gastos)}</td>
                    <td className="text-primary">{formatter(item.total)}</td>
                    <td>{item.habitaciones}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    <FaSearch size={48} />
                    <p>No hay datos en el período seleccionado</p>
                    <small>Prueba con fechas entre febrero 2026</small>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="3"><strong>TOTALES GENERALES</strong></td>
                <td><strong>{formatter(totales.efectivo)}</strong></td>
                <td><strong>{formatter(totales.tarjetas)}</strong></td>
                <td><strong>{formatter(totales.gastos)}</strong></td>
                <td><strong>{formatter(totales.total)}</strong></td>
                <td><strong>{totales.habitaciones}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;