import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { api, guardarSesion } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.post("/api/auth/login.php", { email, password });
      guardarSesion(data.usuario, data.usuario.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>

      <div className="login-box">
        <div className="header">
          <h1>SAGOR</h1>
          <p>Sistema de Administración y Gestión Operativa de Recepción</p>
          <span>Hotel Chariot Mérida by Kavia</span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {/* Usuario */}
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Correo electrónico</label>
          </div>

          {/* Contraseña */}
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Contraseña</label>
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn-login" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar al sistema"}
          </button>
        </form>

        <div className="footer">© 2026 SAGOR</div>
      </div>
    </div>
  );
};

export default Login;
