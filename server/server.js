const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // importante para leer JSON en POST

// --- DATOS TEMPORALES (como si fuera una BD en memoria) ---
let vehiculos = [
  {
    id: 1,
    marca: "BMW",
    modelo: "M4",
    año: 2016,
    precio_base: 475000,
    descripcion: "BMW M4 2016 en excelente estado",
    tiempo_limite: "3 días",
    imagen: "https://cdn.motor1.com/images/mgl/qLZl8/s1/2021-bmw-m4.jpg"
  },
  {
    id: 2,
    marca: "Honda",
    modelo: "Civic",
    año: 2023,
    precio_base: 460000,
    descripcion: "Honda Civic 2023 nuevo",
    tiempo_limite: "5 días",
    imagen: "https://cdn.motor1.com/images/mgl/8vJr6/s1/honda-civic-2022.jpg"
  }
];

// --- ENDPOINT DE LOGIN ---
app.post('/api/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  // Simulación de usuarios registrados
  if (usuario === 'admin' && contrasena === '1234') {
    return res.json({ usuario, rol: 'vendedor' });
  } else if (usuario === 'cliente' && contrasena === '1234') {
    return res.json({ usuario, rol: 'comprador' });
  } else {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }
});

// --- ENDPOINTS DE VEHÍCULOS ---

// Obtener todos los vehículos
app.get('/api/vehiculos', (req, res) => {
  res.json(vehiculos);
});

// Publicar un nuevo vehículo
app.post('/api/vehiculos', (req, res) => {
  const { marca, modelo, año, precio_base, descripcion, tiempo_limite, imagen } = req.body;

  if (!marca || !modelo || !año || !precio_base) {
    return res.status(400).json({ error: "Faltan datos del vehículo" });
  }

  const nuevoVehiculo = {
    id: vehiculos.length + 1,
    marca,
    modelo,
    año,
    precio_base,
    descripcion,
    tiempo_limite,
    imagen: imagen || "https://cdn.pixabay.com/photo/2017/01/06/19/15/car-1957037_1280.jpg"
  };

  vehiculos.push(nuevoVehiculo);
  console.log("Vehículo agregado:", nuevoVehiculo);
  res.status(201).json(nuevoVehiculo);
});

// --- SERVIDOR ---
app.listen(5000, () => {
  console.log('✅ Servidor corriendo en puerto 5000');
});
