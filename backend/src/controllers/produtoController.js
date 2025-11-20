const { Produto, Categoria, Subcategoria, FarmaciaProduto } = require('../models/associations');
const Farmacia = require('../models/Farmacia');

const produtoController = {
  // ✅ CRIA APENAS O PRODUTO (SEM preço/estoque)
  criar: async (req, res) => {
    try {
      const {
        nome,
        descricao,
        categoria_id,
        subcategoria_id,
        imagens
      } = req.body;

      console.log('📦 Dados recebidos para criar produto:', req.body);

      // Validações (SEM preço/estoque/farmacia_id)
      if (!nome || !descricao || !categoria_id || !subcategoria_id) {
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios: nome, descricao, categoria_id, subcategoria_id'
        });
      }

      // Verificar se categoria e subcategoria existem
      const categoria = await Categoria.findByPk(categoria_id);
      const subcategoria = await Subcategoria.findByPk(subcategoria_id);

      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      if (!subcategoria) {
        return res.status(404).json({ error: 'Subcategoria não encontrada' });
      }

      // Verificar se a subcategoria pertence à categoria
      if (subcategoria.categoria_id !== parseInt(categoria_id)) {
        return res.status(400).json({
          error: 'Esta subcategoria não pertence à categoria selecionada'
        });
      }

      // ✅ Criar produto (SEM preço, SEM estoque, SEM farmacia_id)
      const produto = await Produto.create({
        nome: nome.trim(),
        descricao: descricao.trim(),
        categoria_id: parseInt(categoria_id),
        subcategoria_id: parseInt(subcategoria_id),
        imagens: imagens || []
      });

      console.log('✅ Produto criado com sucesso:', produto.id);

      // Buscar produto completo
      const produtoCompleto = await Produto.findByPk(produto.id, {
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'descricao']
          },
          {
            model: Subcategoria,
            as: 'subcategoria',
            attributes: ['id', 'nome', 'descricao']
          }
        ]
      });

      res.status(201).json({
        message: 'Produto criado com sucesso!',
        produto: produtoCompleto
      });

    } catch (error) {
      console.error('💥 Erro ao criar produto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao criar produto'
      });
    }
  },

  // ✅ ADICIONAR PRODUTO A UMA FARMÁCIA (com preço/estoque)
  adicionarAFarmacia: async (req, res) => {
    try {
      const {
        farmacia_id,
        produto_id,
        preco_venda,
        estoque
      } = req.body;

      console.log('🏪 Adicionando produto à farmácia:', req.body);

      // Validações
      if (!farmacia_id || !produto_id || !preco_venda) {
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios: farmacia_id, produto_id, preco_venda'
        });
      }

      // Verificar se farmácia e produto existem
      const farmacia = await Farmacia.findByPk(farmacia_id);
      const produto = await Produto.findByPk(produto_id);

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

      // ✅ Criar relação na FarmaciaProduto
      const farmaciaProduto = await FarmaciaProduto.create({
        farmacia_id: parseInt(farmacia_id),
        produto_id: parseInt(produto_id),
        preco_venda: precoEmCentavos,
        estoque: estoque ? parseInt(estoque) : 0
      });

      console.log('✅ Produto adicionado à farmácia com sucesso');

      res.status(201).json({
        message: 'Produto adicionado à farmácia com sucesso!',
        farmaciaProduto: {
          ...farmaciaProduto.toJSON(),
          preco_venda: farmaciaProduto.preco_venda / 100
        }
      });

    } catch (error) {
      console.error('💥 Erro ao adicionar produto à farmácia:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao adicionar produto à farmácia'
      });
    }
  },

  // ✅ LISTAR PRODUTOS DE UMA FARMÁCIA ESPECÍFICA
  listarPorFarmacia: async (req, res) => {
    try {
      const { farmacia_id } = req.params;

      const produtosFarmacia = await FarmaciaProduto.findAll({
        where: { farmacia_id },
        include: [
          {
            model: Produto,
            include: [
              {
                model: Categoria,
                as: 'categoria',
                attributes: ['id', 'nome', 'descricao']
              },
              {
                model: Subcategoria,
                as: 'subcategoria',
                attributes: ['id', 'nome', 'descricao']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      const produtosFormatados = produtosFarmacia.map(item => ({
        id: item.Produto.id,
        nome: item.Produto.nome,
        descricao: item.Produto.descricao,
        categoria: item.Produto.categoria,
        subcategoria: item.Produto.subcategoria,
        imagens: item.Produto.imagens,
        estoque: item.estoque,
        preco: item.preco_venda / 100, // Converter de centavos
        criado_em: item.Produto.criado_em,
        atualizado_em: item.Produto.atualizado_em
      }));

      res.json(produtosFormatados);

    } catch (error) {
      console.error('💥 Erro ao listar produtos da farmácia:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao listar produtos'
      });
    }
  },

  // ✅ LISTAR TODOS OS PRODUTOS (independente de farmácia)
  listarTodos: async (req, res) => {
    try {
      const produtos = await Produto.findAll({
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'descricao']
          },
          {
            model: Subcategoria,
            as: 'subcategoria',
            attributes: ['id', 'nome', 'descricao']
          }
        ],
        order: [['criado_em', 'DESC']]
      });

      res.json(produtos);

    } catch (error) {
      console.error('💥 Erro ao listar todos os produtos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao listar produtos'
      });
    }
  },

  // ✅ ATUALIZAR ESTOQUE/PREÇO NA FARMÁCIA
  atualizarEstoquePreco: async (req, res) => {
    try {
      const { farmacia_id, produto_id } = req.params;
      const { estoque, preco_venda } = req.body;

      const relacao = await FarmaciaProduto.findOne({
        where: { farmacia_id, produto_id }
      });

      if (!relacao) {
        return res.status(404).json({ error: 'Produto não encontrado nesta farmácia' });
      }

      const updates = {};
      if (estoque !== undefined) updates.estoque = parseInt(estoque);
      if (preco_venda !== undefined) {
        updates.preco_venda = Math.round(parseFloat(preco_venda) * 100);
      }

      await FarmaciaProduto.update(updates, {
        where: { farmacia_id, produto_id }
      });

      const relacaoAtualizada = await FarmaciaProduto.findOne({
        where: { farmacia_id, produto_id }
      });

      res.json({
        message: 'Produto atualizado com sucesso!',
        farmaciaProduto: {
          ...relacaoAtualizada.toJSON(),
          preco_venda: relacaoAtualizada.preco_venda / 100
        }
      });

    } catch (error) {
      console.error('💥 Erro ao atualizar produto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao atualizar produto'
      });
    }
  },

  // ✅ MÉTODOS EXISTENTES (mantidos iguais)
  
  // ✅ ESTES MÉTODOS PRECISAM EXISTIR:
  listarCategorias: async (req, res) => {
    try {
      const categorias = await Categoria.findAll({
        include: [{
          model: Subcategoria,
          as: 'subcategorias'
        }]
      });
      res.json({ categorias });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao carregar categorias' });
    }
  },

  listarSubcategorias: async (req, res) => {
    try {
      const { categoria_id } = req.params;
      const subcategorias = await Subcategoria.findAll({
        where: { categoria_id }
      });
      res.json({ subcategorias });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao carregar subcategorias' });
    }
  },

  // ... outros métodos
};

module.exports = produtoController;