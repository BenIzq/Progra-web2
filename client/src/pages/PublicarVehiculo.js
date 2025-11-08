import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PublicarVehiculo = () => {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [año, setAño] = useState("");
  const [precio_base, setPrecioBase] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [tiempo_limite, setTiempoLimite] = useState(5);
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate(); // 👈 Hook de navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vendedor = localStorage.getItem("usuario");

    if (!vendedor) {
      setMensaje("Error: no se detectó un usuario vendedor logueado.");
      return;
    }

    const vehiculo = {
      vendedor,
      marca,
      modelo,
      año,
      precio_base,
      descripcion,
      imagen,
      tiempo_limite,
    };

    try {
      const res = await fetch("http://localhost:5000/api/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehiculo),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al publicar el vehículo");

      setMensaje("✅ Vehículo publicado correctamente");

      // 🔁 Espera un momento y redirige al vendedor
      setTimeout(() => {
        navigate("/vendedor"); // 👈 Ruta de la página del vendedor
      }, 1500);

    } catch (err) {
      console.error("Error al publicar vehículo:", err);
      setMensaje("❌ Error al publicar vehículo");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Publicar Vehículo en Subasta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Marca:</label>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Modelo:</label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Año:</label>
          <input
            type="number"
            value={año}
            onChange={(e) => setAño(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio base (Q):</label>
          <input
            type="number"
            value={precio_base}
            onChange={(e) => setPrecioBase(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">URL de imagen:</label>
          <input
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            placeholder="https://..."
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Duración de subasta (minutos):
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={tiempo_limite}
            onChange={(e) => setTiempoLimite(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Publicar Vehículo
        </button>
      </form>

      {mensaje && (
        <p className="mt-4 text-center font-semibold text-green-600">
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default PublicarVehiculo;
