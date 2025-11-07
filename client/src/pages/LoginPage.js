import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function LoginPage() {
  // 👇 Aquí defines los estados y navigate
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      });
      const data = await res.json();
      if (res.ok) {
        // Guarda usuario y rol si quieres usarlo luego
        localStorage.setItem("usuario", data.usuario);
        localStorage.setItem("rol", data.rol);

        if (data.rol === "comprador") {
          navigate("/comprador");
        } else if (data.rol === "vendedor") {
          navigate("/vendedor");
        } else {
          setMensaje("Rol no reconocido");
        }
      } else {
        setMensaje(`❌ ${data.error || "Credenciales incorrectas"}`);
      }
    } catch (err) {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <div className="overlay-text">
          <p>
            ¿No tienes cuenta?{" "}
            <a href="#" onClick={() => navigate("/register")}>
              Registrar...
            </a>
          </p>
        </div>
      </div>

      <div className="login-form">
        <div className="login-header">
          <img src="/logo.png" alt="CarBid" className="logo" />
          <h2>CarBid</h2>
          <p>Sistema de Subastas de Vehículos</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            INICIO
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
