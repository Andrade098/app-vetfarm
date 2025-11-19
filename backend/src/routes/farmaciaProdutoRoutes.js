const express = require('express');
const router = express.Router();
const farmaciaProdutoController = require('../controllers/farmaciaProdutoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

//router.use(authFarmacia);

// ✅ APENAS AS ROTAS QUE VOCÊ PRECISA AGORA
router.post('/', farmaciaProdutoController.adicionarProduto);

// ❌ COMENTE AS OUTRAS ATÉ IMPLEMENTAR
// router.get('/farmacia/:farmacia_id', farmaciaProdutoController.listarPorFarmacia);
// router.get('/farmacia/:farmacia_id/produto/:produto_id', farmaciaProdutoController.buscarPorFarmacia);
// router.put('/farmacia/:farmacia_id/produto/:produto_id', farmaciaProdutoController.atualizarEstoquePreco);
// router.delete('/farmacia/:farmacia_id/produto/:produto_id', farmaciaProdutoController.removerProduto);

module.exports = router;