const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// ✅ CARREGAR ASSOCIAÇÕES DO BANCO DE DADOS
require('./src/models/associations');

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.2:3000', 'exp://192.168.0.2:8081', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// ✅✅✅ CONFIGURAÇÃO CORRETA PARA SERVIR ARQUIVOS ESTÁTICOS
const uploadsPath = path.join(__dirname, 'uploads');

// Criar pasta uploads se não existir
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Pasta uploads criada:', uploadsPath);
}

// ✅ CORREÇÃO PRINCIPAL: Usar '/uploads' como rota
app.use('/uploads', express.static(uploadsPath));

console.log('📁 Servindo arquivos estáticos de:', uploadsPath);
console.log('🌐 Acessível em: http://192.168.0.3:3000/uploads/');

// ✅ ROTAS PRINCIPAIS
app.use('/api/clientes', require('./src/routes/clienteRoutes'));
app.use('/api/farmacias', require('./src/routes/farmaciaRoutes'));
app.use('/api/produtos', require('./src/routes/produtoRoutes'));
app.use('/api/farmacia-produtos', require('./src/routes/farmaciaProdutoRoutes'));
app.use('/api/enderecos', require('./src/routes/enderecoRoutes'));
app.use('/api/categoria-produto', require('./src/routes/categoriaProdutoRoutes'));
app.use('/api/pedidos', require('./src/routes/pedidoRoutes'));

// ✅ ROTA DE UPLOAD
app.use('/api', require('./src/routes/upload'));

// ✅ ROTA DE HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API VetFarm funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// ✅ ROTA DE DEBUG PARA TESTAR UPLOADS
app.get('/api/debug/uploads', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({
      message: 'Pasta uploads',
      path: uploadsPath,
      files: files,
      totalFiles: files.length,
      accessibleExample: `http://192.168.0.3:3000/uploads/${files[0] || 'nome-do-arquivo'}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ MIDDLEWARE DE TRATAMENTO DE ROTAS NÃO ENCONTRADAS
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// ✅ MIDDLEWARE DE TRATAMENTO DE ERROS GLOBAIS
app.use((error, req, res, next) => {
  console.error('❌ Erro global:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

console.log('🚀 API VetFarm inicializada com sucesso!');
console.log(`📋 ${Object.keys(app._router.stack).length} rotas carregadas`);
console.log('📍 Endpoint principal: http://192.168.0.3:3000/api');

module.exports = app;