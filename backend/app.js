const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Recebida requisição ${req.method} em ${req.url}`);
  next();
});


// ROTAS
app.use('/api/clientes', require('./src/routes/clienteRoutes'));
app.use('/api/login', require('./src/routes/loginRoutes'));
app.use('/api/farmacia', require('./src/routes/farmaciaRoutes'));


module.exports = app;
