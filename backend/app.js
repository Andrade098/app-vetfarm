const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // ✅ Adicionar isso

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.3:3000', 'exp://192.168.0.3:8081', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// ✅✅✅ CORREÇÃO: Configuração correta para servir arquivos estáticos
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

// ROTAS
app.use('/api/clientes', require('./src/routes/clienteRoutes'));
app.use('/api/farmacias', require('./src/routes/farmaciaRoutes'));
app.use('/api/produtos', require('./src/routes/produtoRoutes'));
app.use('/api/farmacia-produtos', require('./src/routes/farmaciaProdutoRoutes'));

// ✅ Rota de upload
app.use('/api', require('./src/routes/upload'));

// ✅ Adicionar rota de debug para testar
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

module.exports = app;