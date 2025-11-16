const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.listar);
router.post('/', clienteController.criar);
router.get('/:id', clienteController.buscar);
router.put('/:id', clienteController.atualizar);

module.exports = router;
