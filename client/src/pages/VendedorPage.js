import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VendedorPage.css";

const VendedorPage = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate();
  const usuario = localStorage.getItem("usuario"); // 👈 Vendedor logueado

useEffect(() => {
  const vendedor = localStorage.getItem("usuario");
  if (!vendedor) return;

  fetch(`http://localhost:5000/api/vehiculos/vendedor/${vendedor}`)
    .then((res) => res.json())
    .then((data) => setVehiculos(data))
    .catch((err) => console.error("Error al cargar vehículos del vendedor:", err));
}, []);


  return (
    <div className="vendedor-container">
      <header className="vendedor-header">
        <h1>Mis vehículos publicados</h1>
        <button className="btn-publicar" onClick={() => navigate("/publicar")}>
          + Publicar nuevo
        </button>
      </header>

      <div className="vehiculos-grid">
        {vehiculos.length > 0 ? (
          vehiculos.map((auto) => (
            <div key={auto.id} className="vehiculo-card">
              <img
                src={auto.imagen || "https://via.placeholder.com/250x150"}
                alt={auto.modelo}
              />
              <h3>
                {auto.marca} {auto.modelo}
              </h3>
              <p><strong>Año:</strong> {auto.año}</p>
              <p><strong>Precio base:</strong> ${auto.precio_base}</p>
              <p><strong>Descripción:</strong> {auto.descripcion}</p>
              <p><strong>Publicado:</strong> {new Date(auto.fecha_publicacion).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="sin-vehiculos">Aún no has publicado vehículos.</p>
        )}
      </div>
    </div>
  );
};

export default VendedorPage;
