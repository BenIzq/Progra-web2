import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function RegisterPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("comprador");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena, rol }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/"); // redirige al login
      } else {
        setMensaje(`❌ ${data.error}`);
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
            ¿Ya tienes cuenta?{" "}
            <a href="#" onClick={() => navigate("/")}>
              Inicia sesión
            </a>
          </p>
        </div>
      </div>

      <div className="login-form">
        <div className="login-header">
          <h2>Registro</h2>
          <p>Crea tu cuenta en CarBid</p>
        </div>

        <form onSubmit={handleRegister}>
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

          <div className="input-group">
            <label style={{ marginBottom: "5px", display: "block" }}>
              Tipo de usuario:
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
            >
              <option value="comprador">Comprador</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>

          <button type="submit" className="btn-login">
            REGISTRAR
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;
