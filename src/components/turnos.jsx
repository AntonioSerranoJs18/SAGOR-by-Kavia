import React, { useState } from "react";
import "./turnos.css";

const Turnos = () => {
  const [search, setSearch] = useState("");
  const [turnoFilter, setTurnoFilter] = useState("Todos");
  const [estadoFilter, setEstadoFilter] = useState("Todos");

  const data = [
    {
      empleado: "Juan Pérez",
      turno: "Matutino",
      horario: "06:00 - 14:00",
      fecha: "10/04/2026",
      estado: "Activo",
    },
    {
      empleado: "Ana López",
      turno: "Vespertino",
      horario: "14:00 - 22:00",
      fecha: "10/04/2026",
      estado: "Finalizado",
    },
    {
      empleado: "Luis Torres",
      turno: "Nocturno",
      horario: "22:00 - 06:00",
      fecha: "10/04/2026",
      estado: "Pendiente",
    },
  ];

  const filteredData = data.filter((item) => {
    return (
      item.empleado.toLowerCase().includes(search.toLowerCase()) &&
      (turnoFilter === "Todos" || item.turno === turnoFilter) &&
      (estadoFilter === "Todos" || item.estado === estadoFilter)
    );
  });

  return (
    <div className="turnos">
      
      {/* HEADER */}
      <div className="turnos-header">
        <h1>Gestión de Turnos</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar empleado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setTurnoFilter(e.target.value)}>
            <option>Todos</option>
            <option>Matutino</option>
            <option>Vespertino</option>
            <option>Nocturno</option>
          </select>

          <select onChange={(e) => setEstadoFilter(e.target.value)}>
            <option>Todos</option>
            <option>Activo</option>
            <option>Finalizado</option>
            <option>Pendiente</option>
          </select>

          <button className="btn-clear" onClick={() => {
            setSearch("");
            setTurnoFilter("Todos");
            setEstadoFilter("Todos");
          }}>
            Limpiar
          </button>
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
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.empleado}</td>
                  <td>{item.turno}</td>
                  <td>{item.horario}</td>
                  <td>{item.fecha}</td>
                  <td>
                    <span className={`badge ${item.estado.toLowerCase()}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit">Editar</button>
                    <button className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No hay resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Turnos;