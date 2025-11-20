const express = require('express');
const router = express.Router();
const farmaciaProdutoController = require('../controllers/farmaciaProdutoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// ✅ ROTAS DO RELACIONAMENTO FARMÁCIA-PRODUTO
router.post('/', farmaciaProdutoController.adicionarProduto);

// ✅ DESCOMENTE quando for implementar:
// router.get('/farmacia/:farmacia_id', farmaciaProdutoController.listarPorFarmacia);
// router.put('/farmacia/:farmacia_id/produto/:produto_id', farmaciaProdutoController.atualizarEstoquePreco);

module.exports = router;