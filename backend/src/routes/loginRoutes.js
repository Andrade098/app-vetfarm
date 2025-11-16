const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

// POST /api/login
router.post('/', (req, res) => LoginController.login(req, res));

module.exports = router;
