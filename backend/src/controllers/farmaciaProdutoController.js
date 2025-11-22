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

      // Criar relação
      const farmaciaProduto = await FarmaciaProduto.create({
        farmacia_id: parseInt(farmacia_id),
        produto_id: parseInt(produto_id),
        preco_venda: parseFloat(preco_venda),
        estoque: estoque ? parseInt(estoque) : 0
      });

      console.log('✅ Produto adicionado à farmácia com sucesso:', farmaciaProduto.id);

      res.status(201).json({
        message: 'Produto adicionado à farmácia com sucesso!',
        farmaciaProduto: farmaciaProduto.toJSON()
      });

    } catch (error) {
      console.error('💥 ERRO em adicionarProduto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao adicionar produto à farmácia',
        details: error.message
      });
    }
  },

  // ✅ FUNÇÃO CORRIGIDA - COM OS CAMPOS EM PORTUGUÊS
  listarProdutosMinhaFarmacia: async (req, res) => {
    try {
      console.log('🏪 [FARMACIA-PRODUTO] Buscando produtos da farmácia logada');
      console.log('🔑 Usuário do token:', req.user);
      
      let farmaciaId = req.user.farmaciaId;
      
      if (!farmaciaId) {
        console.log('⚠️ farmaciaId não encontrado no token, usando fallback...');
        
        // Buscar primeira farmácia como fallback
        try {
          const farmaciaPadrao = await Farmacia.findOne({
            order: [['id', 'ASC']]
          });
          
          if (farmaciaPadrao) {
            farmaciaId = farmaciaPadrao.id;
            console.log('✅ Farmácia padrão encontrada:', farmaciaId);
          } else {
            farmaciaId = 1;
            console.log('⚠️ Usando farmácia padrão para teste:', farmaciaId);
          }
        } catch (dbError) {
          console.error('❌ Erro ao buscar farmácia:', dbError);
          farmaciaId = 1;
          console.log('⚠️ Usando farmácia fixa devido a erro:', farmaciaId);
        }
      }

      console.log('🔍 Farmácia ID final:', farmaciaId);
      
      // ✅ QUERY CORRIGIDA - CAMPOS EM PORTUGUÊS
      const farmaciaProdutos = await FarmaciaProduto.findAll({
        where: { farmacia_id: farmaciaId },
        include: [{
          model: Produto,
          as: 'produto',
          attributes: ['id', 'nome', 'descricao', 'categoria_id', 'subcategoria_id', 'imagens', 'ativo', 'criado_em', 'atualizado_em']
          // ✅ CORRETO: criado_em e atualizado_em (em português)
        }],
        order: [['updated_at', 'DESC']]
      });

      console.log('📦 Produtos encontrados:', farmaciaProdutos.length);

      // Formatar resposta
      const produtosFormatados = farmaciaProdutos.map(item => {
        const produtoData = item.toJSON();
        return {
          id: produtoData.id,
          farmacia_id: produtoData.farmacia_id,
          produto_id: produtoData.produto_id,
          estoque: produtoData.estoque,
          preco_venda: produtoData.preco_venda,
          created_at: produtoData.created_at,
          updated_at: produtoData.updated_at,
          produto: produtoData.produto ? {
            id: produtoData.produto.id,
            nome: produtoData.produto.nome,
            descricao: produtoData.produto.descricao,
            categoria_id: produtoData.produto.categoria_id,
            subcategoria_id: produtoData.produto.subcategoria_id,
            imagens: Array.isArray(produtoData.produto.imagens) 
              ? produtoData.produto.imagens 
              : JSON.parse(produtoData.produto.imagens || '[]'),
            ativo: produtoData.produto.ativo,
            criado_em: produtoData.produto.criado_em,        // ✅ PORTUGUÊS
            atualizado_em: produtoData.produto.atualizado_em // ✅ PORTUGUÊS
          } : null
        };
      });

      console.log('✅ Produtos formatados:', produtosFormatados.length);
      
      res.json(produtosFormatados);

    } catch (error) {
      console.error('💥 ERRO em listarProdutosMinhaFarmacia:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar produtos da farmácia',
        details: error.message
      });
    }
  },

  // ✅ FUNÇÃO ALTERNATIVA CORRIGIDA
  listarPorFarmacia: async (req, res) => {
    try {
      const { farmacia_id } = req.params;
      
      console.log('🔍 Buscando produtos da farmácia:', farmacia_id);

      const farmaciaProdutos = await FarmaciaProduto.findAll({
        where: { farmacia_id },
        include: [{
          model: Produto,
          as: 'produto',
          attributes: ['id', 'nome', 'descricao', 'categoria_id', 'subcategoria_id', 'imagens', 'ativo', 'criado_em', 'atualizado_em']
          // ✅ CORRETO: criado_em e atualizado_em
        }],
        order: [['updated_at', 'DESC']]
      });

      const produtosFormatados = farmaciaProdutos.map(item => {
        const data = item.toJSON();
        return {
          id: data.id,
          farmacia_id: data.farmacia_id,
          produto_id: data.produto_id,
          estoque: data.estoque,
          preco_venda: data.preco_venda,
          created_at: data.created_at,
          updated_at: data.updated_at,
          produto: data.produto ? {
            id: data.produto.id,
            nome: data.produto.nome,
            descricao: data.produto.descricao,
            categoria_id: data.produto.categoria_id,
            subcategoria_id: data.produto.subcategoria_id,
            imagens: Array.isArray(data.produto.imagens) 
              ? data.produto.imagens 
              : JSON.parse(data.produto.imagens || '[]'),
            ativo: data.produto.ativo,
            criado_em: data.produto.criado_em,        // ✅ PORTUGUÊS
            atualizado_em: data.produto.atualizado_em // ✅ PORTUGUÊS
          } : null
        };
      });

      res.json(produtosFormatados);

    } catch (error) {
      console.error('💥 ERRO em listarPorFarmacia:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
  },

  // ✅ FUNÇÃO EXTRA: Atualizar produto da farmácia
  atualizarProduto: async (req, res) => {
    try {
      const { id } = req.params;
      const { preco_venda, estoque } = req.body;

      const farmaciaProduto = await FarmaciaProduto.findByPk(id);
      
      if (!farmaciaProduto) {
        return res.status(404).json({ error: 'Relação farmácia-produto não encontrada' });
      }

      // Atualizar campos
      if (preco_venda !== undefined) {
        farmaciaProduto.preco_venda = parseFloat(preco_venda);
      }
      if (estoque !== undefined) {
        farmaciaProduto.estoque = parseInt(estoque);
      }

      await farmaciaProduto.save();

      res.json({
        message: 'Produto atualizado com sucesso!',
        farmaciaProduto: farmaciaProduto.toJSON()
      });

    } catch (error) {
      console.error('💥 ERRO em atualizarProduto:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
  },

  // ✅ FUNÇÃO EXTRA: Remover produto da farmácia
  removerProduto: async (req, res) => {
    try {
      const { id } = req.params;

      const farmaciaProduto = await FarmaciaProduto.findByPk(id);
      
      if (!farmaciaProduto) {
        return res.status(404).json({ error: 'Relação farmácia-produto não encontrada' });
      }

      await farmaciaProduto.destroy();

      res.json({ message: 'Produto removido da farmácia com sucesso!' });

    } catch (error) {
      console.error('💥 ERRO em removerProduto:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
  },

  // ✅ NOVA FUNÇÃO: Buscar produto específico da farmácia
  buscarProdutoPorIds: async (req, res) => {
    try {
      const { farmacia_id, produto_id } = req.params;
      
      console.log('🔍 Buscando produto específico:', { farmacia_id, produto_id });

      const farmaciaProduto = await FarmaciaProduto.findOne({
        where: { 
          farmacia_id: parseInt(farmacia_id), 
          produto_id: parseInt(produto_id) 
        },
        include: [{
          model: Produto,
          as: 'produto',
          attributes: ['id', 'nome', 'descricao', 'categoria_id', 'subcategoria_id', 'imagens', 'ativo', 'criado_em', 'atualizado_em']
        }]
      });

      if (!farmaciaProduto) {
        return res.status(404).json({ 
          error: 'Produto não encontrado nesta farmácia' 
        });
      }

      console.log('✅ Produto encontrado:', farmaciaProduto.id);

      // Formatar resposta
      const produtoFormatado = {
        ...farmaciaProduto.toJSON(),
        preco_venda: farmaciaProduto.preco_venda,
        produto: farmaciaProduto.produto ? {
          ...farmaciaProduto.produto.toJSON(),
          imagens: Array.isArray(farmaciaProduto.produto.imagens) 
            ? farmaciaProduto.produto.imagens 
            : JSON.parse(farmaciaProduto.produto.imagens || '[]')
        } : null
      };

      res.json(produtoFormatado);

    } catch (error) {
      console.error('💥 ERRO em buscarProdutoPorIds:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar produto',
        details: error.message
      });
    }
  },

  // ✅ NOVA FUNÇÃO: Atualizar produto da farmácia por IDs
  atualizarProdutoPorIds: async (req, res) => {
    try {
      const { farmacia_id, produto_id } = req.params;
      const { nome, descricao, categoria, subcategoria_id, imagens, preco_venda, estoque } = req.body;

      console.log('🔄 Atualizando produto:', { farmacia_id, produto_id });
      console.log('📦 Dados recebidos:', req.body);

      // Validar dados obrigatórios
      if (!nome || !preco_venda) {
        return res.status(400).json({
          error: 'Nome e preço são obrigatórios'
        });
      }

      // Buscar relação existente
      const farmaciaProduto = await FarmaciaProduto.findOne({
        where: { 
          farmacia_id: parseInt(farmacia_id), 
          produto_id: parseInt(produto_id) 
        }
      });

      if (!farmaciaProduto) {
        return res.status(404).json({ 
          error: 'Produto não encontrado nesta farmácia' 
        });
      }

      // Buscar produto para atualizar
      const produto = await Produto.findByPk(produto_id);
      if (!produto) {
        return res.status(404).json({ 
          error: 'Produto não encontrado' 
        });
      }

      // ✅ Atualizar dados do PRODUTO
      await produto.update({
        nome,
        descricao: descricao || produto.descricao,
        categoria_id: categoria || produto.categoria_id,
        subcategoria_id: subcategoria_id || produto.subcategoria_id,
        imagens: imagens ? JSON.stringify(imagens) : produto.imagens
      });

      // ✅ Atualizar dados na FARMACIA_PRODUTO
      await farmaciaProduto.update({
        preco_venda: parseFloat(preco_venda),
        estoque: parseInt(estoque) || 0
      });

      console.log('✅ Produto atualizado com sucesso');

      // Buscar dados atualizados
      const produtoAtualizado = await FarmaciaProduto.findOne({
        where: { 
          farmacia_id: parseInt(farmacia_id), 
          produto_id: parseInt(produto_id) 
        },
        include: [{
          model: Produto,
          as: 'produto'
        }]
      });

      res.json({
        message: 'Produto atualizado com sucesso!',
        farmaciaProduto: {
          ...produtoAtualizado.toJSON(),
          preco_venda: produtoAtualizado.preco_venda,
          produto: produtoAtualizado.produto ? {
            ...produtoAtualizado.produto.toJSON(),
            imagens: Array.isArray(produtoAtualizado.produto.imagens) 
              ? produtoAtualizado.produto.imagens 
              : JSON.parse(produtoAtualizado.produto.imagens || '[]')
          } : null
        }
      });

    } catch (error) {
      console.error('💥 ERRO em atualizarProdutoPorIds:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao atualizar produto',
        details: error.message
      });
    }
  }
};

module.exports = farmaciaProdutoController;