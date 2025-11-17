const express = require('express');
const router = express.Router();

console.log('✅ clienteRoutes.js CARREGADO!');

const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware'); // ⭐⭐ IMPORTE O MIDDLEWARE

// ⭐⭐ ROTA DE TESTE (APENAS PARA DEBUG) ⭐⭐
router.post('/teste', (req, res) => {
  console.log('🎯 ROTA /teste ACIONADA! Body:', req.body);
  res.json({
    success: true,
    message: 'ROTA TESTE FUNCIONANDO!',
    body: req.body
  });
});

// ⭐⭐ ROTA REAL DE CRIAÇÃO ⭐⭐
router.post('/', (req, res) => {
  console.log('🚀🚀🚀 ROTA DE CRIAÇÃO REAL ACIONADA! 🚀🚀🚀');
  console.log('💾 Salvando no banco de dados...');
  clienteController.criar(req, res);
});

// ⭐⭐ ROTA PARA ATUALIZAR DADOS DO USUÁRIO LOGADO ⭐⭐
router.put('/meus-dados', authMiddleware, clienteController.atualizarMeusDados);

// ⭐⭐ ROTAS ADICIONAIS ⭐⭐
router.get('/', clienteController.listar);
router.get('/:id', clienteController.buscar);
router.put('/:id', clienteController.atualizar);

module.exports = router;