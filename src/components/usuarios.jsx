import React, { useState, useEffect } from "react";
import "./usuarios.css";
import { 
  FaUser, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSave,
  FaTimes,
  FaUserShield,
  FaUserClock,
  FaSun,
  FaMoon,
  FaCloudSun,
  FaEnvelope,
  FaPhone,
  FaKey,
  FaHotel,
  FaUsers
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Usuarios = () => {
  // Estado para la lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [turnoFilter, setTurnoFilter] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    turno: "Matutino",
    password: "",
    confirmPassword: "",
  });

  // Usuarios por defecto con fechas en febrero 2026 y emails correctos
  const getDefaultUsers = () => {
    // Febrero 2026 tiene 28 días
    const getFechaFebrero = (dia) => {
      const fecha = new Date(2026, 1, dia); // Mes 1 = Febrero
      return fecha.toISOString();
    };

    return [
      { 
        id: 1, 
        nombre: "Cristian", 
        email: "cristian@hotelchariot.com", 
        telefono: "555-0101",
        turno: "Matutino", 
        password: "123456",
        rol: "cajero",
        fechaRegistro: getFechaFebrero(1) // 1 de febrero de 2026
      },
      { 
        id: 2, 
        nombre: "Evelyn", 
        email: "evelyn@hotelchariot.com", 
        telefono: "555-0102",
        turno: "Vespertino", 
        password: "123456",
        rol: "cajero",
        fechaRegistro: getFechaFebrero(5) // 5 de febrero de 2026
      },
      { 
        id: 3, 
        nombre: "Javier", 
        email: "javier@hotelchariot.com", 
        telefono: "555-0103",
        turno: "Nocturno", 
        password: "123456",
        rol: "cajero",
        fechaRegistro: getFechaFebrero(10) // 10 de febrero de 2026
      },
      { 
        id: 4, 
        nombre: "Administrador", 
        email: "admin@hotelchariot.com", 
        telefono: "555-0000",
        turno: "Administrador", 
        password: "admin123",
        rol: "admin",
        fechaRegistro: getFechaFebrero(15) // 15 de febrero de 2026
      },
    ];
  };

  // Cargar usuarios desde localStorage al iniciar
  useEffect(() => {
    const storedUsers = localStorage.getItem("usuarios");
    const defaultUsers = getDefaultUsers();
    
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      // Verificar si los usuarios guardados tienen las fechas correctas
      // Si el primer usuario tiene fecha de hoy, reemplazar con las de febrero
      const primerUsuario = parsedUsers[0];
      if (primerUsuario && primerUsuario.fechaRegistro) {
        const fechaRegistro = new Date(primerUsuario.fechaRegistro);
        const hoy = new Date();
        const esFechaDeHoy = fechaRegistro.toDateString() === hoy.toDateString();
        
        if (esFechaDeHoy) {
          // Si las fechas son de hoy, usar las de febrero
          setUsuarios(defaultUsers);
          localStorage.setItem("usuarios", JSON.stringify(defaultUsers));
        } else {
          setUsuarios(parsedUsers);
        }
      } else {
        setUsuarios(parsedUsers);
      }
    } else {
      setUsuarios(defaultUsers);
      localStorage.setItem("usuarios", JSON.stringify(defaultUsers));
    }
  }, []);

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    if (usuarios.length > 0) {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
  }, [usuarios]);

  // Filtrar usuarios
  const filteredUsers = usuarios.filter(user => {
    return (
      user.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (turnoFilter === "Todos" || user.turno === turnoFilter)
    );
  });

  // Obtener icono del turno
  const getTurnoIcon = (turno) => {
    switch(turno) {
      case "Matutino": return <FaSun />;
      case "Vespertino": return <FaCloudSun />;
      case "Nocturno": return <FaMoon />;
      default: return <FaUserClock />;
    }
  };

  // Obtener color del turno
  const getTurnoColor = (turno) => {
    switch(turno) {
      case "Matutino": return "#f59e0b";
      case "Vespertino": return "#3b82f6";
      case "Nocturno": return "#8b5cf6";
      default: return "#64748b";
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      turno: "Matutino",
      password: "",
      confirmPassword: "",
    });
    setEditingUser(null);
  };

  // Abrir modal para nuevo usuario
  const handleNewUser = () => {
    resetForm();
    setShowModal(true);
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono || "",
      turno: user.turno,
      password: "",
      confirmPassword: "",
    });
    setShowModal(true);
  };

  // Eliminar usuario
  const handleDeleteUser = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      const updatedUsers = usuarios.filter(u => u.id !== id);
      setUsuarios(updatedUsers);
    }
  };

  // Guardar usuario (crear o editar)
  const handleSaveUser = () => {
    // Validaciones
    if (!formData.nombre.trim()) {
      alert("❌ El nombre es requerido");
      return;
    }
    if (!formData.email.trim()) {
      alert("❌ El email es requerido");
      return;
    }
    // Validar email único
    const emailExists = usuarios.some(u => 
      u.email === formData.email && u.id !== editingUser?.id
    );
    if (emailExists) {
      alert("❌ Ya existe un usuario con este email");
      return;
    }
    
    // Validar contraseña solo para nuevos usuarios o si se cambia
    if (!editingUser && !formData.password) {
      alert("❌ La contraseña es requerida para nuevos usuarios");
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    if (editingUser) {
      // Editar usuario existente
      const updatedUsers = usuarios.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            turno: formData.turno,
            password: formData.password || u.password,
          };
        }
        return u;
      });
      setUsuarios(updatedUsers);
    } else {
      // Crear nuevo usuario con fecha de febrero 2026
      const getFechaFebreroActual = () => {
        // Usar una fecha fija en febrero 2026 para nuevos usuarios
        const fecha = new Date(2026, 1, 20); // 20 de febrero de 2026
        return fecha.toISOString();
      };
      
      const newUser = {
        id: Date.now(),
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        turno: formData.turno,
        password: formData.password,
        rol: "cajero",
        fechaRegistro: getFechaFebreroActual(),
      };
      setUsuarios([...usuarios, newUser]);
    }
    
    setShowModal(false);
    resetForm();
  };

  // Formatear fecha para mostrar
  const formatFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-MX", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Estadísticas
  const stats = {
    total: usuarios.length,
    matutino: usuarios.filter(u => u.turno === "Matutino").length,
    vespertino: usuarios.filter(u => u.turno === "Vespertino").length,
    nocturno: usuarios.filter(u => u.turno === "Nocturno").length,
  };

  return (
    <div className="usuarios-container">
      {/* HEADER */}
      <div className="usuarios-header">
        <h1>
          <FaUserShield /> Gestión de Usuarios
        </h1>
        <div className="header-subtitle">Administración de Cajeros por Turno</div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info">
            <h4>Total Usuarios</h4>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card matutino">
          <div className="stat-icon"><FaSun /></div>
          <div className="stat-info">
            <h4>Turno Matutino</h4>
            <p>{stats.matutino}</p>
          </div>
        </div>
        <div className="stat-card vespertino">
          <div className="stat-icon"><FaCloudSun /></div>
          <div className="stat-info">
            <h4>Turno Vespertino</h4>
            <p>{stats.vespertino}</p>
          </div>
        </div>
        <div className="stat-card nocturno">
          <div className="stat-icon"><FaMoon /></div>
          <div className="stat-info">
            <h4>Turno Nocturno</h4>
            <p>{stats.nocturno}</p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="usuarios-filtros">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="turno-filter"
          value={turnoFilter}
          onChange={(e) => setTurnoFilter(e.target.value)}
        >
          <option value="Todos">Todos los turnos</option>
          <option value="Matutino">🌅 Matutino</option>
          <option value="Vespertino">☀️ Vespertino</option>
          <option value="Nocturno">🌙 Nocturno</option>
        </select>

        <button className="btn-nuevo" onClick={handleNewUser}>
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="usuarios-tabla">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Turno</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: getTurnoColor(user.turno) }}>
                        {user.nombre.charAt(0)}
                      </div>
                      <div className="user-info">
                        <strong>{user.nombre}</strong>
                        <small>{user.rol === "admin" ? "Administrador" : "Cajero"}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.telefono || "—"}</td>
                  <td>
                    <span className="turno-badge" style={{ background: getTurnoColor(user.turno) + "20", color: getTurnoColor(user.turno) }}>
                      {getTurnoIcon(user.turno)} {user.turno}
                    </span>
                  </td>
                  <td>{formatFecha(user.fechaRegistro)}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-edit" onClick={() => handleEditUser(user)}>
                        <FaEdit /> Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  <FaUser size={48} />
                  <p>No hay usuarios registrados</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PARA CREAR/EDITAR USUARIO */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-usuario" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? "✏️ Editar Usuario" : "👤 Nuevo Usuario"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label><FaUser /> Nombre completo</label>
                <input
                  type="text"
                  placeholder="Ej: Cristian Rodríguez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label><FaEnvelope /> Correo electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@hotelchariot.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <small style={{ color: "#64748b", fontSize: "0.7rem" }}>
                  Formato: nombre@hotelchariot.com
                </small>
              </div>

              <div className="form-group">
                <label><FaPhone /> Teléfono (opcional)</label>
                <input
                  type="tel"
                  placeholder="555-0000"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label><FaUserClock /> Turno</label>
                <div className="turno-options">
                  <label className={`turno-option ${formData.turno === "Matutino" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="turno"
                      value="Matutino"
                      checked={formData.turno === "Matutino"}
                      onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                    />
                    <FaSun /> Matutino <small>06:00 - 14:00</small>
                  </label>
                  <label className={`turno-option ${formData.turno === "Vespertino" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="turno"
                      value="Vespertino"
                      checked={formData.turno === "Vespertino"}
                      onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                    />
                    <FaCloudSun /> Vespertino <small>14:00 - 22:00</small>
                  </label>
                  <label className={`turno-option ${formData.turno === "Nocturno" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="turno"
                      value="Nocturno"
                      checked={formData.turno === "Nocturno"}
                      onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                    />
                    <FaMoon /> Nocturno <small>22:00 - 06:00</small>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label><FaKey /> Contraseña</label>
                <input
                  type="password"
                  placeholder={editingUser ? "Dejar en blanco para mantener" : "********"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label><FaKey /> Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSaveUser}>
                <FaSave /> {editingUser ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;