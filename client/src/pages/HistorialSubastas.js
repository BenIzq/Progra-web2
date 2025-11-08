import React, { useEffect, useState } from "react";

export default function HistorialSubastas() {
  const [historial, setHistorial] = useState([]);
  const comprador = localStorage.getItem("usuario");

  useEffect(() => {
    fetch(`http://localhost:5000/api/historial/${comprador}`)
      .then((res) => res.json())
      .then((data) => setHistorial(data))
      .catch((err) => console.error("Error al cargar historial:", err));
  }, [comprador]);

  return (
    <div className="container mt-4">
      <h2>Historial de Subastas</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Mi Puja</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item, i) => (
            <tr key={i}>
              <td>{item.marca}</td>
              <td>{item.modelo}</td>
              <td>Q{item.mi_puja}</td>
              <td
                style={{
                  color: item.resultado === "Ganó" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {item.resultado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
