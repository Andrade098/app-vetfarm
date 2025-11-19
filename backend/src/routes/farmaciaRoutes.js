const express = require('express');
const router = express.Router();
const farmaciaController = require('../controllers/farmaciaController');
const { authFarmacia, isMatriz } = require('../middlewares/authMiddleware');

// CRUD Farmácia (acesso geral para farmácias autenticadas)
router.post('/', farmaciaController.criar);
router.get('/', authFarmacia, farmaciaController.listar);
router.get('/:id', authFarmacia, farmaciaController.buscar);
router.put('/:id', authFarmacia, farmaciaController.atualizar);
router.delete('/:id', authFarmacia, farmaciaController.deletar);

// ROTAS EXCLUSIVAS PARA MATRIZ
router.get('/parceiros/todos', authFarmacia, isMatriz, farmaciaController.listarParceiros);
router.post('/parceiros/novo', authFarmacia, isMatriz, farmaciaController.adicionarParceiro);
router.put('/parceiros/:id/editar', authFarmacia, isMatriz, farmaciaController.editarParceiro);
router.delete('/parceiros/:id/excluir', authFarmacia, isMatriz, farmaciaController.excluirParceiro);

// ROTA PARA VERIFICAR TIPO
router.get('/auth/tipo', authFarmacia, farmaciaController.verificarTipo);

module.exports = router;