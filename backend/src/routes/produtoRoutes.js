const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// ✅ CERTIFIQUE-SE DE QUE ESTAS ROTAS EXISTEM:
router.get('/categorias', produtoController.listarCategorias);
router.get('/subcategorias/:categoria_id', produtoController.listarSubcategorias);

// Outras rotas...
router.post('/', produtoController.criar);
router.get('/todos', produtoController.listarTodos);

module.exports = router;