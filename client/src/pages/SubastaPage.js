import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const SubastaPage = () => {
  const { id } = useParams();
  const comprador = localStorage.getItem("usuario");
  const [vehiculo, setVehiculo] = useState(null);
  const [mejorPuja, setMejorPuja] = useState(null);
  const [monto, setMonto] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState(0);

  // Cargar vehículo y mejor puja
  useEffect(() => {
    const cargarDatos = async () => {
      const res = await fetch(`http://localhost:5000/api/vehiculos/${id}`);
      const v = await res.json();
      setVehiculo(v);

      // Calcular tiempo restante
      if (v.inicio_subasta && v.tiempo_limite) {
        const inicio = new Date(v.inicio_subasta).getTime();
        const ahora = new Date().getTime();
        const fin = inicio + v.tiempo_limite * 60 * 1000;
        const restante = Math.max(0, Math.floor((fin - ahora) / 1000));
        setTiempoRestante(restante);
      }

      // Cargar mejor puja actual
      const resPuja = await fetch(`http://localhost:5000/api/pujas/mejor/${id}`);
      const mejor = await resPuja.json();
      if (mejor) setMejorPuja(mejor);
    };

    cargarDatos();
  }, [id]);

  // Temporizador sincronizado
  useEffect(() => {
    if (tiempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTiempoRestante((t) => {
        if (t <= 1) clearInterval(timer);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  // Escuchar actualizaciones de Socket.IO
  useEffect(() => {
    socket.on(`actualizarPuja_${id}`, (nuevaPuja) => {
      setMejorPuja(nuevaPuja);
    });
    return () => {
      socket.off(`actualizarPuja_${id}`);
    };
  }, [id]);

useEffect(() => {
  socket.on(`errorPuja_${id}`, (data) => {
    alert(data.error);
  });

  return () => {
    socket.off(`errorPuja_${id}`);
  };
}, [id]);

  const enviarPuja = () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert("Ingresa un monto válido");
      return;
    }
    socket.emit("nuevaPuja", {
      vehiculo_id: id,
      comprador,
      monto: parseFloat(monto),
    });
    setMonto("");
  };

  const formatoTiempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!vehiculo) return <p>Cargando vehículo...</p>;

  return (
    <div className="subasta-container" style={{ padding: "20px" }}>
      <h2>Subasta: {vehiculo.marca} {vehiculo.modelo}</h2>
      <img
        src={vehiculo.imagen || "https://via.placeholder.com/300x200"}
        alt={vehiculo.modelo}
        style={{ width: "300px", borderRadius: "8px" }}
      />
      <p><strong>Precio base:</strong> ${vehiculo.precio_base}</p>
      <p><strong>Descripción:</strong> {vehiculo.descripcion}</p>
      <h3>⏳ Tiempo restante: {formatoTiempo(tiempoRestante)}</h3>

      {tiempoRestante > 0 ? (
        <>
          <div className="puja-section" style={{ marginTop: "20px" }}>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Tu oferta ($)"
            />
            <button onClick={enviarPuja}>Ofertar</button>
          </div>

          <div className="mejor-puja" style={{ marginTop: "20px" }}>
            <h4>💰 Mejor oferta actual:</h4>
            {mejorPuja ? (
              <p>
                <strong>{mejorPuja.comprador}</strong>: ${mejorPuja.monto}
              </p>
            ) : (
              <p>Aún no hay ofertas.</p>
            )}
          </div>
        </>
      ) : (
        <h3>🛑 Subasta finalizada</h3>
      )}
    </div>
  );
};

export default SubastaPage;
