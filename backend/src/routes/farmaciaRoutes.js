const express = require('express');
const router = express.Router();
const farmaciaController = require('../controllers/farmaciaController');

// CRUD Farmácia
router.post('/', farmaciaController.criar);
router.get('/', farmaciaController.listar);
router.get('/:id', farmaciaController.buscar);
router.put('/:id', farmaciaController.atualizar);
router.delete('/:id', farmaciaController.deletar);

module.exports = router;
