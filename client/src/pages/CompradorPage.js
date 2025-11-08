import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const CompradorPage = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate();

  // Obtenemos el nombre del comprador actual (guardado al iniciar sesión)
  const comprador = localStorage.getItem("usuario");

  // 🔹 Cargar todos los vehículos disponibles
  useEffect(() => {
    fetch("http://localhost:5000/api/vehiculos")
      .then((res) => res.json())
      .then((data) => setVehiculos(data))
      .catch((err) => console.error("Error al obtener vehículos:", err));
  }, []);

  // 🔔 Escuchar notificaciones de ganador desde el servidor
  useEffect(() => {
    if (!comprador) return;

    socket.on(`notificacionGanador_${comprador}`, (data) => {
      alert(data.mensaje); // Puedes reemplazar por un modal o toast
    });

    return () => {
      socket.off(`notificacionGanador_${comprador}`);
    };
  }, [comprador]);

  return (
    <div className="container">
      <h2 className="mt-3">Vehículos disponibles</h2>

      {/* Botón para ir al historial */}
      <button
        onClick={() => navigate("/historial")}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "16px",
        }}
      >
        Ver historial de subastas
      </button>

      {/* Lista de vehículos */}
      {vehiculos.length === 0 ? (
        <p>No hay vehículos disponibles en este momento.</p>
      ) : (
        vehiculos.map((auto) => (
          <div
            key={auto.id}
            className="vehiculo-card"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "10px",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              {auto.marca} {auto.modelo}
            </h3>
            <p>
              <strong>Precio base:</strong> ${auto.precio_base}
            </p>
            <p>
              <strong>Vendedor:</strong> {auto.vendedor}
            </p>
            <button
              onClick={() => navigate(`/subasta/${auto.id}`)}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Ver Subasta
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CompradorPage;

