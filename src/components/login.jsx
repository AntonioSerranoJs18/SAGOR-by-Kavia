import React, { useState } from "react";
import "./login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="overlay"></div>

      <div className="login-box">
        <div className="header">
          <h1>SAGOR</h1>
          <p>Sistema de Administración y Gestión Operativa de Recepción</p>
          <span>Hotel Chariot Mérida by Kavia</span>
        </div>

        <form className="form">
          {/* Usuario */}
          <div className="input-box">
            <FaUser className="icon" />
            <input type="text" required />
            <label>Usuario</label>
          </div>

          {/* Contraseña */}
          <div className="input-box">
            <FaLock className="icon" />
            <input type={showPassword ? "text" : "password"} required />
            <label>Contraseña</label>

            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="btn-login">Ingresar al sistema</button>
        </form>

        <div className="footer">© 2026 SAGOR</div>
      </div>
    </div>
  );
};


export default Login;