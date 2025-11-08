const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST"],
  },
});

// --- LOGIN ---
app.post("/api/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const sql = "SELECT * FROM usuarios WHERE usuario = ?";
  db.query(sql, [usuario], async (err, results) => {
    if (err) {
      console.error("Error al buscar usuario:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({ usuario: user.usuario, rol: user.rol });
  });
});

// --- REGISTRO DE USUARIO ---
app.post("/api/register", async (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const sql =
      "INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)";
    db.query(sql, [usuario, hashedPassword, rol || "comprador"], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "El usuario ya existe" });
        }
        console.error("Error al registrar usuario:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      res.status(201).json({ message: "Usuario registrado correctamente" });
    });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error al registrar" });
  }
});

// --- OBTENER TODOS LOS VEHÍCULOS ---
app.get("/api/vehiculos", (req, res) => {
  const sql = "SELECT * FROM vehiculos ORDER BY fecha_publicacion DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener vehículos:", err);
      return res.status(500).json({ error: "Error al cargar vehículos" });
    }
    res.json(results);
  });
});

// --- OBTENER VEHÍCULOS DE UN VENDEDOR ---
app.get("/api/vehiculos/vendedor/:vendedor", (req, res) => {
  const { vendedor } = req.params;
  const sql =
    "SELECT * FROM vehiculos WHERE vendedor = ? ORDER BY fecha_publicacion DESC";
  db.query(sql, [vendedor], (err, results) => {
    if (err) {
      console.error("Error al obtener vehículos del vendedor:", err);
      return res.status(500).json({ error: "Error al cargar vehículos" });
    }
    res.json(results);
  });
});

// --- OBTENER UN VEHÍCULO POR ID (para SubastaPage) ---
app.get("/api/vehiculos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM vehiculos WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener vehículo:", err);
      return res.status(500).json({ error: "Error al cargar vehículo" });
    }
    res.json(results[0]);
  });
});

// --- OBTENER LA MEJOR PUJA DE UN VEHÍCULO ---
app.get("/api/pujas/mejor/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT comprador, monto 
    FROM pujas 
    WHERE vehiculo_id = ? 
    ORDER BY monto DESC 
    LIMIT 1
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener la mejor puja:", err);
      return res.status(500).json({ error: "Error al obtener la puja" });
    }
    res.json(results[0] || null);
  });
});

