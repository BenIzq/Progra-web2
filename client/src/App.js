import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompradorPage from "./pages/CompradorPage";
import VendedorPage from "./pages/VendedorPage";
import PublicarVehiculo from "./pages/PublicarVehiculo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/comprador" element={<CompradorPage />} />
        <Route path="/vendedor" element={<VendedorPage />} />
        <Route path="/publicar" element={<PublicarVehiculo />} />
      </Routes>
    </Router>
  );
}

export default App;