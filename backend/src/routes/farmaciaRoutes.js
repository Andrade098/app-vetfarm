const express = require('express');
const router = express.Router();

// ✅ IMPORTE AMBOS OS CONTROLLERS
const farmaciaAuthController = require('../controllers/farmaciaAuthController');
const farmaciaController = require('../controllers/farmaciaController');
const { authMiddleware, isMatriz } = require('../middlewares/authMiddleware');

// ✅ ROTA DE LOGIN (do authController)
router.post('/login', farmaciaAuthController.login);

// ✅ TODAS AS OUTRAS ROTAS (do controller principal)
router.post('/', farmaciaController.criar);
router.get('/', authMiddleware, farmaciaController.listar);
router.get('/:id', authMiddleware, farmaciaController.buscar);
router.put('/:id', authMiddleware, farmaciaController.atualizar);
router.delete('/:id', authMiddleware, farmaciaController.deletar);

// ROTAS EXCLUSIVAS PARA MATRIZ
router.get('/parceiros/todos', authMiddleware, isMatriz, farmaciaController.listarParceiros);
router.post('/parceiros/novo', authMiddleware, isMatriz, farmaciaController.adicionarParceiro);
router.put('/parceiros/:id/editar', authMiddleware, isMatriz, farmaciaController.editarParceiro);
router.delete('/parceiros/:id/excluir', authMiddleware, isMatriz, farmaciaController.excluirParceiro);

// ROTA PARA VERIFICAR TIPO
router.get('/auth/tipo', authMiddleware, farmaciaController.verificarTipo);

module.exports = router;