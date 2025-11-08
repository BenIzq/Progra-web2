import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompradorPage from "./pages/CompradorPage";
import VendedorPage from "./pages/VendedorPage";
import PublicarVehiculo from "./pages/PublicarVehiculo";
import SubastaPage from "./pages/SubastaPage";
import HistorialSubastas from "./pages/HistorialSubastas"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/comprador" element={<CompradorPage />} />
        <Route path="/vendedor" element={<VendedorPage />} />
        <Route path="/publicar" element={<PublicarVehiculo />} />
        <Route path="/subasta/:id" element={<SubastaPage />} />
        <Route path="/historial" element={<HistorialSubastas />} /> 
      </Routes>
    </Router>
  );
}

export default App;