const express = require('express');
const router = express.Router();
const { uploadMiddleware, uploadImage } = require('../controllers/uploadController');

// Rota para upload de imagem
router.post('/upload', uploadMiddleware, uploadImage);

// Rota de health check para upload
router.get('/upload/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serviço de upload funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;