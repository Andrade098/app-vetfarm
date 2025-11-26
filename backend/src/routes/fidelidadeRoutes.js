// routes/fidelidadeRoutes.js
const express = require('express');
const fidelidadeController = require('../controllers/fidelidadeController');
const router = express.Router();

// 💰 FIDELIDADE
router.get('/clientes/:cliente_id/saldo', fidelidadeController.verSaldo);
router.get('/clientes/:cliente_id/historico', fidelidadeController.historicoPontos);
router.get('/clientes/:cliente_id/premio', fidelidadeController.verificarPremio);
router.post('/clientes/:cliente_id/resgatar', fidelidadeController.resgatarPremio);
router.get('/regras', fidelidadeController.regras);

module.exports = router;