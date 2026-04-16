import React, { useState, useEffect } from "react";
import "./turnos.css";
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaPlus,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaSun,
  FaMoon,
  FaCloudSun,
} from "react-icons/fa";
import { MdTimeline, MdPendingActions } from "react-icons/md";

const Turnos = () => {
  const [search, setSearch] = useState("");
  const [turnoFilter, setTurnoFilter] = useState("Todos");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingTurno, setEditingTurno] = useState(null);
  const [horaActual, setHoraActual] = useState(new Date());
  
  // 🕒 Función para obtener el turno actual según la hora
  const getTurnoActualPorHora = () => {
    const hora = horaActual.getHours();
    if (hora >= 6 && hora < 14) return "Matutino";
    if (hora >= 14 && hora < 22) return "Vespertino";
    return "Nocturno";
  };

  // 🎯 Función para determinar el estado del turno
  const getEstadoTurnoPorHora = (turnoNombre, fechaTurno) => {
    const hoy = new Date();
    const fechaTurnoDate = new Date(fechaTurno);
    
    hoy.setHours(0, 0, 0, 0);
    fechaTurnoDate.setHours(0, 0, 0, 0);
    
    // 📅 Si es una fecha FUTURA → Pendiente
    if (fechaTurnoDate > hoy) {
      return "Pendiente";
    }
    
    // 📅 Si es una fecha PASADA → Finalizado
    if (fechaTurnoDate < hoy) {
      return "Finalizado";
    }
    
    // 📅 Si es HOY, evaluar por horario
    const turnoActual = getTurnoActualPorHora();
    const turnosOrden = ["Matutino", "Vespertino", "Nocturno"];
    const indiceTurno = turnosOrden.indexOf(turnoNombre);
    const indiceActual = turnosOrden.indexOf(turnoActual);
    
    if (indiceTurno === indiceActual) return "Activo";
    if (indiceTurno < indiceActual) return "Finalizado";
    return "Pendiente";
  };

  // 📅 Función para obtener la fecha correcta del turno nocturno
  const getFechaParaTurno = (turno, fechaBase = null) => {
    const fecha = fechaBase ? new Date(fechaBase) : new Date();
    const hora = horaActual.getHours();
    
    // Para turno nocturno, si es antes de las 6am, la fecha es el día anterior
    if (turno === "Nocturno" && hora < 6) {
      fecha.setDate(fecha.getDate() - 1);
    }
    
    return fecha.toISOString().split('T')[0];
  };

  // 📅 Generar fechas correctas
  const hoy = new Date();
  const hoyStr = hoy.toISOString().split('T')[0];
  
  // Fecha para el nocturno activo (si es antes de 6am, es del día anterior)
  const fechaNocturnoActivo = getFechaParaTurno("Nocturno");
  
  const hace3Dias = new Date(hoy);
  hace3Dias.setDate(hoy.getDate() - 3);
  const hace3DiasStr = hace3Dias.toISOString().split('T')[0];
  
  const hace2Dias = new Date(hoy);
  hace2Dias.setDate(hoy.getDate() - 2);
  const hace2DiasStr = hace2Dias.toISOString().split('T')[0];
  
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const ayerStr = ayer.toISOString().split('T')[0];
  
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  const mananaStr = manana.toISOString().split('T')[0];

  const [turnosData, setTurnosData] = useState([
    // ========== CRISTIAN - TURNO MATUTINO ==========
    {
      id: 1,
      empleado: "Cristian",
      turno: "Matutino",
      horario: "06:00 - 14:00",
      fecha: hace3DiasStr,
      email: "cristian@hotelchariot.com",
      telefono: "555-0101",
    },
    {
      id: 2,
      empleado: "Cristian",
      turno: "Matutino",
      horario: "06:00 - 14:00",
      fecha: hace2DiasStr,
      email: "cristian@hotelchariot.com",
      telefono: "555-0101",
    },
    {
      id: 3,
      empleado: "Cristian",
      turno: "Matutino",
      horario: "06:00 - 14:00",
      fecha: ayerStr,
      email: "cristian@hotelchariot.com",
      telefono: "555-0101",
    },
    {
      id: 4,
      empleado: "Cristian",
      turno: "Matutino",
      horario: "06:00 - 14:00",
      fecha: hoyStr,
      email: "cristian@hotelchariot.com",
      telefono: "555-0101",
    },
    // ========== EVELYN - TURNO VESPERTINO ==========
    {
      id: 5,
      empleado: "Evelyn",
      turno: "Vespertino",
      horario: "14:00 - 22:00",
      fecha: hace3DiasStr,
      email: "evelyn@hotelchariot.com",
      telefono: "555-0102",
    },
    {
      id: 6,
      empleado: "Evelyn",
      turno: "Vespertino",
      horario: "14:00 - 22:00",
      fecha: hace2DiasStr,
      email: "evelyn@hotelchariot.com",
      telefono: "555-0102",
    },
    {
      id: 7,
      empleado: "Evelyn",
      turno: "Vespertino",
      horario: "14:00 - 22:00",
      fecha: ayerStr,
      email: "evelyn@hotelchariot.com",
      telefono: "555-0102",
    },
    {
      id: 8,
      empleado: "Evelyn",
      turno: "Vespertino",
      horario: "14:00 - 22:00",
      fecha: hoyStr,
      email: "evelyn@hotelchariot.com",
      telefono: "555-0102",
    },
    // ========== JAVIER - TURNO NOCTURNO ==========
    {
      id: 9,
      empleado: "Javier",
      turno: "Nocturno",
      horario: "22:00 - 06:00",
      fecha: hace3DiasStr,
      email: "javier@hotelchariot.com",
      telefono: "555-0103",
    },
    {
      id: 10,
      empleado: "Javier",
      turno: "Nocturno",
      horario: "22:00 - 06:00",
      fecha: hace2DiasStr,
      email: "javier@hotelchariot.com",
      telefono: "555-0103",
    },
    {
      id: 11,
      empleado: "Javier",
      turno: "Nocturno",
      horario: "22:00 - 06:00",
      fecha: ayerStr,
      email: "javier@hotelchariot.com",
      telefono: "555-0103",
    },
    {
      id: 12,
      empleado: "Javier",
      turno: "Nocturno",
      horario: "22:00 - 06:00",
      fecha: fechaNocturnoActivo,
      email: "javier@hotelchariot.com",
      telefono: "555-0103",
    },
    {
      id: 13,
      empleado: "Javier",
      turno: "Nocturno",
      horario: "22:00 - 06:00",
      fecha: mananaStr,
      email: "javier@hotelchariot.com",
      telefono: "555-0103",
    },
  ]);

  // 🔄 Actualizar estados de turnos según la hora actual
  const actualizarEstadosTurnos = () => {
    setTurnosData(prevData => 
      prevData.map(turno => ({
        ...turno,
        estado: getEstadoTurnoPorHora(turno.turno, turno.fecha)
      }))
    );
  };

  // ⏰ Actualizar cada minuto
  useEffect(() => {
    actualizarEstadosTurnos();
    
    const interval = setInterval(() => {
      setHoraActual(new Date());
      actualizarEstadosTurnos();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Ordenar turnos por fecha (más reciente primero) y luego por orden de turno
  const turnosOrdenados = [...turnosData].sort((a, b) => {
    // Primero ordenar por fecha (más reciente primero)
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    if (fechaA > fechaB) return -1;
    if (fechaA < fechaB) return 1;
    
    // Si misma fecha, ordenar por turno (Matutino → Vespertino → Nocturno)
    const ordenTurnos = { Matutino: 1, Vespertino: 2, Nocturno: 3 };
    return ordenTurnos[a.turno] - ordenTurnos[b.turno];
  });

  // Filtrar datos
  const filteredData = turnosOrdenados.filter((item) => {
    if (!item || !item.empleado) return false;
    
    return (
      item.empleado.toLowerCase().includes(search.toLowerCase()) &&
      (turnoFilter === "Todos" || item.turno === turnoFilter) &&
      (estadoFilter === "Todos" || item.estado === estadoFilter)
    );
  });

  // 📊 Estadísticas
  const stats = {
    total: turnosData.length,
    activos: turnosData.filter(t => t && t.estado === "Activo").length,
    finalizados: turnosData.filter(t => t && t.estado === "Finalizado").length,
    pendientes: turnosData.filter(t => t && t.estado === "Pendiente").length,
  };

  const getHorarioByTurno = (turno) => {
    const horarios = {
      Matutino: "06:00 - 14:00",
      Vespertino: "14:00 - 22:00",
      Nocturno: "22:00 - 06:00",
    };
    return horarios[turno] || "Horario no disponible";
  };

  const [nuevoTurno, setNuevoTurno] = useState({
    empleado: "",
    turno: "Matutino",
    horario: "06:00 - 14:00",
    fecha: hoyStr,
    email: "",
    telefono: "",
  });

  const handleSaveTurno = () => {
    // Ajustar fecha si es turno nocturno
    let fechaFinal = nuevoTurno.fecha;
    if (nuevoTurno.turno === "Nocturno") {
      const fechaObj = new Date(fechaFinal);
      fechaFinal = fechaObj.toISOString().split('T')[0];
    }
    
    const turnoToSave = {
      ...nuevoTurno,
      fecha: fechaFinal,
      estado: getEstadoTurnoPorHora(nuevoTurno.turno, fechaFinal)
    };
    
    if (editingTurno) {
      setTurnosData(turnosData.map(t => 
        t.id === editingTurno.id ? { ...turnoToSave, id: editingTurno.id } : t
      ));
    } else {
      const newId = Math.max(...turnosData.map(t => t.id), 0) + 1;
      setTurnosData([...turnosData, { ...turnoToSave, id: newId }]);
    }
    
    resetFormulario();
    setShowModal(false);
    setEditingTurno(null);
  };

  const handleDeleteTurno = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este turno?")) {
      setTurnosData(turnosData.filter(t => t.id !== id));
    }
  };

  const handleEditTurno = (turno) => {
    setEditingTurno(turno);
    setNuevoTurno({
      empleado: turno.empleado,
      turno: turno.turno,
      horario: turno.horario,
      fecha: turno.fecha,
      email: turno.email,
      telefono: turno.telefono,
    });
    setShowModal(true);
  };

  const resetFormulario = () => {
    setNuevoTurno({
      empleado: "",
      turno: "Matutino",
      horario: "06:00 - 14:00",
      fecha: hoyStr,
      email: "",
      telefono: "",
    });
  };

  const handleTurnoChange = (turno) => {
    setNuevoTurno({
      ...nuevoTurno,
      turno: turno,
      horario: getHorarioByTurno(turno),
    });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    
    const date = new Date(fecha);
    const hoyDate = new Date();
    const mananaDate = new Date(Date.now() + 86400000);
    const ayerDate = new Date(Date.now() - 86400000);
    
    hoyDate.setHours(0, 0, 0, 0);
    mananaDate.setHours(0, 0, 0, 0);
    ayerDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === hoyDate.getTime()) return "Hoy";
    if (date.getTime() === mananaDate.getTime()) return "Mañana";
    if (date.getTime() === ayerDate.getTime()) return "Ayer";
    
    return date.toLocaleDateString("es-MX");
  };

  const getTurnoIcon = (turno) => {
    switch(turno) {
      case "Matutino": return <FaSun />;
      case "Vespertino": return <FaCloudSun />;
      case "Nocturno": return <FaMoon />;
      default: return <FaClock />;
    }
  };

  const turnoActual = getTurnoActualPorHora();

  return (
    <div className="turnos">
      <div className="turnos-header">
        <h1>
          <FaClock /> Gestión de Turnos
        </h1>
        
        <div style={{
          background: "rgba(255,255,255,0.1)",
          padding: "8px 16px",
          borderRadius: "40px",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px",
          width: "fit-content"
        }}>
          <FaClock />
          <strong>Turno actual:</strong>
          <span style={{ color: "#22c55e" }}>
            {turnoActual} ({getHorarioByTurno(turnoActual)})
          </span>
          <small style={{ fontSize: "0.75rem", opacity: 0.8 }}>
            {horaActual.toLocaleTimeString("es-MX")}
          </small>
        </div>

        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 Buscar empleado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select onChange={(e) => setTurnoFilter(e.target.value)} value={turnoFilter}>
              <option>Todos los turnos</option>
              <option>Matutino</option>
              <option>Vespertino</option>
              <option>Nocturno</option>
            </select>
          </div>

          <div className="filter-group">
            <select onChange={(e) => setEstadoFilter(e.target.value)} value={estadoFilter}>
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Finalizado</option>
              <option>Pendiente</option>
            </select>
          </div>

          <button className="btn-clear" onClick={() => {
            setSearch("");
            setTurnoFilter("Todos");
            setEstadoFilter("Todos");
          }}>
            <FaTrash /> Limpiar
          </button>

          <button className="btn-clear" style={{ background: "#22c55e" }} onClick={() => {
            resetFormulario();
            setEditingTurno(null);
            setShowModal(true);
          }}>
            <FaPlus /> Nuevo Turno
          </button>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Turnos</h4>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-icon"><FaUsers /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Activos Ahora</h4>
            <p className="stat-number" style={{ color: "#22c55e" }}>{stats.activos}</p>
          </div>
          <div className="stat-icon" style={{ color: "#22c55e" }}><FaCheckCircle /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Finalizados</h4>
            <p className="stat-number" style={{ color: "#3b82f6" }}>{stats.finalizados}</p>
          </div>
          <div className="stat-icon" style={{ color: "#3b82f6" }}><MdTimeline /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Pendientes</h4>
            <p className="stat-number" style={{ color: "#f59e0b" }}>{stats.pendientes}</p>
          </div>
          <div className="stat-icon" style={{ color: "#f59e0b" }}><MdPendingActions /></div>
        </div>
      </div>

      {/* TABLA */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Turno</th>
              <th>Horario</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaUser style={{ color: "#64748b" }} />
                      <div>
                        <strong>{item.empleado}</strong>
                        <br />
                        <small style={{ color: "#64748b", fontSize: "0.75rem" }}>
                          {item.email || "Sin email"}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {getTurnoIcon(item.turno)} {item.turno}
                    </div>
                  </td>
                  <td>{item.horario}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FaCalendarAlt style={{ color: "#64748b" }} />
                      {formatFecha(item.fecha)}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${(item.estado || "pendiente").toLowerCase()}`}>
                      {item.estado === "Activo" && <FaCheckCircle size={12} />}
                      {item.estado === "Finalizado" && <MdTimeline size={12} />}
                      {item.estado === "Pendiente" && <FaSpinner size={12} />}
                      {item.estado || "Pendiente"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn-edit" onClick={() => handleEditTurno(item)}>
                        <FaEdit /> Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteTurno(item.id)}>
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  <FaSearch size={48} />
                  <p>No hay resultados con los filtros seleccionados</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTurno ? "Editar Turno" : "Nuevo Turno"}</h2>
            
            <input
              type="text"
              placeholder="Nombre del empleado"
              value={nuevoTurno.empleado}
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, empleado: e.target.value })}
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={nuevoTurno.email}
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, email: e.target.value })}
            />
            
            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoTurno.telefono}
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, telefono: e.target.value })}
            />
            
            <select 
              value={nuevoTurno.turno}
              onChange={(e) => handleTurnoChange(e.target.value)}
            >
              <option value="Matutino">🌅 Matutino (06:00 - 14:00)</option>
              <option value="Vespertino">☀️ Vespertino (14:00 - 22:00)</option>
              <option value="Nocturno">🌙 Nocturno (22:00 - 06:00)</option>
            </select>
            
            <input
              type="date"
              value={nuevoTurno.fecha}
              onChange={(e) => setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })}
            />
            
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSaveTurno}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;