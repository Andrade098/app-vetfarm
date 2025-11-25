const express = require('express');
const router = express.Router();
const Endereco = require('../models/Endereco');
const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ MUDAR AQUI

// GET /api/enderecos - Listar endereços do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const enderecos = await Endereco.findAll({
      where: { usuario_id: req.user.id } // ✅ MUDAR AQUI - usar req.user.id
    });
    res.json(enderecos);
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/enderecos - Criar novo endereço
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { apelido, logradouro, numero, complemento, bairro, cidade, estado, cep, principal } = req.body;
    
    // Se for definir como principal, remove principal dos outros
    if (principal) {
      await Endereco.update(
        { principal: false },
        { where: { usuario_id: req.user.id } } // ✅ MUDAR AQUI
      );
    }

    const novoEndereco = await Endereco.create({
      usuario_id: req.user.id, // ✅ MUDAR AQUI
      apelido,
      logradouro,
      numero,
      complemento: complemento || '',
      bairro,
      cidade,
      estado,
      cep,
      principal: principal || false
    });

    res.status(201).json(novoEndereco);
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/enderecos/:id/principal - Definir endereço como principal
router.put('/:id/principal', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Remove principal de todos os endereços do usuário
    await Endereco.update(
      { principal: false },
      { where: { usuario_id: req.user.id } } // ✅ MUDAR AQUI
    );

    // Define o endereço selecionado como principal
    const [updated] = await Endereco.update(
      { principal: true },
      { where: { id, usuario_id: req.user.id } } // ✅ MUDAR AQUI
    );

    if (updated) {
      res.json({ message: 'Endereço principal atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Endereço não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao definir endereço principal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/enderecos/:id - Remover endereço
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const endereco = await Endereco.findOne({
      where: { id, usuario_id: req.user.id } // ✅ MUDAR AQUI
    });

    if (!endereco) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }

    await Endereco.destroy({
      where: { id, usuario_id: req.user.id } // ✅ MUDAR AQUI
    });

    res.json({ message: 'Endereço removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover endereço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;