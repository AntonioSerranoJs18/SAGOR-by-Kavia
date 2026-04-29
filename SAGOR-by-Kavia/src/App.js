import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/layout";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Turnos from "./components/turnos";
import Cortes from "./components/cortes";
import Usuarios from "./components/usuarios";
import Reportes from "./components/reportes";
import DashboardRecepcionista from "./components/recepcionista/DashboardRecepcionista";
import NuevoCorte from "./components/recepcionista/NuevoCorte";
import MisCortes from "./components/recepcionista/MisCortes";
import EditarCorte from "./components/recepcionista/EditarCorte";
import { getToken, getUsuario } from "./services/api";

// Componente propio para que getUsuario() se llame en cada render, no desde closure de App
const RootRedirect = () => {
  const token = getToken();
  const usuario = getUsuario();
  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to={usuario?.rol === 'cajero' ? "/mi-turno" : "/dashboard"} replace />;
};

const ProtectedRoute = ({ children, rolRequerido }) => {
  const token = getToken();
  const usuario = getUsuario();
  if (!token) return <Navigate to="/login" replace />;
  if (rolRequerido && usuario?.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Rutas del ADMIN */}
        <Route path="/dashboard" element={
          <ProtectedRoute rolRequerido="admin">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/turnos" element={
          <ProtectedRoute rolRequerido="admin">
            <Layout><Turnos /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/cortes" element={
          <ProtectedRoute rolRequerido="admin">
            <Layout><Cortes /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/usuarios" element={
          <ProtectedRoute rolRequerido="admin">
            <Layout><Usuarios /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/reportes" element={
          <ProtectedRoute rolRequerido="admin">
            <Layout><Reportes /></Layout>
          </ProtectedRoute>
        } />

        {/* Rutas del RECEPCIONISTA */}
        <Route path="/mi-turno" element={
          <ProtectedRoute rolRequerido="cajero">
            <Layout><DashboardRecepcionista /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/nuevo-corte" element={
          <ProtectedRoute rolRequerido="cajero">
            <Layout><NuevoCorte /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/mis-cortes" element={
          <ProtectedRoute rolRequerido="cajero">
            <Layout><MisCortes /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/editar-corte/:id" element={
          <ProtectedRoute rolRequerido="cajero">
            <Layout><EditarCorte /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
