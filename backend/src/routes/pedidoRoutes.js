const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /api/pedidos - Listar pedidos do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Buscando pedidos para usuário:', req.user.id);
    
    const pedidos = await Pedido.findAll({
      where: { usuario_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`✅ Encontrados ${pedidos.length} pedidos`);
    
    // Parse dos itens do pedido
    const pedidosFormatados = pedidos.map(pedido => ({
      ...pedido.toJSON(),
      itens: JSON.parse(pedido.itens)
    }));
    
    res.json(pedidosFormatados);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/pedidos - Criar novo pedido
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      numero_pedido, 
      codigo_rastreio, 
      total, 
      endereco_entrega, 
      forma_pagamento, 
      itens, 
      data_entrega_prevista 
    } = req.body;

    console.log('📦 Criando pedido para usuário:', req.user.id);
    console.log('📋 Dados do pedido:', { 
      numero_pedido, 
      total, 
      forma_pagamento 
    });

    const novoPedido = await Pedido.create({
      usuario_id: req.user.id,
      numero_pedido,
      codigo_rastreio,
      total,
      endereco_entrega: JSON.stringify(endereco_entrega),
      forma_pagamento,
      itens: JSON.stringify(itens),
      data_entrega_prevista: new Date(data_entrega_prevista),
      status: 'pendente'
    });

    console.log('✅ Pedido criado com ID:', novoPedido.id);
    
    res.status(201).json({
      ...novoPedido.toJSON(),
      itens: JSON.parse(novoPedido.itens),
      endereco_entrega: JSON.parse(novoPedido.endereco_entrega)
    });
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/pedidos/:id - Buscar pedido específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const pedido = await Pedido.findOne({
      where: { id, usuario_id: req.user.id }
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({
      ...pedido.toJSON(),
      itens: JSON.parse(pedido.itens),
      endereco_entrega: JSON.parse(pedido.endereco_entrega)
    });
  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;