import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VendedorPage.css";

const VendedorPage = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate();

  // Cargar vehículos desde el backend
  useEffect(() => {
    fetch("http://localhost:5000/api/vehiculos")
      .then((res) => res.json())
      .then((data) => setVehiculos(data))
      .catch((err) => console.error("Error cargando vehículos:", err));
  }, []);

  return (
    <div className="vendedor-container">
      <header className="vendedor-header">
        <h1>Panel del Vendedor</h1>
        <button
          className="btn-publicar"
          onClick={() => navigate("/publicar")}
        >
          + Publicar vehículo
        </button>
      </header>

      <div className="vehiculos-grid">
        {vehiculos.map((auto) => (
          <div key={auto.id} className="vehiculo-card">
            <img src={auto.imagen} alt={auto.modelo} />
            <h3>{auto.marca} {auto.modelo}</h3>
            <p><strong>Año:</strong> {auto.año}</p>
            <p><strong>Precio:</strong> ${auto.precio_base}</p>
            <p><strong>Descripción:</strong> {auto.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendedorPage;
