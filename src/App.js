import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layout/layout";

import Dashboard from "./components/dashboard";
import Turnos from "./components/turnos";
import Cortes from "./components/cortes";
//import Cuts from "./components/cuts";
//import Users from "./components/users";
//import Reports from "./components/reports";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/cortes" element={<Cortes />} />
          {/* 
          <Route path="/usuarios" element={<Users />} />
          <Route path="/reportes" element={<Reports />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;