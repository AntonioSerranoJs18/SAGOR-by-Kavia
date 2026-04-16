import { useState, useEffect } from "react";
import "./cortes.css";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaTrash,
  FaSearch,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaWater,
  FaWallet,
  FaUniversity,
  FaReceipt,
  FaHotel,
  FaChartLine,
  FaMoon,
  FaSun,
  FaCloudSun
} from "react-icons/fa";

export default function CorteDetalle() {
  // 📅 FUNCIONES PARA GENERAR FECHAS
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const hace2Dias = new Date(hoy);
  hace2Dias.setDate(hoy.getDate() - 2);
  const hace3Dias = new Date(hoy);
  hace3Dias.setDate(hoy.getDate() - 3);
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const formatFecha = (date) => date.toISOString().split('T')[0];
  const formatFechaLegible = (date) => {
    return date.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 📊 DATOS COMPLETOS DE TODOS LOS TURNOS
  const [allData, setAllData] = useState([
    // CRISTIAN - MATUTINO
    {
      id: 1,
      nombre: "Cristian",
      turno: "Matutino",
      fecha: formatFecha(hace3Dias),
      fechaFormateada: formatFechaLegible(hace3Dias),
      efectivo: { billetes: { 500: 3, 200: 2, 100: 5, 50: 4, 20: 8, 10: 3, 5: 2 }, total: 2840 },
      tarjetas: [
        { tipo: "VISA", ultimos: "4512", monto: 3250.00 },
        { tipo: "MASTERCARD", ultimos: "7823", monto: 2140.50 },
        { tipo: "AMEX", ultimos: "3456", monto: 1890.00 },
      ],
      gastos: [{ concepto: "Luz", monto: 450 }, { concepto: "Internet", monto: 380 }],
      bancos: 7280.50,
    },
    {
      id: 2,
      nombre: "Cristian",
      turno: "Matutino",
      fecha: formatFecha(hace2Dias),
      fechaFormateada: formatFechaLegible(hace2Dias),
      efectivo: { billetes: { 500: 2, 200: 1, 100: 8, 50: 3, 20: 5 }, total: 2150 },
      tarjetas: [
        { tipo: "VISA", ultimos: "4512", monto: 4120.00 },
        { tipo: "MASTERCARD", ultimos: "7823", monto: 1850.00 },
      ],
      gastos: [{ concepto: "Mantenimiento", monto: 620 }],
      bancos: 5970.00,
    },
    {
      id: 3,
      nombre: "Cristian",
      turno: "Matutino",
      fecha: formatFecha(ayer),
      fechaFormateada: formatFechaLegible(ayer),
      efectivo: { billetes: { 500: 1, 200: 3, 100: 6, 50: 2, 20: 4, 10: 2 }, total: 1720 },
      tarjetas: [
        { tipo: "VISA", ultimos: "4512", monto: 2890.00 },
        { tipo: "AMEX", ultimos: "3456", monto: 1560.00 },
      ],
      gastos: [{ concepto: "Agua", monto: 350 }],
      bancos: 4450.00,
    },
    {
      id: 4,
      nombre: "Cristian",
      turno: "Matutino",
      fecha: formatFecha(hoy),
      fechaFormateada: formatFechaLegible(hoy),
      efectivo: { billetes: { 500: 2, 100: 4, 50: 1, 20: 6, 10: 3, 5: 3, 2: 1, 1: 1 }, total: 1188 },
      tarjetas: [{ tipo: "TCAMEX", ultimos: "9001", monto: 2285.64 }],
      gastos: [],
      bancos: 2285.64,
    },

    // EVELYN - VESPERTINO
    {
      id: 5,
      nombre: "Evelyn",
      turno: "Vespertino",
      fecha: formatFecha(hace3Dias),
      fechaFormateada: formatFechaLegible(hace3Dias),
      efectivo: { billetes: { 500: 1, 200: 2, 100: 5, 50: 3, 20: 7 }, total: 2010 },
      tarjetas: [
        { tipo: "VISA", ultimos: "8945", monto: 3450.00 },
        { tipo: "MASTERCARD", ultimos: "2317", monto: 2780.00 },
      ],
      gastos: [{ concepto: "Luz", monto: 420 }],
      bancos: 6230.00,
    },
    {
      id: 6,
      nombre: "Evelyn",
      turno: "Vespertino",
      fecha: formatFecha(hace2Dias),
      fechaFormateada: formatFechaLegible(hace2Dias),
      efectivo: { billetes: { 200: 1, 100: 8, 50: 2, 20: 5 }, total: 1500 },
      tarjetas: [
        { tipo: "AMEX", ultimos: "6789", monto: 4120.00 },
        { tipo: "VISA", ultimos: "8945", monto: 1890.00 },
      ],
      gastos: [{ concepto: "Internet", monto: 380 }],
      bancos: 6010.00,
    },
    {
      id: 7,
      nombre: "Evelyn",
      turno: "Vespertino",
      fecha: formatFecha(ayer),
      fechaFormateada: formatFechaLegible(ayer),
      efectivo: { billetes: { 100: 3, 50: 2, 20: 4, 10: 1 }, total: 530 },
      tarjetas: [
        { tipo: "TDV", ultimos: "5027", monto: 4674.75 },
        { tipo: "TDM", ultimos: "3895", monto: 2326.00 },
      ],
      gastos: [{ concepto: "Agua", monto: 350 }],
      bancos: 7000.75,
    },
    {
      id: 8,
      nombre: "Evelyn",
      turno: "Vespertino",
      fecha: formatFecha(hoy),
      fechaFormateada: formatFechaLegible(hoy),
      efectivo: { billetes: { 50: 1 }, total: 52 },
      tarjetas: [
        { tipo: "TCV", ultimos: "5912", monto: 5075.92 },
        { tipo: "TDV", ultimos: "5027", monto: 4674.75 },
        { tipo: "TDM", ultimos: "3895", monto: 2326.00 },
        { tipo: "TCM", ultimos: "9804", monto: 1825.26 },
        { tipo: "TV", ultimos: "4463", monto: 1163.00 },
        { tipo: "TV", ultimos: "0882", monto: 1163.00 },
        { tipo: "TDV", ultimos: "3299", monto: 3489.02 },
      ],
      gastos: [{ concepto: "Agua", monto: 1215 }],
      bancos: 19716.95,
    },

    // JAVIER - NOCTURNO
    {
      id: 9,
      nombre: "Javier",
      turno: "Nocturno",
      fecha: formatFecha(hace3Dias),
      fechaFormateada: formatFechaLegible(hace3Dias),
      efectivo: { billetes: { 500: 1, 200: 1, 100: 4, 50: 2, 20: 3 }, total: 1310 },
      tarjetas: [{ tipo: "VISA", ultimos: "1122", monto: 2340.00 }],
      gastos: [{ concepto: "Seguridad", monto: 250 }],
      bancos: 2340.00,
    },
    {
      id: 10,
      nombre: "Javier",
      turno: "Nocturno",
      fecha: formatFecha(hace2Dias),
      fechaFormateada: formatFechaLegible(hace2Dias),
      efectivo: { billetes: { 500: 2, 100: 6, 50: 4 }, total: 1800 },
      tarjetas: [
        { tipo: "MASTERCARD", ultimos: "4455", monto: 3560.00 },
        { tipo: "AMEX", ultimos: "7788", monto: 1240.00 },
      ],
      gastos: [{ concepto: "Mantenimiento", monto: 450 }],
      bancos: 4800.00,
    },
    {
      id: 11,
      nombre: "Javier",
      turno: "Nocturno",
      fecha: formatFecha(ayer),
      fechaFormateada: formatFechaLegible(ayer),
      efectivo: { billetes: { 500: 1, 100: 3, 50: 1, 20: 2 }, total: 840 },
      tarjetas: [{ tipo: "VISA", ultimos: "1122", monto: 1890.00 }],
      gastos: [],
      bancos: 1890.00,
    },
    {
      id: 12,
      nombre: "Javier",
      turno: "Nocturno",
      fecha: formatFecha(hoy),
      fechaFormateada: formatFechaLegible(hoy),
      efectivo: { billetes: { 200: 2, 100: 5, 50: 3, 20: 8 }, total: 1610 },
      tarjetas: [
        { tipo: "VISA", ultimos: "1122", monto: 3450.00 },
        { tipo: "MASTERCARD", ultimos: "4455", monto: 2780.00 },
      ],
      gastos: [{ concepto: "Luz", monto: 320 }],
      bancos: 6230.00,
    },
    {
      id: 13,
      nombre: "Javier",
      turno: "Nocturno",
      fecha: formatFecha(manana),
      fechaFormateada: formatFechaLegible(manana),
      efectivo: { billetes: { 500: 1, 100: 2, 50: 1 }, total: 750 },
      tarjetas: [{ tipo: "AMEX", ultimos: "7788", monto: 2150.00 }],
      gastos: [],
      bancos: 2150.00,
    },
  ]);

  // 🔍 ESTADO DE FILTROS - SOLO UN SISTEMA DE FILTRADO
  const [filtros, setFiltros] = useState({
    nombre: "",
    turno: "",
    fecha: "",
  });
  
  const [dataFiltrada, setDataFiltrada] = useState([]);
  const [corteSeleccionado, setCorteSeleccionado] = useState(null);

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  // 🔄 APLICAR FILTROS - UNICO SISTEMA
  const aplicarFiltros = () => {
    let filtrados = [...allData];
    
    if (filtros.nombre) {
      filtrados = filtrados.filter(item => 
        item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      );
    }
    
    if (filtros.turno) {
      filtrados = filtrados.filter(item => item.turno === filtros.turno);
    }
    
    if (filtros.fecha) {
      filtrados = filtrados.filter(item => item.fecha === filtros.fecha);
    }
    
    setDataFiltrada(filtrados);
    
    // Seleccionar el primer resultado automáticamente
    if (filtrados.length > 0) {
      setCorteSeleccionado(filtrados[0]);
    } else {
      setCorteSeleccionado(null);
    }
  };

  // 🧹 LIMPIAR FILTROS
  const limpiarFiltros = () => {
    setFiltros({ nombre: "", turno: "", fecha: "" });
    setDataFiltrada(allData);
    if (allData.length > 0) {
      setCorteSeleccionado(allData[0]);
    }
  };

  // 📈 CALCULAR AGREGADOS
  const calcularTotales = (corte) => {
    if (!corte) return null;
    
    const totalTarjetas = corte.tarjetas.reduce((sum, t) => sum + t.monto, 0);
    const totalGastos = corte.gastos.reduce((sum, g) => sum + g.monto, 0);
    const totalGeneral = corte.efectivo.total + totalTarjetas - totalGastos;
    
    return {
      efectivo: corte.efectivo.total,
      bancos: corte.bancos,
      gastos: totalGastos,
      total: totalGeneral,
      billetes: corte.efectivo.billetes,
      tarjetas: corte.tarjetas,
      gastosList: corte.gastos,
      nombre: corte.nombre,
      turno: corte.turno,
      fecha: corte.fechaFormateada,
    };
  };

  // 🚀 INICIALIZAR
  useEffect(() => {
    setDataFiltrada(allData);
    if (allData.length > 0) {
      setCorteSeleccionado(allData[0]);
    }
  }, []);

  const totales = calcularTotales(corteSeleccionado);

  // Preparar datos para gráficas
  const prepararDatosGraficas = () => {
    if (!corteSeleccionado) return [];
    const totalTarjetas = corteSeleccionado.tarjetas.reduce((sum, t) => sum + t.monto, 0);
    return [
      { name: "Efectivo", value: corteSeleccionado.efectivo.total },
      { name: "Tarjetas", value: totalTarjetas },
      { name: "Transferencias", value: 0 },
    ];
  };

  const datosGrafica = prepararDatosGraficas();

  const formatter = (value) => `$${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Opciones únicas para filtros
  const nombresUnicos = [...new Set(allData.map(d => d.nombre))];
  const turnosUnicos = [...new Set(allData.map(d => d.turno))];
  const fechasUnicas = [...new Set(allData.map(d => d.fecha))];

  const billetesFiltrados = (billetes) => Object.fromEntries(Object.entries(billetes).filter(([_, cantidad]) => cantidad > 0));

  const getTurnoIcon = (turno) => {
    switch(turno) {
      case "Matutino": return <FaSun />;
      case "Vespertino": return <FaCloudSun />;
      case "Nocturno": return <FaMoon />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="corte-wrapper">
      {/* HEADER */}
      <div className="header">
        <h2><FaHotel /> HOTEL CHARIOT - REPORTE DE INGRESOS POR TURNO</h2>
        <div className="header-subtitle">Sistema de Gestión de Cortes de Caja</div>
      </div>

      {/* 🔍 PANEL DE FILTROS - UNICO */}
      <div className="filtros-container">
        <div className="filtros-grid">
          <div className="filtro-group">
            <label><FaUser /> Cajero</label>
            <select 
              value={filtros.nombre} 
              onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
            >
              <option value="">Todos</option>
              {nombresUnicos.map(nombre => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
          </div>
          <div className="filtro-group">
            <label><FaClock /> Turno</label>
            <select 
              value={filtros.turno} 
              onChange={(e) => setFiltros({ ...filtros, turno: e.target.value })}
            >
              <option value="">Todos</option>
              {turnosUnicos.map(turno => (
                <option key={turno} value={turno}>{turno}</option>
              ))}
            </select>
          </div>
          <div className="filtro-group">
            <label><FaCalendarAlt /> Fecha</label>
            <input 
              type="date" 
              value={filtros.fecha} 
              onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
            />
          </div>
        </div>
        <div className="filtros-actions">
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            <FaTrash /> Limpiar
          </button>
          <button className="btn-filtrar" onClick={aplicarFiltros}>
            <FaSearch /> Filtrar
          </button>
        </div>
      </div>

      {/* RESULTADOS Y SELECTOR DE CORTES */}
      {dataFiltrada.length > 0 && (
        <>
          {/* Selector de cortes - Solo aparece cuando hay múltiples resultados */}
          {dataFiltrada.length > 1 && (
            <div className="selector-cortes">
              <label>📋 Seleccionar corte:</label>
              <select 
                onChange={(e) => setCorteSeleccionado(dataFiltrada.find(c => c.id === parseInt(e.target.value)))}
                value={corteSeleccionado?.id || ""}
              >
                {dataFiltrada.map(corte => (
                  <option key={corte.id} value={corte.id}>
                    {corte.nombre} - {corte.turno} - {corte.fechaFormateada}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* INFO DEL CORTE ACTUAL */}
          {corteSeleccionado && (
            <div className="info-corte-actual">
              <div className="info-card">
                <FaUser />
                <div>
                  <small>Cajero</small>
                  <strong>{corteSeleccionado.nombre}</strong>
                </div>
              </div>
              <div className="info-card">
                {getTurnoIcon(corteSeleccionado.turno)}
                <div>
                  <small>Turno</small>
                  <strong>{corteSeleccionado.turno}</strong>
                </div>
              </div>
              <div className="info-card">
                <FaCalendarAlt />
                <div>
                  <small>Fecha</small>
                  <strong>{corteSeleccionado.fechaFormateada}</strong>
                </div>
              </div>
            </div>
          )}

          {/* GRÁFICAS */}
          {totales && (
            <>
              <div className="charts">
                <div className="chart-box">
                  <h3><FaChartLine /> Ingresos por tipo</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={datosGrafica}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(value) => formatter(value)} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-box">
                  <h3><FaChartPie /> Distribución</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie 
                        data={datosGrafica} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={90} 
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosGrafica.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatter(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TABLA DE DETALLE */}
              <div className="top-grid">
                <div className="section">
                  <h3><FaMoneyBillWave /> Efectivo</h3>
                  <table>
                    <tbody>
                      {Object.entries(billetesFiltrados(totales.billetes)).map(([denominacion, cantidad]) => (
                        <tr key={denominacion}>
                          <td>${parseFloat(denominacion).toLocaleString("es-MX")}</td>
                          <td>{cantidad}</td>
                          <td>${(parseFloat(denominacion) * cantidad).toLocaleString("es-MX")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="total-efectivo">
                    <strong>Total Efectivo:</strong> {formatter(totales.efectivo)}
                  </div>
                </div>

                <div className="section">
                  <h3><FaCreditCard /> Tarjetas</h3>
                  <ul>
                    {totales.tarjetas.map((tarjeta, idx) => (
                      <li key={idx}>
                        <span>{tarjeta.tipo}/****{tarjeta.ultimos}</span>
                        <strong>{formatter(tarjeta.monto)}</strong>
                      </li>
                    ))}
                  </ul>
                  <div className="total-tarjetas">
                    <strong>Total Tarjetas:</strong> {formatter(totales.tarjetas.reduce((sum, t) => sum + t.monto, 0))}
                  </div>
                </div>

                <div className="section">
                  <h3><FaReceipt /> Gastos</h3>
                  {totales.gastosList.length > 0 ? (
                    totales.gastosList.map((gasto, idx) => (
                      <p key={idx}>
                        <span><FaWater /> {gasto.concepto}</span>
                        <strong>{formatter(gasto.monto)}</strong>
                      </p>
                    ))
                  ) : (
                    <p className="sin-gastos">Sin gastos registrados</p>
                  )}
                  <div className="total-gastos">
                    <strong>Total Gastos:</strong> {formatter(totales.gastos)}
                  </div>
                </div>
              </div>

              {/* TOTALES FINALES */}
              <div className="totales">
                <div className="total-item">
                  <FaMoneyBillWave />
                  <span>Efectivo:</span>
                  <span>{formatter(totales.efectivo)}</span>
                </div>
                <div className="total-item">
                  <FaCreditCard />
                  <span>Tarjetas:</span>
                  <span>{formatter(totales.tarjetas.reduce((sum, t) => sum + t.monto, 0))}</span>
                </div>
                <div className="total-item">
                  <FaUniversity />
                  <span>Bancos:</span>
                  <span>{formatter(totales.bancos)}</span>
                </div>
                <div className="total-item">
                  <FaReceipt />
                  <span>Gastos:</span>
                  <span className="gasto">{formatter(totales.gastos)}</span>
                </div>
                <div className="total-grande">
                  <FaWallet />
                  <span>Total Neto:</span>
                  <span>{formatter(totales.total)}</span>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* MENSAJE SIN RESULTADOS */}
      {dataFiltrada.length === 0 && (
        <div className="section" style={{ textAlign: "center", padding: "60px" }}>
          <FaSearch size={48} color="#94a3b8" />
          <h3>No se encontraron resultados</h3>
          <p>Intenta con otros filtros</p>
        </div>
      )}
    </div>
  );
}