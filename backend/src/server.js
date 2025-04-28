const express = require('express');
const cors = require('cors');
const db = require('./DB');
const crudRoutes = require('./crud');
require('dotenv').config(); 

const app = express();
app.use(express.json()); 
app.use(cors()); // 


app.use('/api', crudRoutes);


app.get('/', (req, res) => {
  res.send('API funcionando ');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});