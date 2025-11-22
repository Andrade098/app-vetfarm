const express = require('express');
const router = express.Router();
const { uploadMiddleware, uploadImage, debugMiddleware } = require('../controllers/uploadController');

// ✅ Rota para upload de imagem COM DEBUG
router.post('/upload', debugMiddleware, uploadMiddleware, uploadImage);

// Rota de health check para upload
router.get('/upload/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serviço de upload funcionando',
    timestamp: new Date().toISOString()
  });
});

// ✅ NOVA ROTA: Teste simples de upload
router.post('/upload/test', (req, res) => {
  console.log('🧪 Teste de upload - Body:', req.body);
  console.log('🧪 Teste de upload - Headers:', req.headers);
  res.json({ 
    success: true, 
    message: 'Teste recebido',
    body: req.body,
    headers: req.headers
  });
});

module.exports = router;