const express = require('express');
const app = express();
const cors = require('cors');

// ⭐⭐ CORS CONFIGURADO PARA ANDROID ⭐⭐
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.3:3000', 'exp://192.168.0.3:8081', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// ⭐⭐ MIDDLEWARE DE DEBUG DETALHADO ⭐⭐
/*
app.use((req, res, next) => {
  console.log(`=== REQUISIÇÃO RECEBIDA ===`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers['content-type']);
  console.log(`Body:`, req.body);
  console.log(`=== FIM REQUISIÇÃO ===`);
  next();
});
*/
// ROTAS - ⭐⭐ ATUALIZADAS ⭐⭐
app.use('/api/clientes', require('./src/routes/clienteRoutes'));
// ❌ REMOVER: app.use('/api/login', require('./src/routes/loginRoutes')); // ROTA OBSOLETA
app.use('/api/farmacias', require('./src/routes/farmaciaRoutes')); // ⭐⭐ CORRIGIDO: farmaciaS (plural)

// ✅✅✅ ADICIONAR AS NOVAS ROTAS DE PRODUTOS ✅✅✅
//app.use('/api/produtos', require('./src/routes/produtoRoutes'));
//app.use('/api/farmacia-produtos', require('./src/routes/farmaciaProdutoRoutes'));

module.exports = app;