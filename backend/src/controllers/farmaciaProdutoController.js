const { FarmaciaProduto, Produto, Categoria, Subcategoria, Farmacia } = require('../models/associations');

const farmaciaProdutoController = {
  adicionarProduto: async (req, res) => {
    try {
      console.log('🏪 [FARMACIA-PRODUTO] Endpoint chamado');
      console.log('📦 Body recebido:', req.body);
      
      const { farmacia_id, produto_id, preco_venda, estoque } = req.body;

      // Validações
      if (!farmacia_id || !produto_id || !preco_venda) {
        console.log('❌ Campos faltando:', { farmacia_id, produto_id, preco_venda });
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios: farmacia_id, produto_id, preco_venda'
        });
      }

      // Verificar se farmácia e produto existem
      console.log('🔍 Procurando farmácia:', farmacia_id);
      const farmacia = await Farmacia.findByPk(farmacia_id);
      console.log('🏪 Farmácia encontrada:', farmacia ? farmacia.id : 'NÃO');

      console.log('🔍 Procurando produto:', produto_id);
      const produto = await Produto.findByPk(produto_id);
      console.log('📦 Produto encontrado:', produto ? produto.id : 'NÃO');

      if (!farmacia) {
        return res.status(404).json({ error: 'Farmácia não encontrada' });
      }
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Verificar se já existe relação
      const relacaoExistente = await FarmaciaProduto.findOne({
        where: { farmacia_id, produto_id }
      });

      if (relacaoExistente) {
        return res.status(400).json({
          error: 'Este produto já está cadastrado nesta farmácia'
        });
      }

      // Converter preço para centavos
      const precoEmCentavos = Math.round(parseFloat(preco_venda) * 100);

      // Criar relação
      const farmaciaProduto = await FarmaciaProduto.create({
        farmacia_id: parseInt(farmacia_id),
        produto_id: parseInt(produto_id),
        preco_venda: precoEmCentavos,
        estoque: estoque ? parseInt(estoque) : 0
      });

      console.log('✅ Produto adicionado à farmácia com sucesso:', farmaciaProduto.id);

      res.status(201).json({
        message: 'Produto adicionado à farmácia com sucesso!',
        farmaciaProduto: {
          ...farmaciaProduto.toJSON(),
          preco_venda: farmaciaProduto.preco_venda / 100
        }
      });

    } catch (error) {
      console.error('💥 ERRO em adicionarProduto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao adicionar produto à farmácia'
      });
    }
  }
};

module.exports = farmaciaProdutoController;