const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

console.log('✅ clienteRoutes.js CARREGADO!');

const clienteController = require('../controllers/clienteController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// ⭐⭐ ROTA DE TESTE (APENAS PARA DEBUG) ⭐⭐
router.post('/teste', (req, res) => {
  console.log('🎯 ROTA /teste ACIONADA! Body:', req.body);
  res.json({
    success: true,
    message: 'ROTA TESTE FUNCIONANDO!',
    body: req.body
  });
});

// ⭐⭐ ROTA REAL DE CRIAÇÃO ⭐⭐
router.post('/', (req, res) => {
  console.log('🚀🚀🚀 ROTA DE CRIAÇÃO REAL ACIONADA! 🚀🚀🚀');
  console.log('💾 Salvando no banco de dados...');
  clienteController.criar(req, res);
});

// ⭐⭐ ROTA PARA ATUALIZAR DADOS DO USUÁRIO LOGADO ⭐⭐
router.put('/meus-dados', authMiddleware, clienteController.atualizarMeusDados);

// ⭐⭐ ROTA PARA ALTERAR SENHA ⭐⭐
router.put('/alterar-senha', authMiddleware, async (req, res) => {
  try {
    console.log('🔐 Rota de alteração de senha acionada');
    console.log('📨 Body recebido:', req.body);
    console.log('👤 Usuário autenticado:', req.user);

    const { senhaAtual, novaSenha, usuarioId } = req.body;

    // Validações
    if (!senhaAtual || !novaSenha || !usuarioId) {
      console.log('❌ Dados incompletos');
      return res.status(400).json({
        error: 'Dados incompletos. Forneça senha atual, nova senha e ID do usuário.'
      });
    }

    if (novaSenha.length < 6) {
      console.log('❌ Senha muito curta');
      return res.status(400).json({
        error: 'A nova senha deve ter pelo menos 6 caracteres.'
      });
    }

    // Buscar usuário no banco
    const Cliente = require('../models/Cliente');
    const usuario = await Cliente.findByPk(usuarioId);

    if (!usuario) {
      console.log('❌ Usuário não encontrado no banco');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    console.log('✅ Usuário encontrado:', usuario.email);

    // Verificar senha atual
    console.log('🔑 Verificando senha atual...');
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);

    if (!senhaValida) {
      console.log('❌ Senha atual incorreta');
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    console.log('✅ Senha atual válida');

    // Criptografar nova senha
    const saltRounds = 10;
    const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

    // Atualizar senha no banco
    await Cliente.update(
      { senha: novaSenhaHash },
      { where: { id: usuarioId } }
    );

    console.log('✅ Senha alterada com sucesso para o usuário:', usuario.email);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor ao alterar senha',
      details: error.message
    });
  }
});

// ⭐⭐ ROTAS ADICIONAIS ⭐⭐
router.get('/', clienteController.listar);
router.get('/:id', clienteController.buscar);
router.put('/:id', clienteController.atualizar);

module.exports = router;