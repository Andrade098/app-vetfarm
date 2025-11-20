const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.3:3000', 'exp://192.168.0.3:8081', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// ROTAS
app.use('/api/clientes', require('./src/routes/clienteRoutes'));
app.use('/api/farmacias', require('./src/routes/farmaciaRoutes'));
app.use('/api/produtos', require('./src/routes/produtoRoutes'));
app.use('/api/farmacia-produtos', require('./src/routes/farmaciaProdutoRoutes'));

module.exports = app;