// --- PUBLICAR VEHÍCULO ---
app.post("/api/vehiculos", (req, res) => {
  const { vendedor, marca, modelo, año, precio_base, descripcion, imagen, tiempo_limite } = req.body;

  if (!vendedor || !marca || !modelo || !año || !precio_base) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const sql = `
    INSERT INTO vehiculos 
    (vendedor, marca, modelo, año, precio_base, descripcion, imagen, tiempo_limite, inicio_subasta, fecha_publicacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(sql, [vendedor, marca, modelo, año, precio_base, descripcion, imagen, tiempo_limite], (err) => {
    if (err) {
      console.error("Error al publicar vehículo:", err);
      return res.status(500).json({ error: "Error al publicar vehículo" });
    }
    res.status(201).json({ message: "Vehículo publicado correctamente" });
  });
});

app.get("/api/historial/:comprador", (req, res) => {
  const { comprador } = req.params;

  const sql = `
    SELECT 
      v.marca, v.modelo, p.monto,
      CASE 
        WHEN p.monto = (
          SELECT MAX(p2.monto) FROM pujas p2 WHERE p2.vehiculo_id = v.id
        ) THEN 'Ganaste'
        ELSE 'Perdiste'
      END AS resultado
    FROM pujas p
    JOIN vehiculos v ON p.vehiculo_id = v.id
    WHERE p.comprador = ?
    ORDER BY v.fecha_publicacion DESC
  `;

  db.query(sql, [comprador], (err, results) => {
    if (err) {
      console.error("Error al obtener historial:", err);
      return res.status(500).json({ error: "Error al cargar historial" });
    }
    res.json(results);
  });
});

// --- SOCKET.IO: LÓGICA DE SUBASTAS ---
io.on("connection", (socket) => {
  console.log("🟢 Nuevo cliente conectado:", socket.id);

  socket.on("nuevaPuja", (data) => {
    const { vehiculo_id, comprador, monto } = data;

    // 1️⃣ Obtener el precio base y verificar si la puja lo supera
    const sqlVehiculo = "SELECT precio_base FROM vehiculos WHERE id = ?";
    db.query(sqlVehiculo, [vehiculo_id], (err, vehiculoResults) => {
      if (err || vehiculoResults.length === 0) {
        console.error("❌ Error al obtener vehículo:", err);
        socket.emit(`errorPuja_${vehiculo_id}`, {
          error: "Vehículo no encontrado o error interno.",
        });
        return;
      }

      const precioBase = vehiculoResults[0].precio_base;

      // 2️⃣ Obtener la mejor puja actual (si existe)
      const sqlMejorPuja = `
        SELECT monto 
        FROM pujas 
        WHERE vehiculo_id = ? 
        ORDER BY monto DESC 
        LIMIT 1
      `;
      db.query(sqlMejorPuja, [vehiculo_id], (err, pujaResults) => {
        if (err) {
          console.error("❌ Error al obtener mejor puja:", err);
          return;
        }

        const mejorPujaActual = pujaResults.length > 0 ? pujaResults[0].monto : precioBase;

        // 3️⃣ Validar si la nueva puja es mayor al precio base y a la mejor puja actual
        if (monto <= mejorPujaActual) {
          socket.emit(`errorPuja_${vehiculo_id}`, {
            error: `La puja debe ser mayor a ${mejorPujaActual}.`,
          });
          return;
        }

        // 4️⃣ Insertar la nueva puja válida
        const sqlInsert = "INSERT INTO pujas (vehiculo_id, comprador, monto) VALUES (?, ?, ?)";
        db.query(sqlInsert, [vehiculo_id, comprador, monto], (err) => {
          if (err) {
            console.error("❌ Error al guardar puja:", err);
            return;
          }

          // 5️⃣ Obtener y emitir la mejor puja actualizada
          const sqlMax = `
            SELECT comprador, monto 
            FROM pujas 
            WHERE vehiculo_id = ? 
            ORDER BY monto DESC 
            LIMIT 1
          `;
          db.query(sqlMax, [vehiculo_id], (err, results) => {
            if (!err && results.length > 0) {
              const mejorPuja = results[0];
              io.emit(`actualizarPuja_${vehiculo_id}`, mejorPuja);
            }
          });
        });
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// --- COMPROBAR SUBASTAS FINALIZADAS CADA MINUTO ---
setInterval(() => {
  const sql = `
    SELECT id, vendedor, tiempo_limite, inicio_subasta
    FROM vehiculos
    WHERE ganador IS NULL
  `;
  db.query(sql, (err, vehiculos) => {
    if (err) return console.error("❌ Error al verificar subastas:", err);

    vehiculos.forEach((vehiculo) => {
      const inicio = new Date(vehiculo.inicio_subasta);
      const limiteMin = parseInt(vehiculo.tiempo_limite, 10);
      const fin = new Date(inicio.getTime() + limiteMin * 60000); // minutos → ms
      const ahora = new Date();

      if (ahora >= fin) {
        // Subasta finalizada → obtener mejor puja
        const sqlMejor = `
          SELECT comprador, monto 
          FROM pujas 
          WHERE vehiculo_id = ? 
          ORDER BY monto DESC 
          LIMIT 1
        `;
        db.query(sqlMejor, [vehiculo.id], (err, results) => {
          if (err) return console.error("❌ Error al obtener ganador:", err);

          if (results.length === 0) {
            // No hubo pujas → marcar como sin ganador
            db.query("UPDATE vehiculos SET ganador = 'Sin ofertas' WHERE id = ?", [vehiculo.id]);
            return;
          }

          const { comprador, monto } = results[0];

          // Guardar ganador en la tabla vehiculos
          db.query(
            "UPDATE vehiculos SET ganador = ? WHERE id = ?",
            [comprador, vehiculo.id],
            (err2) => {
              if (err2) return console.error("❌ Error al actualizar ganador:", err2);

              console.log(`🏁 Subasta ${vehiculo.id} finalizada. Ganador: ${comprador}`);

              // 🔔 Notificar al ganador
              io.emit(`notificacionGanador_${comprador}`, {
                mensaje: `¡Felicidades! Ganaste la subasta del vehículo #${vehiculo.id}`,
                vehiculo_id: vehiculo.id,
              });
            }
          );
        });
      }
    });
  });
}, 60000); 


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
