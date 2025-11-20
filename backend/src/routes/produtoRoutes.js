const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// ✅ APENAS PRODUTOS GERAIS
router.get('/categorias', produtoController.listarCategorias);
router.get('/subcategorias/:categoria_id', produtoController.listarSubcategorias);
router.post('/', produtoController.criar);
router.get('/todos', produtoController.listarTodos);

// ❌ REMOVA estas rotas (se existirem):
// router.post('/farmacia', produtoController.adicionarAFarmacia);
// router.get('/farmacia/:farmacia_id', produtoController.listarPorFarmacia);
// router.put('/farmacia/:farmacia_id/produto/:produto_id', produtoController.atualizarEstoquePreco);

module.exports = router;