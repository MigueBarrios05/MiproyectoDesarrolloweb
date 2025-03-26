const express = require('express');
const cors = require('cors');
const db = require('./DB');
const crudRoutes = require('./crud');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(express.json()); // Middleware para leer JSON
app.use(cors()); // Habilita CORS

// Usar las rutas CRUD
app.use('/api', crudRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

// Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});