import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PublicarVehiculo.css";

const PublicarVehiculo = () => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    año: "",
    precio_base: "",
    descripcion: "",
    tiempo_limite: "",
    imagen: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("✅ Vehículo publicado con éxito");
      navigate("/vendedor");
    } else {
      alert("❌ Error al publicar el vehículo");
    }
  };

  return (
    <div className="publicar-container">
      <h2>Publicar Nuevo Vehículo</h2>

      <form className="form-publicar" onSubmit={handleSubmit}>
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={formData.marca}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="modelo"
          placeholder="Modelo"
          value={formData.modelo}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="año"
          placeholder="Año"
          value={formData.año}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="precio_base"
          placeholder="Precio base"
          value={formData.precio_base}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tiempo_limite"
          placeholder="Tiempo límite (ej: 3 días)"
          value={formData.tiempo_limite}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de la imagen (opcional)"
          value={formData.imagen}
          onChange={handleChange}
        />

        <button type="submit" className="btn-enviar">
          Publicar
        </button>
      </form>

      <button className="btn-volver" onClick={() => navigate("/vendedor")}>
        ← Volver
      </button>
    </div>
  );
};

export default PublicarVehiculo;
