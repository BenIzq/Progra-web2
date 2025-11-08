// db.js
require("dotenv").config();
const mysql = require("mysql2");

// Configurar conexión con variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Probar la conexión
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
    return;
  }
  console.log("✅ Conexión exitosa con MySQL");
});

module.exports = db;

