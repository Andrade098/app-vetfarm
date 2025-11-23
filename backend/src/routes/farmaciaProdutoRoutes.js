const express = require('express');
const router = express.Router();
const farmaciaProdutoController = require('../controllers/farmaciaProdutoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// ✅ ROTAS DO RELACIONAMENTO FARMÁCIA-PRODUTO
router.post('/', farmaciaProdutoController.adicionarProduto);

// ✅ NOVA ROTA - AGORA FUNCIONANDO!
router.get('/minha-farmacia', farmaciaProdutoController.listarProdutosMinhaFarmacia);

router.get('/farmacia/:farmacia_id/produto/:produto_id', authMiddleware, farmaciaProdutoController.buscarProdutoPorIds);

router.put('/farmacia/:farmacia_id/produto/:produto_id', authMiddleware, farmaciaProdutoController.atualizarProdutoPorIds);

// ✅ ADICIONE ESTA ROTA DELETE:
// ✅ CORREÇÃO: Rota DELETE para chave primária composta
router.delete('/farmacia/:farmaciaId/produto/:produtoId', farmaciaProdutoController.removerProduto);

router.get('/loja', farmaciaProdutoController.listarProdutosLoja);

// ✅ ROTA ALTERNATIVA (se quiser manter)
// router.get('/farmacia/:farmacia_id', farmaciaProdutoController.listarPorFarmacia);

module.exports = router;