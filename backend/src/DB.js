const mysql = require('mysql2');
require('dotenv').config(); // Cargar variables de entorno

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '05170918',
  database: process.env.DB_NAME || 'sistemaOffice'
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('🔗 Conexión exitosa a MySQL');
});

module.exports = connection;
