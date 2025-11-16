const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rotas CRUD cliente
router.post('/', clienteController.criar);
router.get('/', clienteController.listar);
router.get('/:id', clienteController.buscar);
router.put('/:id', clienteController.atualizar);


module.exports = router;
