const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// ⭐⭐ MIDDLEWARE DE DEBUG DETALHADO ⭐⭐
app.use((req, res, next) => {
  console.log(`=== REQUISIÇÃO RECEBIDA ===`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers['content-type']);
  console.log(`Body:`, req.body);
  console.log(`=== FIM REQUISIÇÃO ===`);
  next();
});

// ROTAS
app.use('/api/clientes', require('./src/routes/clienteRoutes'));
app.use('/api/login', require('./src/routes/loginRoutes'));
app.use('/api/farmacia', require('./src/routes/farmaciaRoutes'));

module.exports = app;