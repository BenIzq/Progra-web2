import React from "react";
import "./CompradorPage.css";

function CompradorPage() {
  const vehiculos = [
    {
      id: 1,
      nombre: "BMW M4",
      año: 2016,
      precio: "Q. 575,000.00",
      imagen: "/bmw.jpg",
    },
    {
      id: 2,
      nombre: "Honda Civic",
      año: 2023,
      precio: "Q. 600,000.00",
      imagen: "/civic.jpg",
    },
    {
      id: 3,
      nombre: "Toyota Corolla",
      año: 2019,
      precio: "Q. 250,000.00",
      imagen: "/corolla.jpg",
    },
    {
      id: 4,
      nombre: "Mercedes Benz C63 AMG",
      año: 2018,
      precio: "Q. 500,000.00",
      imagen: "/amg.jpg",
    },
  ];

  return (
    <div className="comprador-container">
      {/* Encabezado */}
      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="CarBid" className="logo" />
          <h1>CarBid</h1>
        </div>
        <div className="header-right">
          <span>Estas ubicado en:</span>
          <select>
            <option>Guatemala</option>
            <option>El Salvador</option>
            <option>Honduras</option>
          </select>
          <button className="logout-btn">✖</button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
        <section className="vitrina">
          <h2>Vitrina de Vehículos</h2>
          <div className="vehiculos-grid">
            {vehiculos.map((v) => (
              <div key={v.id} className="vehiculo-card">
                <img src={v.imagen} alt={v.nombre} />
                <h3>{v.nombre}</h3>
                <p>{v.año}</p>
                <p className="precio">{v.precio}</p>
                <button className="btn-comprar">Comprar</button>
              </div>
            ))}
          </div>
        </section>

        <aside className="filtros">
          <div className="filtro-seccion">
            <h3>Precios</h3>
            <label>Desde:</label>
            <input type="number" placeholder="Q.0" />
            <label>Hasta:</label>
            <input type="number" placeholder="Q.0" />
            <button className="btn-filtrar">Filtrar</button>
          </div>

          <div className="filtro-seccion">
            <h3>Filtros</h3>
            <label>Modelo</label>
            <select>
              <option>Seleccionar</option>
            </select>

            <label>Marca</label>
            <select>
              <option>Seleccionar</option>
            </select>

            <label>Año</label>
            <select>
              <option>Seleccionar</option>
            </select>

            <button className="btn-buscar">Buscar</button>
          </div>
        </aside>
      </main>

      {/* Pie de página */}
      <footer className="footer">
        Universidad Rafael Landívar
      </footer>
    </div>
  );
}

export default CompradorPage;
